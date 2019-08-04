import web3 from './web3';

var path = require('path');


// (path.join(__dirname, '../build/')
const ChorderContractJSON = require(path.join(__dirname, '../../build/contracts/Chorder.json'));
// const ChorderContractJSON = require(path.join(__dirname, './contracts/Chorder.json'))
console.log(ChorderContractJSON);


//this particular deployment
const contractAddress = ChorderContractJSON.networks['5777'].address;
console.log("Contract Address: ", contractAddress);

// const contractAddress = '0xAA87C2f3ECd6BCaE117725F90Bde0C0b146A5e73';

// ABI
const abi = ChorderContractJSON.abi;

// Creating contract object
// var ChorderContract = new web3.eth.Contract(abi, contractAddress);


export default new web3.eth.Contract(abi, contractAddress);;