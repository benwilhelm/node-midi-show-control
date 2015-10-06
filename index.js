var midi = require("midi");
var msc = require("./lib/msc");
var _ = require("lodash");

midi.mscInput = function() {
    var input = new midi.input();
    input.on("message", function(deltaTime, message) {
        if (message[0] === 0xF0 
        &&  message[1] === 0x7F
        &&  message[3] === 0x02) {
            mscObj = msc.parseMessage(message);
            input.emit("msc", deltaTime, message, mscObj);
        }
    });
    input.ignoreTypes(false, true, true);
    return input;
}

midi.mscOutput = function() {
    var output = new midi.output();
    output.sendMsc = function(obj) {
        var message = msc.buildMessage(obj);
        output.sendMessage(message);
    }
    return output;
}

module.exports = midi;
