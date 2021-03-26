const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const MakiToken = artifacts.require('MakiToken');
const SoyBar = artifacts.require('SoyBar');

contract('SoyBar', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.maki = await MakiToken.new({ from: minter });
    this.soy = await SoyBar.new(this.maki.address, { from: minter });
  });

  it('mint', async () => {
    await this.soy.mint(alice, 1000, { from: minter });
    assert.equal((await this.soy.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('650');
    await this.soy.mint(alice, 1000, { from: minter });
    await this.soy.mint(bob, 1000, { from: minter });
    assert.equal((await this.soy.totalSupply()).toString(), '2000');
    await this.soy.burn(alice, 200, { from: minter });

    assert.equal((await this.soy.balanceOf(alice)).toString(), '800');
    assert.equal((await this.soy.totalSupply()).toString(), '1800');
  });

  it('safeMakiTransfer', async () => {
    assert.equal(
      (await this.maki.balanceOf(this.soy.address)).toString(),
      '0'
    );
    await this.maki.mint(this.soy.address, 1000, { from: minter });
    await this.soy.safeMakiTransfer(bob, 200, { from: minter });
    assert.equal((await this.maki.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.maki.balanceOf(this.soy.address)).toString(),
      '800'
    );
    await this.soy.safeMakiTransfer(bob, 2000, { from: minter });
    assert.equal((await this.maki.balanceOf(bob)).toString(), '1000');
  });
});