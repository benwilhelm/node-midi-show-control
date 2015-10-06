var midi = require("midi");
var msc = require("./lib/msc");
var util = require("./lib/util");
var _ = require("lodash");

midi.mscInput = function() {
    var input = new midi.input();
    input.on("message", function(deltaTime, message) {
        if (util.messageIsMsc(message)) {
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
