
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SompleStorage.sol";

contract StorageFactory{

    SimpleStorage[] public  simpleStorageArray;
    function createSimpleStorageCOntract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }
    //to interact with contrace, address and ABI-application binary interface 
    //ABI is an interface
    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
            SimpleStorage simple = simpleStorageArray[_simpleStorageIndex];
            simple.store(_simpleStorageNumber);
    }

    function sfStoreOptimized(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);

    }

    function sfGet(uint256 _simpleStoragIndex) public view  returns (uint256){
        SimpleStorage simple = simpleStorageArray[_simpleStoragIndex];
        return simple.retrieve();
    }
    function sfGetOptimized(uint256 _simpleStoragIndex) public view  returns (uint256){
        return simpleStorageArray[_simpleStoragIndex].retrieve();
    }

}