var express = require('express');
var Web3 = require('web3');
var router = express.Router();

 
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 
var publisherAddress;
web3.eth.getAccounts().then(e => {
	publisherAddress=e[0]; 
	console.log('Publish Content handled by: ' +publisherAddress);
});





router.get('/', function(req, res, next) {
  res.render('publishContent');
});

router.post('/',async function(req, res, next) {

    console.log("Movie_Id : ", req.body.movie_id);

    try {
      console.log("Inside Try: " )
      console.log("Publisher address: ", publisherAddress);
      await ChorderContract.methods.addMovieDetails(req.body.ipfsHash, req.body.movie_id, req.body.price, req.body.saleCommission).send({from: publisherAddress, gas: 1500000 }).then(function (value) {    
      });
  } catch (err) {
      await res.send(err.message);
      console.log(err.message);
  }


});



module.exports = router;