// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ComputerTracker {

    struct Computer {
        string blockdata;
        string numSerie;
        uint256 timestamp;
    }

    struct Admin {
        string numSerieUser;
        string numSerieAdmin;
    }

    // struct Data {
    //     string numSerie;
    //     string blockdata;
    //     uint256 timestamp;
    // }

    Computer[] public computers;
    address public owner;
    mapping (string => string) private usuarios;
    mapping (string => string) private admins;

    constructor(){
        owner = msg.sender;
    }


    function trackComputer(Computer memory data) public {
        require(
            keccak256(abi.encodePacked(usuarios[data.numSerie])) == keccak256(abi.encodePacked(data.numSerie))
        );
        bool flag = false;
        for (uint i = 0; i < computers.length; i++) {
            if(keccak256(abi.encodePacked(computers[i].numSerie)) == keccak256(abi.encodePacked(data.numSerie))){
                computers[i] = data;
                flag = true;
                break;
            }
        }
        if(!flag){
            computers.push(data);
        }
    }

    function getComputers(string memory numSerie) public view returns (Computer[] memory) {
        require(
            keccak256(abi.encodePacked(admins[numSerie])) == keccak256(abi.encodePacked(numSerie))
        );
        return (computers);
    }

    function putUser(Admin memory data)  public {
        require(
            keccak256(abi.encodePacked(admins[data.numSerieAdmin])) == keccak256(abi.encodePacked(data.numSerieAdmin))
        );
        usuarios[data.numSerieUser] = data.numSerieUser;
    }

    function deleteUser(Admin memory data)  public {
        require(
            keccak256(abi.encodePacked(admins[data.numSerieAdmin])) == keccak256(abi.encodePacked(data.numSerieAdmin))
        );
        delete usuarios[data.numSerieUser];
    }

    function putAdmin(string memory numSerie)  public {
        require(
            msg.sender == owner
        );
        admins[numSerie] = numSerie;
    }

    function deleteAdmin(string memory numSerie)  public {
        require(
            msg.sender == owner,
            "Only owner can delete admin"
        );
        delete admins[numSerie];
    }

}