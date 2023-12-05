// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage{
    uint256 private _tokenIds;

    address contractAddress;

    
    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
       contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint){
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;

        //mint
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;

    }
}