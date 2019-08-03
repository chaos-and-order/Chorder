var express = require('express');
var Web3 = require('web3');
var router = express.Router();

 
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 
var publisherAdress;
web3.eth.getAccounts().then(e => {
	publisherAdress=e[0]; 
	console.log('Token Buy handled by: ' +publisherAdress);
});

router.get('/', function(req, res, next) {
  res.render('buyToken');
});

router.post('/',async function(req, res, next) {

    //console.log("Token ID : ", req.body.token_id);

    try {
      console.log("Inside Try: " )
      await ChorderContract.methods.withdrawBalance().send({ from: tokenBuyAddress, gas: 1500000 }).then(function (value) {
          
      });
  } catch (err) {
      await res.send(err.message);
      console.log(err.message);
  }


});



module.exports = router;