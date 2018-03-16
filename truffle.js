require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    ropsten: {
      host: 'localhost',
      port: 8545,
      network_id: 3,
    }
  }
};
