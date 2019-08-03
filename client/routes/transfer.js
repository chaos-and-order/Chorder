var express = require('express');
var Web3 = require('web3');
var router = express.Router();

 
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
 
var transferAddress;
web3.eth.getAccounts().then(e => {
	transferAddress=e[2]; 
	console.log('Token Buy handled by: ' +transferAddress);
});

router.get('/', function(req, res, next) {
  res.render('buyToken');
});

router.post('/',async function(req, res, next) {

    console.log("Token ID : ", req.body.token_id);

    try {
      console.log("Inside Try: " )
      await ChorderContract.methods.transfer(req.body.recipient_address, req.body.token_id).send({ from: transferAddress, gas: 1500000 }).then(function (value) {
          
      });
  } catch (err) {
      await res.send(err.message);
      console.log(err.message);
  }


});



module.exports = router;