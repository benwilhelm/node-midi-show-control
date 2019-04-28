This small library to make working with [MIDI Show Control][msc] messages easier.

[msc]: http://oktopus.hu/uploaded/Tudastar/MIDI%20Show%20Control%20Specification.pdf

**PLEASE NOTE**

Version 2 no longer includes a MIDI library. This library is simply a few methods for translating byte arrays to options objects and vice versa. You can use any MIDI Library which supports SysEx messages.


# Installation

    npm install midi-show-control

# Usage

## buildMessage()

Takes an object of human-readable values and converts to a MIDI SysEx message.

```javascript

const msc = require('midi-show-control')
const midiOutput = require('some-midi-library').output

const message = msc.buildMessage({
    deviceId: 1,
    commandFormat: "sound.general",
    command: "go",
    cue: "25.5",
    cueList: "3.1",
    cuePath: "1.9"
})
midiOutput.send(message)

```

The sent MIDI message in the example above would be:

```
[
    0xF0, // indicates sysex message
    0x7F, // indicates sysex message
    0x01, // deviceId
    0x02, // defines message as msc
    0x10, // commandFormat
    0x01, // command
    0x32, 0x35, 0x2E, 0x35, // cue - 25.5
    0x00,                   // delimiter
    0x33, 0x2E, 0x31,       // cue list 3.1
    0x00,                   // delimiter
    0x31, 0x2E, 0x39,       // cue path 1.9
    0xF7
]
```

## parseMessage()

`parseMessage()` does the reverse of `buildMessage()`. It takes an incoming MIDI message (a byte array) and returns an object of human-readable values

```javascript

const msc = require('midi-show-control')
const midiInput = require('some-midi-library').output

midiInput.on('message', (msg) => {
	const parsedMessage = msc.parseMessage(msg)
	doSomethingWith(parsedMessage)

	// parsed Message would be something similar to
	// {
	//     deviceId: 1,
	//     commandFormat: "sound.general",
	//     command: "go",
	//     cue: "25.5",
	//     cueList: "3.1",
	//     cuePath: "1.9"
	// }
})

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

| hex    | decimal | Command Format         |
|:-------|:--------|:-----------------------|
| `0x01` | `1`     | lighting.general       |
| `0x10` | `16`    | sound.general          |
| `0x20` | `32`    | machinery.general      |
| `0x30` | `48`    | video.general          |
| `0x40` | `64`    | projection.general     |
| `0x50` | `80`    | processControl.general |
| `0x60` | `96`    | pyro.general           |
| `0x7f` | `127`   | all                    |

## Available Commands

| hex    | decimal | Command |
|:-------|:--------|:--------|
| `0x01` | `1`     | go      |
| `0x02` | `2`     | stop    |
| `0x03` | `3`     | resume  |
| `0x04` | `4`     | timedGo |
| `0x05` | `5`     | load    |
| `0x06` | `6`     | set     |
| `0x07` | `7`     | fire    |
| `0x08` | `8`     | allOff  |
| `0x09` | `9`     | restore |
| `0x0a` | `10`    | reset   |
| `0x0b` | `11`    | goOf    |
