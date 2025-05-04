import { expect } from "chai";
import { ethers } from "hardhat";
import { ComputerTracker } from "../typechain-types";

describe("ComputerTracker", () => {
  let contract: ComputerTracker;
  let owner: any;
  let admin: any;
  let user: any;

  beforeEach(async () => {
    [owner, admin, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ComputerTracker");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("should allow the owner to add an admin", async () => {
    await expect(contract.putAdmin(admin.address))
      .to.emit(contract, "AdminAdded")
      .withArgs(admin.address);
  });

  it("should not allow non-owner to add admin", async () => {
    await expect(
      contract.connect(user).putAdmin(user.address)
    ).to.be.revertedWith("Only owner can add admin");
  });

  it("should allow an admin to add a user", async () => {
    await contract.putAdmin(admin.address);

    await expect(
      contract.connect(admin).putUser({
        numSerie: "COMP-001",
        userAddress: user.address,
      })
    )
      .to.emit(contract, "UserAdded")
      .withArgs("COMP-001", user.address);
  });

  it("should not allow non-admin to add a user", async () => {
    await expect(
      contract.connect(user).putUser({
        numSerie: "COMP-001",
        userAddress: user.address,
      })
    ).to.be.revertedWith("User not allowed");
  });

  it("should allow a user to track a computer if authorized", async () => {
    await contract.putAdmin(admin.address);
    await contract.connect(admin).putUser({
      numSerie: "COMP-001",
      userAddress: user.address,
    });

    const computer = {
      blockdata: "Laptop i5 16GB",
      numSerie: "COMP-001",
      timestamp: Math.floor(Date.now() / 1000),
    };

    await expect(contract.connect(user).trackComputer(computer))
      .to.emit(contract, "ComputerTracked");
  });

  it("should not allow unauthorized user to track a computer", async () => {
    const computer = {
      blockdata: "Laptop i7",
      numSerie: "COMP-002",
      timestamp: Math.floor(Date.now() / 1000),
    };

    await expect(
      contract.connect(user).trackComputer(computer)
    ).to.be.revertedWith("User not allowed");
  });

  it("should allow anyone to get computer list", async () => {
    await contract.putAdmin(admin.address);
    await contract.connect(admin).putUser({
      numSerie: "COMP-003",
      userAddress: user.address,
    });

    const computer = {
      blockdata: "Laptop Ryzen",
      numSerie: "COMP-003",
      timestamp: Math.floor(Date.now() / 1000),
    };

    await contract.connect(user).trackComputer(computer);

    const result = await contract.connect(user).getComputers();
    expect(result.length).to.equal(1);
    expect(result[0].numSerie).to.equal("COMP-003");
    expect(result[0].blockdata).to.equal("Laptop Ryzen");
  });

  it("should allow owner to delete an admin", async () => {
    await contract.putAdmin(admin.address);
    await expect(contract.deleteAdmin(admin.address))
      .to.emit(contract, "AdminDeleted")
      .withArgs(admin.address);
  });

  it("should allow admin to delete a user", async () => {
    await contract.putAdmin(admin.address);
    await contract.connect(admin).putUser({
      numSerie: "COMP-004",
      userAddress: user.address,
    });

    await expect(
      contract.connect(admin).deleteUser({
        numSerie: "COMP-004",
        userAddress: user.address,
      })
    )
      .to.emit(contract, "UserDeleted")
      .withArgs("COMP-004", user.address);
  });

  describe("Permission Checking Functions", () => {
    it("should correctly identify admin status", async () => {
      // Initially, admin should not be an admin
      expect(await contract.connect(admin).isAdmin()).to.be.false;

      // After adding admin, should return true
      await contract.putAdmin(admin.address);
      expect(await contract.connect(admin).isAdmin()).to.be.true;

      // After removing admin, should return false
      await contract.deleteAdmin(admin.address);
      expect(await contract.connect(admin).isAdmin()).to.be.false;
    });

    it("should correctly identify user status", async () => {
      await contract.putAdmin(admin.address);
      const numSerie = "COMP-005";
      const userData = {
        numSerie: numSerie,
        userAddress: user.address
      };

      // Initially, user should not have permission
      expect(await contract.connect(user).isUser(numSerie)).to.be.false;

      // After adding user, should return true
      await contract.connect(admin).putUser(userData);
      expect(await contract.connect(user).isUser(numSerie)).to.be.true;

      // After removing user, should return false
      await contract.connect(admin).deleteUser(userData);
      expect(await contract.connect(user).isUser(numSerie)).to.be.false;
    });

    it("should handle multiple serial numbers for the same user", async () => {
      await contract.putAdmin(admin.address);
      const numSerie1 = "COMP-006";
      const numSerie2 = "COMP-007";
      const userData1 = {
        numSerie: numSerie1,
        userAddress: user.address
      };
      const userData2 = {
        numSerie: numSerie2,
        userAddress: user.address
      };

      // Add user for first serial number
      await contract.connect(admin).putUser(userData1);

      // Should be true for first serial number, false for second
      expect(await contract.connect(user).isUser(numSerie1)).to.be.true;
      expect(await contract.connect(user).isUser(numSerie2)).to.be.false;

      // Add user for second serial number
      await contract.connect(admin).putUser(userData2);

      // Should be true for both serial numbers
      expect(await contract.connect(user).isUser(numSerie1)).to.be.true;
      expect(await contract.connect(user).isUser(numSerie2)).to.be.true;
    });
  });
});
