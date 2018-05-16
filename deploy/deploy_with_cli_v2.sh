#! /usr/bin/env bash

# Enable command logging.
set -x

NETWORK=$1
INJECT_ZOS=$2
OWNER=$3

# Util to trace accounts.
# echo "console.log(web3.eth.accounts)" | truffle console --network $NETWORK
# exit

# -------------------------------------------------------------------------------
# New version of Basil.sol that uses an on-chain ERC721 token implementation
# -------------------------------------------------------------------------------

# Upgrade the project to a new version, so that new implementations can be registered
zos bump 0.0.2

# Upgrade main contract version
zos add BasilERC721:Basil

# Deploy all implementations in the specified network.
zos push --network $NETWORK --skip-compile

# Upgrade the existing contract proxy to use the new version
BASIL=$(jq ".proxies.Basil[0].address" package.zos.$NETWORK.json --raw-output)
zos upgrade Basil "$BASIL" --network $NETWORK

# Link to ZeppelinOS standard library
zos link openzeppelin\-zos --no-install

# If on a local network, inject a simulation of the stdlib.
if [ $INJECT_ZOS == true ] 
then
  zos push --deploy-stdlib --network $NETWORK --skip-compile
fi

# Create a proxy for the standard library's ERC721 token.
echo "Using Basil proxy deployed at: "$BASIL
zos create MintableERC721Token --init --from $OWNER --args $BASIL,BasilToken,BSL --network $NETWORK

# Read deployed addresses
ERC721=$(jq ".proxies.MintableERC721Token[0].address" package.zos.$NETWORK.json)
echo "Token deployed at: "$ERC721

# Register the token in Basil.
echo "Registering token in Basil..."
echo "BasilERC721.at(\"$BASIL\").setToken($ERC721, {from: \"$OWNER\"})" | truffle console --network $NETWORK

# Disable command logging
set +x
