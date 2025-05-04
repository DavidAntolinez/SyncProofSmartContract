import { expect } from "chai";
import { ethers } from "hardhat";
import { ComputerTracker } from "../typechain-types";

describe("ComputerTracker", function () {
  let contract: ComputerTracker;

  beforeEach(async function () {
    const ComputerTrackerFactory = await ethers.getContractFactory("ComputerTracker");
    contract = await ComputerTrackerFactory.deploy();
    await contract.waitForDeployment();
  });

  it("debe rastrear un computador y devolverlo", async function () {
    const blockdata = "Datos del computador";
    const timestamp = Math.floor(Date.now() / 1000);

    const computer = {
      Blockdata: blockdata,
      timestamp: timestamp,
    };

    const tx = await contract.trackComputer(computer);
    await tx.wait();

    const computers = await contract.getComputers();

    console.log(computers);
    expect(computers.length).to.equal(1);
    expect(computers[0].Blockdata).to.equal(blockdata);
    expect(computers[0].timestamp).to.equal(timestamp);
  });
});