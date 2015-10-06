var should = require("should");
var msc = require("../lib/msc");

describe("msc module", function() {
    
    describe("commandFormatToHex() method", function(){
        
        it("should convert dot notation to hex integer", function(done) {
            msc.commandFormatToHex("sound.general").should.eql(0x10);
            msc.commandFormatToHex("lighting.general").should.eql(0x01);
            msc.commandFormatToHex("all").should.eql(0x7F);
            done();
        });

    })
    
    describe("hexToCommandFormat() method", function(){
        
        it("should convert hex integer to dot-notated command format", function(done){
            msc.hexToCommandFormat(0x40).should.eql("projection.general");
            msc.hexToCommandFormat(0x7F).should.eql("all");
            done();
        });

    })
    
    describe("commandToHex() method", function() {
        
        it("should convert plaintext command to hex integer", function(done){
            msc.commandToHex("go").should.eql(0x01);
            done();
        })
    })
    
    describe("hexToCommand() method", function() {
        
        it("should convert hex integer to plaintext command", function(done){
            msc.hexToCommand(0x01).should.eql("go");
            msc.hexToCommand(2).should.eql("stop");
            done();
        })
    });
    
    describe("deviceIdToHex() method", function() {
        
        it("should convert plaintext deviceIds to integer", function(done){
            msc.deviceIdToHex("all").should.eql(0x7F);
            msc.deviceIdToHex("G7").should.eql(0x76);
            msc.deviceIdToHex("G15").should.eql(0x7E);
            msc.deviceIdToHex(15).should.eql(0x0F);
            msc.deviceIdToHex(21).should.eql(0x15);
            done();
        });
        
        it("should throw errors for invalid inputs", function(done){
            (function(){
                msc.deviceIdToHex(-1);
            }).should.throw(/must be between/i);
            
            (function(){
                msc.deviceIdToHex(0x8F);
            }).should.throw(/must be between/i);
            
            (function(){
                msc.deviceIdToHex("foo");
            }).should.throw(/invalid deviceId/i);
            
            (function(){
                msc.deviceIdToHex("G25");
            }).should.throw(/group numbers must be within/i)
            
            done();
        })
    });
    
    describe("hexToDeviceId() method", function() {
        it("should convert integer to plaintext deviceId", function(done){
            msc.hexToDeviceId(0x7F).should.eql("all");
            msc.hexToDeviceId(0x76).should.eql("G7");
            msc.hexToDeviceId(0x7E).should.eql("G15");
            msc.hexToDeviceId(0x0F).should.eql(15);
            msc.hexToDeviceId(0x15).should.eql(21);
            done();
        })

        it("should throw errors for invalid inputs", function(done){
            (function(){
                msc.hexToDeviceId(-1);
            }).should.throw(/expects an integer between/i);
            
            (function(){
                msc.hexToDeviceId(0x8F);
            }).should.throw(/expects an integer between/i);
            
            done();
        });
    });
    
})
