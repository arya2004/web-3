// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract ManualToken{

    uint256 initalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    //transfer tokens
    //subtract from addr amount and add to new



    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details);(type name)
    function _transfer(address from, address to, uint256 amount) public {
        balanceOf[from] = balanceOf[from] - amount;
        balanceOf[to] += amount;
    }

     function transferFrom(
    address _from,
    address _to,
    uint256 _value
  ) public returns (bool success) {
    require(_value <= allowance[_from][msg.sender]); // Check allowance
    allowance[_from][msg.sender] -= _value;
    _transfer(_from, _to, _value);
    return true;
  }

}
