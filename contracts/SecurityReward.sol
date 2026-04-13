
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract SecurityReward is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event AchievementMinted(address indexed student, uint256 tokenId, string uri);

    constructor(address initialOwner) 
        ERC721("EtherArabia Achievement", "EAA") 
        Ownable(initialOwner) 
    {}

    
    function mint() public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
    }

    
    function mintTo(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit AchievementMinted(to, tokenId, uri);
    }

    

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
