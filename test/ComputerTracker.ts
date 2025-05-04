import { expect } from "chai";
import { ethers } from "hardhat";
import { ComputerTracker } from "../typechain-types";

describe("ComputerTracker", () => {
  let contract: ComputerTracker;
  let owner: any;
  let user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ComputerTracker", owner);
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("should allow owner to add admin", async () => {
    const tx = await contract.putAdmin("ADMIN123");
    await tx.wait();

    // Note: mapping is private, so we test access indirectly
    const computers = await contract.connect(owner).getComputers("ADMIN123");
    expect(computers.length).to.equal(0);
  });

  it("should allow admin to add a user", async () => {
    await contract.putAdmin("ADMIN123");

    const adminStruct = {
      numSerieUser: "USER001",
      numSerieAdmin: "ADMIN123",
    };

    await contract.putUser(adminStruct);
  });

  it("should allow user to track a computer", async () => {
    await contract.putAdmin("ADMIN123");

    await contract.putUser({
      numSerieUser: "USER001",
      numSerieAdmin: "ADMIN123",
    });

    const data = {
      blockdata: "Info del equipo",
      numSerie: "USER001",
      timestamp: Math.floor(Date.now() / 1000),
    };

    await contract.trackComputer(data);
  });

  it("should store and retrieve tracked computer by admin", async () => {
    await contract.putAdmin("ADMIN123");

    await contract.putUser({
      numSerieUser: "USER001",
      numSerieAdmin: "ADMIN123",
    });

    const data = {
      blockdata: "Info 1",
      numSerie: "USER001",
      timestamp: Math.floor(Date.now() / 1000),
    };

    const tx = await contract.trackComputer(data);
    tx.wait();

    const computers = await contract.getComputers("ADMIN123");
    expect(computers.length).to.equal(1);
    expect(computers[0].blockdata).to.equal("Info 1");
  });

  it("should delete user if admin", async () => {
    await contract.putAdmin("ADMIN123");

    await contract.putUser({
      numSerieUser: "USER001",
      numSerieAdmin: "ADMIN123",
    });

    await contract.deleteUser({
      numSerieUser: "USER001",
      numSerieAdmin: "ADMIN123",
    });

    // Después de borrarlo, intentar trackear debe fallar
    const data = {
      blockdata: "Info",
      numSerie: "USER001",
      timestamp: Math.floor(Date.now() / 1000),
    };

    await expect(contract.trackComputer(data)).to.be.reverted;
  });

  it("should only allow owner to delete admin", async () => {
    await contract.putAdmin("ADMIN123");

    // No debería dejar que otro address borre
    await expect(
      contract.connect(user).deleteAdmin("ADMIN123")
    ).to.be.revertedWith("Only owner can delete admin");
  });
});