// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ComputerTracker {
    struct Computer {
        string Blockdata;
        uint256 timestamp;
    }

    Computer[] public computers;


    function trackComputer(Computer memory data) public {
        computers.push(data);
    }

    function getComputers() public view returns (Computer[] memory) {
        return (computers);
    }

}