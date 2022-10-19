const { expect } = require("chai")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFT", async function() {
    let deployer, addr1, addr2, nft
    let URI = "ipfs://QmSyiuuT6QcCoLcy15MwoFn6dgkgzg63ebFvrxQLerFkMe/"
    let teamWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    let whitelist = []

    beforeEach(async function() {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");

        // Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        whitelist = [addr1.address, addr2.address]

        // Deploy contracts
        nft = await NFT.deploy(teamWallet, whitelist);
    });

    describe("Deployment", function() {
        it("Should track name and symbol of the nft collection", async function() {
            expect(await nft.name()).to.equal("teenySkySJBBs")
            expect(await nft.symbol()).to.equal("TSSJBBS")
        })
    })

    describe("Minting NFTs", function() {
        it("Should track each minted NFT", async function() {
            // addr1 mints an nft
            let price = fromWei(await nft.getPrice())
            console.log("Price: " + price)
            await nft.connect(addr1).mint(1, { value: toWei(price) });
            expect(await nft.totalSupply()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            // addr2 mints 2 nfts
            // mint 2 or more, 1 free
            await nft.connect(addr2).mint(2, { value: toWei(price * 2) });
            expect(await nft.totalSupply()).to.equal(4);
            expect(await nft.balanceOf(addr2.address)).to.equal(3);
        })

        it("Should not mint more NFTs than the max supply", async function() {
            await expect(nft.connect(addr1).mint(16000)).to.be.revertedWith('Cannot mint more than max supply');
        })
    })

    describe("URIs", function() {
        it("Should have correct URIs", async function() {
            let price = fromWei(await nft.getPrice())
            await nft.connect(addr2).mint(2, { value: toWei(price * 2) });
            expect(await nft.totalSupply()).to.equal(3);
            
            await nft.reveal();
            //Unknown URIs. When not revealed, it stays the base URI
            expect(await nft.tokenURI(1)).to.equal(URI + "1.json");
            expect(await nft.tokenURI(19)).to.equal(URI + "19.json");
            //Normal URIs
            expect(await nft.tokenURI(20)).to.equal(URI + "20.json");
            expect(await nft.tokenURI(334)).to.equal(URI + "334.json");
        })
    })

    describe("Whitelist", function() {
        it("Should update Whitelist", async function() {
            let walletAlreadyWhitelisted = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
            expect(await nft.isWhitelisted(walletAlreadyWhitelisted)).to.equal(true);

            let walletToWhitelist = "0x90f79bf6eb2c4f870365e785982e1f101e93b906"
            expect(await nft.isWhitelisted(walletToWhitelist)).to.equal(false);
            await nft.whitelistUsers([walletAlreadyWhitelisted, walletToWhitelist]);
            expect(await nft.isWhitelisted(walletToWhitelist)).to.equal(true);
        })
    })
})