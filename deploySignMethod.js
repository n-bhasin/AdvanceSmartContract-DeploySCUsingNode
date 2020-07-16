//Inject env variable
require("dotenv").config("./env");

//import web3
const Web3 = require("web3");

//import bignumber.js
const BigNumber = require("bignumber.js");

//import abi and bytecode
const abi = require("./__Simple_sol_Simple.json");
const { bytecode } = require("./__Simple_sol_Simple");

//create web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.URI));

//get the account object using privateKey
const accountObj = web3.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY
);

const number = new BigNumber(5);
const simpleContract = new web3.eth.Contract(abi);

//deploy the contract
const contractData = simpleContract
  .deploy({
    data: `0x${bytecode}`,
    arguments: [number],
  })
  .encodeABI();

web3.eth
  .estimateGas({ from: accountObj.address, data: contractData })
  .then((gas) => {
    const rawTx = { from: accountObj.address, gas, data: contractData };
    web3.eth.accounts
      .signTransaction(rawTx, accountObj.privateKey)
      .then(({ rawTransaction, transactionHash }) => {
        console.log("rawtransaction", rawTransaction);
        console.log("transactionhash", transactionHash);
        web3.eth
          .sendSignedTransaction(rawTransaction)
          .on("receipt", console.log);

        waitForReceipt(transactionHash, (result) => {
          console.log("The contract is deployed at: ", result.contractAddress);
        });
      });
  });

// function to poll until transaction gets mined
function waitForReceipt(hash, cb) {
  web3.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) {
      console.error(err);
    }
    if (receipt) {
      // Transaction went through
      if (cb) {
        cb(receipt);
      }
    } else {
      // Try again in 1 second
      console.log("Waiting to get mined...");
      setTimeout(function () {
        waitForReceipt(hash, cb);
      }, 1000);
    }
  });
}
