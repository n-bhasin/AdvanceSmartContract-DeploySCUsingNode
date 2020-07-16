require("dotenv").config("./env");
const Web3 = require("web3");
const abi = require("./__Simple_sol_Simple.json");

//create web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.URI));

//adding account to wallet
web3.eth.accounts.wallet.add(`0x${process.env.PRIVATE_KEY}`);
//get contract instance
const simpleContract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

//read the number
simpleContract.methods
  .readNumber()
  .call()
  .then((result) => {
    console.log(`Initial value of number: ${result}`);
  });

// console.log(web3.eth.accounts.wallet[0].address);
// call the add method of SC
simpleContract.methods
  .add(4)
  .estimateGas()
  .then((gas) => {
    console.log(gas);
    simpleContract.methods.add(4).send({
      from: web3.eth.accounts.wallet[0].address,
      gas,
    });
  });
