var _ = require("lodash");
var util = require("./util");

var map = {
    
    /**
     * Mapping COMMAND_FORMAT to MIDI hex values
     */
    commandFormatToHex : {

        "lighting": {
            "general": 0x01
        },
        
        "sound": {
            "general": 0x10
        },
        
        "machinery": {
            "general": 0x20
        },
        
        "video": {
            "general": 0x30
        },
        
        "projection": {
            "general": 0x40
        },
        
        "processControl": {
            "general": 0x50
        },
        
        "pyro": {
            "general": 0x60
        },

        "all": 0x7f
    },
    
    /**
     * Mapping COMMAND to MIDI hex 
     */
    commandToHex : {
        "go"      :0x01,
        "stop"    :0x02,
        "resume"  :0x03,
        "timedGo" :0x04,
        "load"    :0x05,
        "set"     :0x06,
        "fire"    :0x07,
        "allOff"  :0x08,
        "restore" :0x09,
        "reset"   :0x0A,
        "goOff"   :0x0B
    }
}
    
map.hexToCommandFormat = util.invertMap(map.commandFormatToHex);
map.hexToCommand = util.invertMap(map.commandToHex);



module.exports = exports = {
    commandFormatToHex: function(cf) {
        return util.dotNotatedIndex(map.commandFormatToHex, cf);
    },
    
    hexToCommandFormat: function(hx) {
        return map.hexToCommandFormat[hx];
    },
    
    commandToHex: function(com) {
        return map.commandToHex[com];
    },
    
    hexToCommand: function(hx) {
        return map.hexToCommand[hx];
    },
    
    deviceIdToHex: function(deviceId) {
        if (_.isNumber(deviceId)) {
            return parseIntegerDeviceId(deviceId);
        }
        
        if (deviceId.toLowerCase) {
            return parseStringDeviceId(deviceId);
        }

        throw new Error("Invalid deviceId.");    
    },
    
    hexToDeviceId: function(int) {
        if (_.isNaN(int)
        || int < 0 
        || int > 0x7F) {
            throw new Error("hexToDeviceId expects an integer between 0 (0x00) and 127 (0x7F)");
        }
        
        if (int < 0x70) {
            return int;
        }
        
        if (int === 0x7F) {
            return "all";
        }
        
        var g = int - 0x6F;
        return "G" + g;
    },
    
    parseMessage: function(message) {
        if (!util.messageIsMsc(message)) {
            throw new Error("That does not appear to be a MIDI Show Control message")
        }
        
        var cueData = parseCueData(message);
        var obj = {
            deviceId      : exports.hexToDeviceId(message[2]),
            commandFormat : exports.hexToCommandFormat(message[4]),
            command       : exports.hexToCommand(message[5]),
            dataBytes     : extractDataBytes(message),
            cue           : cueData.cue,
            cueList       : cueData.cueList,
            cuePath       : cueData.cuePath
        }
        
        return obj;
    },
    
    buildMessage: function(obj) {
        var required = ['deviceId', 'commandFormat', 'command']
        _.each(required, function(attr){
            if (!obj[attr]) throw new Error(attr + " is a required attribute");
        })
        
        var deviceId      = exports.deviceIdToHex(obj.deviceId);
        var commandFormat = exports.commandFormatToHex(obj.commandFormat);
        var command       = exports.commandToHex(obj.command);
        
        var message = [
            0xF0,
            0x7F,
            deviceId,
            0x02,
            commandFormat,
            command
        ]
        
        var cueData = buildCueBytes(obj);
        if (obj.cue) {
            message.push(cueData.cue);
        }
        
        if (obj.cueList) {
            message.push(0x00);
            message.push(cueData.cueList);
        }
        
        if (obj.cuePath) {
            message.push(0x00);
            message.push(cueData.cuePath);
        }
        
        message.push(0xF7);
        return _.flatten(message);
    },
    
    getAvailableCommandFormats: function() {
        return map.hexToCommandFormat;
    },

    getAvailableCommands: function() {
        return map.hexToCommand;
    }
}

function parseStringDeviceId(deviceId) {
    deviceId = deviceId.toLowerCase();
    if (deviceId === 'all') {
        return 0x7F;
    }
    
    var match = deviceId.match(/^G(\d{1,2})$/i)
    if (match) {
        var g = parseInt(match[1]);
        if (g < 1 || g > 15) {
            throw new Error("Group numbers must be within 1 and 15 inclusive");
        }
        return 0x6F + g;
    }

    throw new Error("Invalid deviceId.");
}

function parseIntegerDeviceId(deviceId) {
    
    if (deviceId >= 0x00
    &&  deviceId <= 0x6F) {
        return _.parseInt(deviceId);
    }
    
    throw new Error("Integer deviceId's must be between 0 (0x00) and 111 (0x6F)");

}

function extractDataBytes(message) {
    return message.slice(6, -1);
}

function parseCueData(message) {
    var data = extractDataBytes(message);
    if (data[0] < 0x30 || data[0] > 0x39) {
        return { cue: null, cueList: null, cuePath: null }
    }
    
    var arrs = [
        [], // cue
        [], // cueList
        []  // cuePath
    ]
    
    var c = 0; // index of arrs;
    while (data.length) {
        var val = data.shift();
        if (val === 0x00) {
            c++;
        } else {
            arrs[c].push(val)
        }
    }
    
    return {
        cue     : byteArrayToString(arrs[0]),
        cueList : byteArrayToString(arrs[1]),
        cuePath : byteArrayToString(arrs[2])
    }
}

function buildCueBytes(obj) {
    ret = { cue: [], cueList: [], cuePath: [] };
    if (obj.cue) {
        ret.cue = stringToByteArray(obj.cue);
    }
    
    if (obj.cueList) {
        ret.cueList = stringToByteArray(obj.cueList);
    }
    
    if (obj.cuePath) {
        ret.cuePath = stringToByteArray(obj.cuePath);
    }
    
    return ret;
}

function byteArrayToString(arr) {
    var ret = "";
    for (var i=0; i<arr.length; i++) {
        ret += String.fromCharCode(arr[i])
    }
    return ret;
}

function stringToByteArray(str) {
    if (str.toString) {
        str = str.toString();
    }
    
    var ret = [];
    for (var i=0; i<str.length; i++) {
        var char = parseInt(str.charCodeAt(i));
        ret.push(char);
    }
    return ret;
}
