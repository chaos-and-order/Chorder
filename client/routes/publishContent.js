var express = require('express');
var request = require('request');
var router = express.Router();
//var bigInt = require('big-integer');   //to resolve the bigInt issue at the DB end
//update: the bigInt package doesn't seem to reolve the issue. Uninstalled at the moment.
 
/* GET Crop Details Form. */


router.get('/', function(req, res, next) {
  res.render('publishContent');
});

router.post('/',async function(req, res, next) {

    console.log("Farm ID : ", req.body.farm_id);

    try {
      console.log("Inside Try: " )
      await ChorderContract.methods.addMovieDetails(eq.body.ipfsHash, req.body.movie_id, req.body.price, req.body.saleCommission).send({ from: publisherAddress, gas: 1500000 }).then(function (value) {
          // console.log("Farm Details: ", value);
          // res.send("Farm has been registered! ------ ", value.transactionHash);
      });
  } catch (err) {
      await res.send(err.message);
      console.log(err.message);
  }


});



module.exports = router;