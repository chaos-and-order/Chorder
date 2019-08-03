var express = require('express');
var Web3 = require('web3');
var router = express.Router();

 
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
 
var secondAddress;
web3.eth.getAccounts().then(e => {
	secondAddress=e[1]; 
	console.log('Buy from Publisher handled by: ' +secondAddress);
});

router.get('/', function(req, res, next) {
  res.render('buyFromPublisher');
});

router.post('/',async function(req, res, next) {

    console.log("Movie ID : ", req.body.movie_id);

    try {
      console.log("Inside Try: " )
      console.log("Price: ", req.body.price);
      await ChorderContract.methods.buyFromPublisher(req.body.movie_id).send({ from: secondAddress, gas: 1500000, value: req.body.price }).then(function (value) {
          
      });
  } catch (err) {
      await res.send(err.message);
      console.log(err.message);
  }


});



module.exports = router;