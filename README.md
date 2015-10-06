This is a wrapper around Justin Latimer's [midi][node-midi] module, specifically implementing an interface for the [Midi Show Control][msc] spec for controlling theatrical fixtures and automation.

[node-midi]: https://github.com/justinlatimer/node-midi
[msc]: http://oktopus.hu/uploaded/Tudastar/MIDI%20Show%20Control%20Specification.pdf


<!-- TOC depth:2 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Please Note](#please-note)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
	- [mscInput()](#mscinput)
	- [mscOutput()](#mscoutput)
	- [Message Options](#message-options)
	- [Available Command Formats](#available-command-formats)
	- [Available Commands](#available-commands)
<!-- /TOC -->


# Please Note

This project is BETA, under very active development. I am developing it for a specific project, so at this time not all MSC features have been implemented (eg. Time Codes). The API may change until I release 1.0.0. I will happily accept pull requests if you find bugs or want to implement new features yourself.

# Prerequisites 

The following are required to build the [midi module][node-midi] on which this module is based.

**OSX**

  * Some version of Xcode (or Command Line Tools)
  * Python (for node-gyp)


**Windows**

  * Microsoft Visual C++ (the Express edition works fine)
  * Python (for node-gyp)

**Linux**

  * A C++ compiler
  * You must have installed and configured ALSA. Without it this module will NOT build.
  * Install the libasound2-dev package.
  * Python (for node-gyp)
    
# Installation

    npm install midi-show-control
 
# Usage

## mscInput()

The input object is an instance of the midi module's input object, but which does not ignore sysex messages and which emits an extra event if the incoming message matches the signature of a MSC message. See [here][midi-input] for more info on the midi input object.

[midi-input]: https://github.com/justinlatimer/node-midi#input

```js
    
var msc = require("midi-show-control");

// note this does not require the `new` keyword,
// which differs from the node-midi implementation of input()
var input = msc.mscInput();

input.on("msc", function(deltaTime, message, mscObject){
    // deltaTime: seconds since first message received 
    // message: raw array of integer values
    // mscObject: parsed message as options hash
    console.log(mscObject);
    // example mscObject.  See Message Options below
    // {
    //    deviceId: 2,
    //    commandFormat: "lighting.general",
    //    command: "go",
    //    cue: "25.5",
    //    cueList: "3"
    //}
})

input.openPort(0);

// Do something amazing with your new Show Control enabled app
// ...
// ...

input.closePort(); // close port when done;
```

## mscOutput()

The output object is an instance of the midi module's output object, which has an extra method `sendMsc()`, which will translate an options hash into a show control message. See [here][midi-output] for more info on the midi output object.

[midi-output]: https://github.com/justinlatimer/node-midi#output

```js

var msc = require('midi-show-control');

// note this does not require the `new` keyword,
// which differs from the node-midi implementation of output()
var output = msc.mscOutput();

output.openPort(0);

// See "Message Options" below for full documentation on available options
output.sendMsc({
    deviceId: 2,
    commandFormat: "sound.general",
    command: "go",
    cue: "25.5",
    cueList: "3.1",
    cuePath: "1.2"
})

// Do more amazing things
// ...
// ...

output.closePort() // close port when done 

```


## Message Options 

These are the available properties on the message options object:

  * **deviceId**: REQUIRED - The id of the device that the message is intended for.  
    * integer between 0 (0x00) and 111 (0x6F) targets a specific device 
    * "G1" through "G15" will target a groups 1 through 15 respectively, and correspond to sending a midi device ID of 0x70 to 0x7E
    * "all" will target all devices, and corresponds to a midi deviceId of 0x7F
   
  * **commandFormat**: REQUIRED - The command format of the message, eg "lighting.general" or "all". See below for available formats.
  
  * **command**: REQUIRED - The specific command to issue, eg. "go", "stop", or "resume".  See below for available commands.
  
  * **cue**: *optional* - The cue to issue the command to.
  
  * **cueList**: *optional* - The cue list on which to find the cue.
  
  * **cuePath**: *optional* - From which of the available media the cueList should be pulled. 
  
## Available Command Formats

Currently, only the "general" subcategory of each category is implemented 

 hex    |  decimal   |  Command Format
 ------ | ---------- | -------------------
`0x01`  |       `1`  |  lighting.general
`0x10`  |      `16`  |  sound.general
`0x20`  |      `32`  |  machinery.general
`0x30`  |      `48`  |  video.general
`0x40`  |      `64`  |  projection.general
`0x50`  |      `80`  |  processControl.general
`0x60`  |      `96`  |  pyro.general
`0x7f`  |     `127`  |  all

## Available Commands

 hex    |  decimal   |  Command
 ------ | ---------- | --------
`0x01`  |       `1`  |  go
`0x02`  |       `2`  |  stop
`0x03`  |       `3`  |  resume
`0x04`  |       `4`  |  timedGo
`0x05`  |       `5`  |  load
`0x06`  |       `6`  |  set
`0x07`  |       `7`  |  fire
`0x08`  |       `8`  |  allOff
`0x09`  |       `9`  |  restore
`0x0a`  |      `10`  |  reset
`0x0b`  |      `11`  |  goOf
