var msc = require("../lib/msc");
const expect = require('chai').expect

describe("msc module", function() {

    describe("commandFormatToHex() method", function(){

        it("should convert dot notation to hex integer", function() {
            expect(msc.commandFormatToHex("sound.general")).to.equal(0x10);
            expect(msc.commandFormatToHex("lighting.general")).to.equal(0x01);
            expect(msc.commandFormatToHex("all")).to.equal(0x7F);

        });

    })

    describe("hexToCommandFormat() method", function(){

        it("should convert hex integer to dot-notated command format", function(){
            expect(msc.hexToCommandFormat(0x40)).to.equal("projection.general");
            expect(msc.hexToCommandFormat(0x7F)).to.equal("all");

        });

    })

    describe("commandToHex() method", function() {

        it("should convert plaintext command to hex integer", function(){
            expect(msc.commandToHex("go")).to.equal(0x01);

        })
    })

    describe("hexToCommand() method", function() {

        it("should convert hex integer to plaintext command", function(){
            expect(msc.hexToCommand(0x01)).to.equal("go");
            expect(msc.hexToCommand(2)).to.equal("stop");

        })
    });

    describe("deviceIdToHex() method", function() {

        it("should convert plaintext deviceIds to integer", function(){
            expect(msc.deviceIdToHex("all")).to.equal(0x7F);
            expect(msc.deviceIdToHex("G7")).to.equal(0x76);
            expect(msc.deviceIdToHex("G15")).to.equal(0x7E);
            expect(msc.deviceIdToHex(15)).to.equal(0x0F);
            expect(msc.deviceIdToHex(21)).to.equal(0x15);

        });

        it("should throw errors for invalid inputs", function(){
            expect(function(){
                msc.deviceIdToHex(-1);
            }).to.throw(/must be between/i);

            expect(function(){
                msc.deviceIdToHex(0x8F);
            }).to.throw(/must be between/i);

            expect(function(){
                msc.deviceIdToHex("foo");
            }).to.throw(/invalid deviceId/i);

            expect(function(){
                msc.deviceIdToHex("G25");
            }).to.throw(/group numbers must be within/i)


        })
    });

    describe("hexToDeviceId() method", function() {
        it("should convert integer to plaintext deviceId", function(){
            expect(msc.hexToDeviceId(0x7F)).to.equal("all");
            expect(msc.hexToDeviceId(0x76)).to.equal("G7");
            expect(msc.hexToDeviceId(0x7E)).to.equal("G15");
            expect(msc.hexToDeviceId(0x0F)).to.equal(15);
            expect(msc.hexToDeviceId(0x15)).to.equal(21);

        })

        it("should throw errors for invalid inputs", function(){
            expect(function(){
                msc.hexToDeviceId(-1);
            }).to.throw(/expects an integer between/i);

            expect(function(){
                msc.hexToDeviceId(0x8F);
            }).to.throw(/expects an integer between/i);


        });
    });



})
