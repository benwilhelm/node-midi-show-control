var midi = require("../index");
global.should = require('should');
global.sinon = require("sinon");
global.mscInput = midi.mscInput();
global.mscOutput = midi.mscOutput();
global.testMessage = [ 
    0xF0, // sysex
    0x7F, // sysex
    0x01, // deviceId
    0x02, // msc
    0x20, // commandFormat
    0x01, // command
    0x32, 0x35, 0x2E, 0x35, // cue - 25.5
    0x00,                   // delimiter
    0x33, 0x2E, 0x31,       // cue list 3.1
    0x00,                   // delimiter
    0x31, 0x2E, 0x39,       // cue path 1.9
    0xF7 
];

mscOutput.openPort(0);
mscInput.openPort(0);
