// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/// @title ComputerTracker
/// @notice Contrato para rastrear computadoras y gestionar usuarios y administradores
/// @dev Implementa un sistema de permisos basado en owner y admins
contract ComputerTracker {

    // Constantes
    // uint256 public constant MAX_COMPUTERS = 1000;

    // Eventos
    event ComputerTracked(string indexed numSerie, uint256 timestamp);
    event UserAdded(string indexed numSerie, address indexed userAddress);
    event UserDeleted(string indexed numSerie, address indexed userAddress);
    event AdminAdded(address indexed adminAddress);
    event AdminDeleted(address indexed adminAddress);

    struct Computer {
        string blockdata;
        string numSerie;
        uint256 timestamp;
    }

    struct User {
        string numSerie;
        address userAddress;
    }

    Computer[] public computers;
    address public owner;
    mapping (address => mapping (string => bool)) usuarios;
    mapping (address => bool) private admins;
    mapping(string => uint256) private computerIndex;
    

    constructor(){
        owner = msg.sender;
    }

    /// @notice Registra o actualiza la información de una computadora
    /// @param data Estructura con la información de la computadora
    function trackComputer(Computer memory data) public {
        require(
           usuarios[msg.sender][data.numSerie],
           "User not allowed"
        );
        // require(computers.length < MAX_COMPUTERS, "Maximum computers limit reached");
        
        uint256 index = computerIndex[data.numSerie];
        if (index > 0) {
            computers[index - 1] = data;
        } else {
            computers.push(data);
            computerIndex[data.numSerie] = computers.length;
        }
        emit ComputerTracked(data.numSerie, data.timestamp);
    }

    /// @notice Obtiene todas las computadoras registradas
    /// @return Array con todas las computadoras registradas
    function getComputers() public view returns (Computer[] memory) {
        require(
            admins[msg.sender],
           "User not allowed"
        );
        return (computers);
    }

    /// @notice Obtiene las computadoras dentro de un rango de tiempo específico
    /// @param adminNumSerie Número de serie del administrador
    /// @param startTime Tiempo de inicio del rango
    /// @param endTime Tiempo de fin del rango
    /// @return Array con las computadoras que coinciden con el rango de tiempo
    // function getComputersByTimeRange(
    //     string memory adminNumSerie,
    //     uint256 startTime, 
    //     uint256 endTime
    // ) 
    //     public 
    //     view 
    //     returns (Computer[] memory) 
    // {
    //     require(
    //         admins[adminNumSerie],
    //         "User not allowed"
    //     );
    //     require(startTime <= endTime, "Invalid time range");
        
    //     uint256 count = 0;
    //     for(uint256 i = 0; i < computers.length; i++) {
    //         if(computers[i].timestamp >= startTime && computers[i].timestamp <= endTime) {
    //             count++;
    //         }
    //     }
        
    //     Computer[] memory result = new Computer[](count);
    //     uint256 index = 0;
    //     for(uint256 i = 0; i < computers.length; i++) {
    //         if(computers[i].timestamp >= startTime && computers[i].timestamp <= endTime) {
    //             result[index] = computers[i];
    //             index++;
    //         }
    //     }
        
    //     return result;
    // }

    /// @notice Registra un nuevo usuario
    /// @param data Estructura con la información del usuario y administrador
    function putUser(User memory data) public {
        require(
           admins[msg.sender],
           "User not allowed"
        );
        usuarios[data.userAddress][data.numSerie] = true;
        emit UserAdded(data.numSerie,data.userAddress);
    }

    /// @notice Elimina un usuario
    /// @param data Estructura con la información del usuario y administrador
    function deleteUser(User memory data) public {
        require(
           admins[msg.sender],
           "User not allowed"
        );
        delete usuarios[data.userAddress][data.numSerie];
        emit UserDeleted(data.numSerie, data.userAddress);
    }

    /// @notice Registra un nuevo administrador
    /// @param adminAddress Número de serie del administrador
    function putAdmin(address adminAddress) public {
        require(
            msg.sender == owner,
            "Only owner can add admin"
        );
        admins[adminAddress] = true;
        emit AdminAdded(adminAddress);
    }

    /// @notice Elimina un administrador
    /// @param adminAddress Número de serie del administrador
    function deleteAdmin(address adminAddress) public {
        require(
            msg.sender == owner,
            "Only owner can delete admin"
        );
        delete admins[adminAddress];
        emit AdminDeleted(adminAddress);
    }
}