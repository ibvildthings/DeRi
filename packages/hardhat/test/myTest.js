const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("DegenRides", function () {
  let myContract;
  let accounts;

  before(async () => {
    accounts = await hre.ethers.getSigners();
  });

  beforeEach(async () => {
    const YourContract = await ethers.getContractFactory("YourContract");

    myContract = await YourContract.deploy(3560000000000000,
      1200000000000,
      (100 * 1000));
  })


  describe("YourContract", function () {

    describe("testdriverGoOnline()", function () {
      it("Should be able to add a new driver", async function () {
        const newPurpose = "Test Adding Driver";

        expect(await myContract.getDriverCount()).to.equal(0);
      });
    });


    describe("testdriverGoOnline()", function () {
      it("Should be able to add a new driver", async function () {

        await myContract.driverGoOnline(
          3150000000000000,
          35345643643,
          "Taxi Driver",
        )

        expect(await myContract.getDriverCount()).to.equal(1);
      });
    });


    describe("testRequestRide()", function () {
      it("Should be able to add a request a ride", async function () {

        await myContract.connect(accounts[2]).driverGoOnline(
          3150000000000000,
          35345643643,
          "Taxi Driver",
        )
        expect(await myContract.getDriverCount()).to.equal(1);

        await myContract.connect(accounts[1]).requestRide(
          3150000000000000,
          35345643643,
          4150000000000000,
          45345643643,
          { value: 3560000000000000 },
        )
        expect(await myContract.getDriverCount()).to.equal(0);
      });
    });

    describe("testRequestRide()", function () {
      it("Correct fare is transferred to driver", async function () {

        await myContract.connect(accounts[2]).driverGoOnline(
          3150000000000000,
          35345643643,
          "Taxi Driver",
        )

        let driverBalance = await accounts[2].getBalance();

        await myContract.connect(accounts[1]).requestRide(
          3150000000000000,
          35345643643,
          4150000000000000,
          45345643643,
          { value: 3560000000000000 },
        )

        let driverBalanceAfterRide = await accounts[2].getBalance();
        expect(driverBalanceAfterRide.gt(driverBalance)).to.equal(true);
      });
    });


  });
});
