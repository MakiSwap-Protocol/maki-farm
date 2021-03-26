const { assert } = require("chai");

const MakiToken = artifacts.require('MakiToken');

contract('MakiToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.maki = await MakiToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.maki.mint(alice, 1000, { from: minter });
        assert.equal((await this.maki.balanceOf(alice)).toString(), '1000');
    })
});
