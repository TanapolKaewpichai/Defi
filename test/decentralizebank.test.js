const { assert } = require("chai");

const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function token(amount) {
    return web3.utils.toWei(amount, "ether");
  }

  before(async () => {
    //load contract
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    //transfer all token to decenBank 1 million
    await rwd.transfer(decentralBank.address, token("1000000"));

    //transfer 100 mock Tether to account[1]
    await tether.transfer(customer, token("100"), { from: owner });
  });

  describe("Mock Tether Token Deployment", async () => {
    it("Match name succesfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token");
    });
  });

  describe("Reward Token Deployment", async () => {
    it("Match name succesfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("Match name succesfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has token", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, token("1000000"));
    });
  });

  describe("Yeild Farming", async () => {
    it("Reward Token for  Staking", async () => {
      let result;
      //check investor Balance
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        token("100"),
        "customer mock wallet before staking"
      );

      //check staking for customer of 100 teken
      await tether.approve(decentralBank.address, token("100"), {
        from: customer,
      });
      await decentralBank.deposit(token("100"), { from: customer });

      //check update customer's balance = 0
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        token("0"),
        "customer mock wallet after staking 100 token to bank"
      );

      //check updatt central bank's balance = 100 or not?
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        token("100"),
        "Bank mock wallet after cuntomer staking"
      );

      //check hasStaked & isStaking is true?
      result = await decentralBank.isStaking(customer);
      assert.equal(result.toString(), "true", "customer status after staking");

      //issue token
      await decentralBank.issueToken({ from: owner });

      //ensure only owner can issue Token
      await decentralBank.issueToken({ from: customer }).should.be.rejected;

      //unstake token
      await decentralBank.unstakeToken({ from: customer });

      //check unstaking balance
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        token("100"),
        "customer mock wallet after unstaking"
      );

      //check update central bank's balance
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        token("0"),
        "Bank mock wallet after cuntomer staking"
      );

      //check hasStaked & isStaking is false?
      result = await decentralBank.isStaking(customer);
      assert.equal(result.toString(), "false", "customer is no longer staking");
    });
  });
});
