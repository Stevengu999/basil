import * as config from '../../truffle.js';

// export const ACTIVE_NETWORK = config.networks.development;
export const ACTIVE_NETWORK = config.networks.ropsten;

// export const BASIL_ADDRESS = "0x4103dee0e21ad2d2181a887034fe52fe446f7f25"; // Non zos manual deploy
const deployData = require(`../../package.zos.${ACTIVE_NETWORK.name}.json`);
export const BASIL_ADDRESS = deployData.proxies.Basil[0].address;
export const TOKEN_ADDRESS = deployData.proxies.MintableERC721Token[0].address;
