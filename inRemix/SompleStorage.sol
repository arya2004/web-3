// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
//EVM eht VM
// Avalanche, Fnatom, Polygon
contract SimpleStorage {

    uint256 favoriteNumber;
    address my = 0x254B2a8373baf7B8dC61E15891434241e4D16736;
    struct People {
        uint256 favoriteNumber;
        string name;
    }
    // uint256[] public anArray;
    People[] public people;
    //dict
    mapping(string => uint256) public nameToFavoriteNumber;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }
    
    function retrieve() public view returns (uint256){
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
    //pure/view are gass free, doesnt need to acccess storage
    function retrn () public view returns(uint256) {
        return favoriteNumber;
    }
}

//0xd