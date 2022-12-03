// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract NFT is ERC721A, Ownable {
    string public constant uriSuffix = '.json';

    uint256 public immutable max_supply = 15000;

    uint public amountMintPerAccount = 10;

    address[] private whitelistedAddresses;

    bool public publicSaleEnabled;
    bool public isRevealed;
    bool public paused;

    string private constant baseUri10000 = "ipfs://QmSyiuuT6QcCoLcy15MwoFn6dgkgzg63ebFvrxQLerFkMe/";
    string private constant baseUri15000 = "ipfs://QmTrrNAKRTz286SYD3a7BmnqGcHG1rp2E387AcAEJi8Adm/";
    string private constant unrevealedUri = "ipfs://QmRVuGy5diJWnNsyQaCEYKiMcS84TqjyBKzZRpn8R2aqhP";

    uint256 public publicSalePrice = 323.8 ether;
    uint256 public whitelistPrice = 200.7 ether;
    
    event MintSuccessful(
        address user
    );

    constructor(address ownerAddress, address[] memory _usersToWhitelist) ERC721A("teenySkySJBBs", "TSSJBBS")
    {
        // Set whitelist
        delete whitelistedAddresses;
        whitelistedAddresses = _usersToWhitelist;

        // Transfer ownership
        _transferOwnership(ownerAddress);
    }
    
    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

        if (!isRevealed) {
            return unrevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        if (_tokenId > 10000) {
            currentBaseURI = baseUri15000;
        }
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, Strings.toString(_tokenId), uriSuffix))
            : '';
    }

    function mint(uint256 quantity) external payable {
        require(!paused, 'Minting is paused');
        require(totalSupply() + quantity < max_supply, 'Cannot mint more than max supply');
        require(publicSaleEnabled || isWhitelisted(address(msg.sender)), 'You are not whitelisted');
        require(balanceOf(msg.sender) + quantity <= amountMintPerAccount, 'Each address may only mint x NFTs!');
        require(msg.value >= getPrice() * quantity, "Not enough ETH sent; check price!");

        if (quantity > 1 && quantity < 10) {
            quantity += 1;
        }
        _mint(msg.sender, quantity);
        
        emit MintSuccessful(msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return baseUri10000;
    }
    
    function baseTokenURI() public pure returns (string memory) {
        return _baseURI();
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmPyP7CRCcHWvS7VYsMqhmrfzHmE5iuZqqoBH6czmzjTH7/";
    }

    function setPublicSaleEnabled(bool _state) public onlyOwner {
        publicSaleEnabled = _state;
    }

    function whitelistUsers(address[] calldata _users) public onlyOwner {
        delete whitelistedAddresses;
        whitelistedAddresses = _users;
    }

    function isWhitelisted(address _user) public view returns (bool) {
        uint256 whitelistedAddressesLength = whitelistedAddresses.length;
        for (uint256 i = 0; i < whitelistedAddressesLength;) {
            if (whitelistedAddresses[i] == _user) {
                return true;
            }
            unchecked { ++i; }
        }
        return false;
    }

    function reveal() public onlyOwner {
        isRevealed = true;
    }

    function getPrice() view public returns(uint) {
        if (publicSaleEnabled) {
            return publicSalePrice;
        }
        return whitelistPrice;
    }

    function setPublicSalePrice(uint _price) public onlyOwner {
        publicSalePrice = _price;
    }

    function setWhitelistPrice(uint _price) public onlyOwner {
        whitelistPrice = _price;
    }

    function setPause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setAmountMintPerAccount(uint _amountMintPerAccount) public onlyOwner {
        amountMintPerAccount = _amountMintPerAccount;
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}