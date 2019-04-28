var util = require("../lib/util");
const testVals = require('./_constants')
const expect = require('chai').expect

var map = {
    "all": 0x7F,
    "sound": {
        "general": 0x10
    }
}


describe("util module", function() {

    describe("invertMap() method", function() {

        it("should invert objects and flatten indices to dot notation", function(){
            var inverted = util.invertMap(map);
            expect(inverted[0x10]).to.equal("sound.general");
            expect(inverted[0x7F]).to.equal("all");
        })
    });

    describe("dotNotatedIndex() method", function(){

        it("should return nested property from dot-notated index", function(){
            expect(util.dotNotatedIndex(map, "all")).to.equal(0x7F);
            expect(util.dotNotatedIndex(map, "sound.general")).to.equal(0x10);
        })

        it('should be case-insensitive', function(){
            expect(util.dotNotatedIndex(map, "Sound.General")).to.equal(0x10);
        })
    });

    describe("messageIsMsc() method", function() {

        it("should return true for MSC method", function(){
            expect(util.messageIsMsc(testVals.testMessage)).to.equal(true);
        });

        it("should return false for other messages", function() {
            var message = [0x173, 0x02, 0x13];
            expect(util.messageIsMsc(message)).to.equal(false);
        })
    })
})
