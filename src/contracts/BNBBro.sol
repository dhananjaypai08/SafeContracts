// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.7.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";

contract BNBBro is ERC721, ERC721URIStorage {
    address[] public CONTRACTS;
    mapping(address => address[]) public UserOfContract;
    mapping(address => string) public stateOfContractAI;
    mapping(address => uint256) public CountOfUnsafeFlagForContract;
    mapping(address => address) public ContractToUser;
    uint256 public tokenId;
    address public owner;
    address private burning_address = 0x000000000000000000000000000000000000dEaD; // Burning address 

    constructor() ERC721("BNBBro", "BRO"){
        owner = msg.sender;
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    /*
    * @notice Get token CID from lighthouse.storage
    * @param:
        @_tokenId
    */
    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 _tokenId) internal override virtual{
        // Requires the first mint address or is to delete a 
        require(from == address(0) || (to == burning_address && msg.sender == from), "Err: token transfer is BLOCKED"); 
        super._beforeTokenTransfer(from, to, _tokenId);
    }


    function addContract(address user, address _contractAddress, string memory _cid, string memory status) public {
        /*
        @user: address of the connected wallet 
        @_contractAddress: address of the contract to digitize
        @_cid: CID hash consisting of name, description and image containing the entire smart contract
        @status: 'Safe' or 'Unsafe'
        */
        tokenId++;
        _safeMint(user, tokenId);
        _setTokenURI(tokenId, _cid);
        CONTRACTS.push(_contractAddress);
        UserOfContract[user].push(_contractAddress);
        stateOfContractAI[_contractAddress] = status;
        CountOfUnsafeFlagForContract[_contractAddress] = 0;
        ContractToUser[_contractAddress] = user;
    }

    function flag(address _contractAddress) public {
        /*
        Users can blacklist any smart contracts
        */
        CountOfUnsafeFlagForContract[_contractAddress] += 1;
    }

    function searchContract(address _contractAddress) public view returns(address, string memory, uint256){
        return (ContractToUser[_contractAddress], stateOfContractAI[_contractAddress], CountOfUnsafeFlagForContract[_contractAddress]);
    }
}