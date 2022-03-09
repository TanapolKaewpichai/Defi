const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function issueReward(callback) {
  let decentralBank = await DecentralBank.deployed();
  await decentralBank.issueToken();
  console.log("token has been issued successfully");
  callback();
};
