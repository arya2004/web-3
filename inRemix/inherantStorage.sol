// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SompleStorage.sol";

contract ExtraStorage is SimpleStorage{

    //overrifding
    function store(uint256 _favoriteNumber) public override  {
        favoriteNumber = _favoriteNumber + 5;
    }
}