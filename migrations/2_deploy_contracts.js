const Factory = artifacts.require('MakiSwapFactory.sol');
const Router = artifacts.require('MakiSwapRouter02.sol');
const WTH = artifacts.require('WTH.sol');
const MockHRC20 = artifacts.require('MockHRC20.sol');
const MakiToken = artifacts.require('MakiToken.sol');
const MasterChef = artifacts.require('MasterChef.sol');
const SoyBar = artifacts.require('SoyBar.sol');

module.exports = async function(deployer, addresses) {
  
  // Deploy Mock Tokens
    await deployer.deploy(WTH);
    const wht = await WHT.deployed();
    const tokenA = await MockHRC20.new('Token A', 'TKA', web3.utils.toWei('1000'));
    const tokenB = await MockHRC20.new('Token B', 'TKB', web3.utils.toWei('1000'));
  
  // Deploy Factory
    await deployer.deploy(Factory, addresses[0]); // alt process.env.ADMIN_ADDRESS
    const factory = await Factory.deployed();

  // Create LP Pair
    await factory.createPair(wht.address, tokenA.address);
    await factory.createPair(wht.address, tokenB.address);

    
    await deployer.deploy(Router, factory.address, wht.address);
    const router = await Router.deployed();
  
    // Deploy Maki Token Contract
    await deployer.deploy(MakiToken)
    const makiToken = await MakiToken.deployed()

    // Deploy Soy Token Contract
    await deployer.deploy(SoyBar, makiToken.address)
    const soyToken = await SoyBar.deployed()

// Deploy MasterChef Contract
  await deployer.deploy(
    MasterChef,
    makiToken.address,
    soyToken.address,
    process.env.ADMIN_ADDRESS, // Your address where you get MAKI tokens - should be a multisig
    process.env.TREASURY_ADDRESS, // Your address where you collect fees - should be a multisig
    web3.utils.toWei(process.env.TOKENS_PER_BLOCK), // Number of tokens rewarded per block, e.g., 100
    process.env.START_BLOCK // Block number when token mining starts
  )
 
// Make MasterChef contract token owner for makiToken and soyToken
  const masterChef = await MasterChef.deployed()
  await makiToken.transferOwnership(masterChef.address)
  await soyToken.transferOwnership(masterChef.address)

}
