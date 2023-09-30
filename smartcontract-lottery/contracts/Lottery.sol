// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Lottery__NotEnoughEThEntered();
error Lotery__TransferFailed();

contract Lottery is VRFConsumerBaseV2 {
    
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionID;
    uint16 private constant REQUEST_CONFORMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    address private s_recentWinner;

    event LotteryEnter(address indexPlayer);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WInnerPicked(address indexedWinner);

    constructor(address vrfCoordinatorV2, uint256 entranceFee, bytes32 gasLane, uint64 subscriptionId,uint32 callbackGasLimit)  VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionID = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        if(msg.value < i_entranceFee ){revert Lottery__NotEnoughEThEntered(); }
        s_players.push(payable(msg.sender));
        //msg.sender isnt payable address
        //emit an event where we update a dynamic array or mappring
        emit LotteryEnter(msg.sender);
    }

    function requestRandomWinner()  external {
        //req a rand no
        //do with it
        //2 transactions 
        uint256 requestId =   i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionID,
            REQUEST_CONFORMATIONS,
            i_callbackGasLimit,
            NUM_WORDS);
            emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords( uint256 ,uint256[] memory _randomWords ) internal override {
        uint256 indexOfWinner = _randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success,) = recentWinner.call{value: address(this).balance}("");
        if(!success)
        {
            revert Lotery__TransferFailed(); 
        }
        emit WInnerPicked(recentWinner);
    }

    //view functions
    function getEntranceFee() public view returns(uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns(address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}