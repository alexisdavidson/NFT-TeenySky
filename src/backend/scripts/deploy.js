// Before deploy:
// -Fill whitelist addresses with correct data!
// -Team Wallet mainnet: 
// -Team Wallet rinkeby: 

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Fill with correct data and uncomment the correct network before deploy!
  // const teamWallet = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"; // localhost
  const teamWallet = "0x6779249234bdA39Cb7AF2aA4e35d658d7548DDAe"; // goerli
  // const teamWallet = ""; // mainnet
  // const teamWallet = "0xCaC8c3f44f913b012D304d36E94BA124B1Ca8A9B"; // mumbai
  
  // Fill with correct data and uncomment the correct network before deploy!
  // const whitelistAddresses = [teamWallet, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"] // localhost
  const whitelistAddresses = [teamWallet, "0xD71E736a7eF7a9564528D41c5c656c46c18a2AEd"] // goerli
  // const whitelistAddresses = [teamWallet] // mainnet
  // const whitelistAddresses = [teamWallet] // mumbai
  
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(teamWallet, whitelistAddresses);
  console.log("NFT contract address", nft.address)
  
  saveFrontendFiles(nft, "NFT");

  console.log("Frontend files saved")
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
