# ComputerTracker Smart Contract

## Overview
The ComputerTracker is a Solidity smart contract designed to track computers and manage users and administrators in a blockchain environment. It implements a permission-based system with owner and admin roles.

## Features
- Track and update computer information
- User management (add/delete users)
- Administrator management (add/delete admins)
- Permission-based access control
- Event logging for all major operations
- Permission checking functions

## Contract Structure

### Data Structures
- `Computer`: Stores computer information
  - `blockdata`: String containing block data
  - `numSerie`: String containing serial number
  - `timestamp`: uint256 timestamp of tracking

- `User`: Stores user information
  - `numSerie`: String containing serial number
  - `userAddress`: Address of the user

### State Variables
- `computers`: Array of Computer structs
- `owner`: Address of contract owner
- `usuarios`: Mapping of user addresses to serial numbers
- `admins`: Mapping of admin addresses to boolean values
- `computerIndex`: Mapping of serial numbers to computer indices

### Events
- `ComputerTracked`: Emitted when a computer is tracked/updated
- `UserAdded`: Emitted when a new user is added
- `UserDeleted`: Emitted when a user is deleted
- `AdminAdded`: Emitted when a new admin is added
- `AdminDeleted`: Emitted when an admin is deleted

## Functions

### Computer Management
- `trackComputer(Computer memory data)`: 
  - Registers or updates computer information
  - Requires user permission for the specific serial number
  - Emits ComputerTracked event

- `getComputers()`: 
  - Returns all registered computers


### User Management
- `putUser(User memory data)`:
  - Registers a new user
  - Requires admin permission
  - Emits UserAdded event

- `deleteUser(User memory data)`:
  - Deletes a user
  - Requires admin permission
  - Emits UserDeleted event

### Admin Management
- `putAdmin(address adminAddress)`:
  - Registers a new admin
  - Requires owner permission
  - Emits AdminAdded event

- `deleteAdmin(address adminAddress)`:
  - Deletes an admin
  - Requires owner permission
  - Emits AdminDeleted event

### Permission Checking
- `isAdmin()`:
  - Checks if the caller (msg.sender) has admin privileges
  - Returns true if the caller is an admin, false otherwise
  - Can be called by anyone (public view function)

- `isUser(string memory numSerie)`:
  - Checks if the caller (msg.sender) has user permissions for a specific serial number
  - Returns true if the caller is authorized for the given serial number, false otherwise
  - Can be called by anyone (public view function)

## Access Control
- Owner: Has full control over the contract and can manage admins
- Admins: Can manage users and view all computers
- Users: Can track computers they have permission for

## Security Features
- Permission-based access control
- Owner-only admin management
- Admin-only user management
- User-specific computer tracking permissions
- Public permission checking functions

## Usage Example
```solidity
// Deploy contract
ComputerTracker tracker = new ComputerTracker();

// Add admin (only owner)
tracker.putAdmin(adminAddress);

// Check admin status
bool isAdmin = tracker.isAdmin();

// Add user (only admin)
tracker.putUser(User({
    numSerie: "ABC123",
    userAddress: userAddress
}));

// Check user status
bool isUser = tracker.isUser("ABC123");

// Track computer (only authorized user)
tracker.trackComputer(Computer({
    blockdata: "some data",
    numSerie: "ABC123",
    timestamp: block.timestamp
}));
```

## Requirements
- Solidity ^0.8.0
- EVM compatible blockchain

## License
UNLICENSED
