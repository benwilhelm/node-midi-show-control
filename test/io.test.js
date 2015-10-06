
describe("mscInput msc event", function(){
    
    it("should emit event with MSC message object", function(done){
        
        mscInput.once("msc", function(deltaTime, message, mscObj){
            mscObj.deviceId.should.eql(1);
            mscObj.commandFormat.should.eql("machinery.general");
            mscObj.command.should.eql("go");
            mscObj.dataBytes.should.eql([
                0x32, 0x35, 0x2E, 0x35, // cue - 25.5
                0x00,                   // delimiter
                0x33, 0x2E, 0x31,       // cue list 3.1
                0x00,                   // delimiter
                0x31, 0x2E, 0x39        // cue path 1.9
            ]);
            mscObj.cue.should.eql("25.5");
            mscObj.cueList.should.eql("3.1");
            mscObj.cuePath.should.eql("1.9");
            done();
        });

        setTimeout(function(){
            mscOutput.sendMessage(testMessage);
        }, 1000)
    })
});

describe("mscOutput.sendMsc() method", function() {
    
    it("should convert msc options hash into byte array", function(done){
        var spy = sinon.spy(mscOutput, 'sendMessage');
        mscOutput.sendMsc({
            deviceId: 1,
            commandFormat: "machinery.general",
            command: "go",
            cue: "25.5",
            cueList: 3.1, // should parse to string
            cuePath: "1.9"
        })
        spy.calledOnce.should.be.true();
        spy.calledWith(testMessage).should.be.true();
        done();
    })
})

after(function(done){
    mscInput.closePort();
    mscOutput.closePort();
    done();
})
