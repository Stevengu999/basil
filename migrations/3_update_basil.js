const Registry = artifacts.require('zos-core/contracts/Registry.sol');
const OwnedUpgradeabilityProxy = artifacts.require('zos-core/contracts/upgradeability/OwnedUpgradeabilityProxy.sol');
const Basil = artifacts.require("./Basil.sol");

const data = require('../data/deploy_data.json');

module.exports = async function(deployer, network, accounts) {
  deployer.then(async () => {
    // Retrieve proxy.                    
    const proxyAddress = data[network].proxyAddress;
    if(!proxyAddress) return;             
    console.log(`> retrieving proxy at: ${proxyAddress}`);
    const proxy = OwnedUpgradeabilityProxy.at(proxyAddress);

    // Retrieve registry.
    const registryAddress = data[network].registryAddress;
    if(!registryAddress) return;             
    console.log(`> retrieving registry at: ${registryAddress}`);
    const registry = Registry.at(registryAddress);

    // Deploy the new implementation.
    const version = '1';
    console.log(`> deploying Basil implementation version ${version}`);
    const implementation = await Basil.new();
    console.log(`> implementation deployed: ${implementation.address}`);

    // Upload new implementation to the registry.
    await registry.addVersion(version, implementation.address);
    console.log(`> registered version ${version}, implementation: ${await registry.getVersion(version)}`);

    // Update proxy to use this new version.
    const owner = accounts[0];                        
    console.log(`> upgrading proxy to version ${version}`);
    await proxy.upgradeTo(version);
    console.log(`> proxy upgraded to version ${await proxy.version()}, with implementation: ${await proxy.implementation()}`);
  });
}







                                                    
                                                    
                                                    
                                                    
                                                    
                                                    
                                                    
