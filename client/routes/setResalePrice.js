var express = require('express');
var Web3 = require('web3');
var router = express.Router();

 
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 
var secondAddress;
web3.eth.getAccounts().then(e => {
	secondAddress=e[1]; 
	console.log('Set Resale handled by: ' +secondAddress);
});

router.get('/', function(req, res, next) {
  res.render('setResalePrice');
});

router.post('/',async function(req, res, next) {

    console.log("Token ID : ", req.body.token_id);

    try {
      console.log("Inside Try: " )
      await ChorderContract.methods.setResalePrice(req.body.reSalePrice, req.body.token_id).send({ from: secondAddress, gas: 1500000 }).then(function (value) {
          
      });
  } catch (err) {
      await res.send(err.message);
      console.log(err.message);
  }


});



module.exports = router;