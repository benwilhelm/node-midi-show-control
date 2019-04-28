// const should = require('should');
const expect = require('chai').expect
const msc = require('../index')
const testVals = require("./_constants")

describe("parseMessage", function(){

    it("should convert byte array to message object", function(){
        const msgObj = msc.parseMessage(testVals.testMessage)

        expect(msgObj.deviceId).to.equal(1);
        expect(msgObj.commandFormat).to.equal("machinery.general");
        expect(msgObj.command).to.equal("go");
        expect(msgObj.dataBytes).to.eql([
          0x32, 0x35, 0x2E, 0x35, // cue - 25.5
          0x00,                   // delimiter
          0x33, 0x2E, 0x31,       // cue list 3.1
          0x00,                   // delimiter
          0x31, 0x2E, 0x39,       // cue path 1.9
        ]);
        expect(msgObj.cue).to.equal("25.5");
        expect(msgObj.cueList).to.equal("3.1");
        expect(msgObj.cuePath).to.equal("1.9");
    })

    it('should throw on invalid message', () => {
      const message = [0x173, 0x02, 0x13];
      expect(() => {
        msc.parseMessage(message)
      }).to.throw(/that does not appear to be a midi show control message/i)
    })
});

describe("buildMessage", function() {

    it("should convert msc options hash into byte array", function(){
        const msgArr = msc.buildMessage({
            deviceId: 1,
            commandFormat: "machinery.general",
            command: "go",
            cue: "25.5",
            cueList: 3.1, // should parse to string
            cuePath: "1.9"
        })
        expect(msgArr).to.eql(testVals.testMessage)
    })
})
