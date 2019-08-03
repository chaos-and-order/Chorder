var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var publishContentRouter = require('./routes/publishContent');
var buyFromPublisherRouter = require('./routes/buyFromPublisher');
var setResalePriceRouter = require('./routes/setResalePrice');
var buyTokenRouter = require('./routes/buyToken');
var transferRouter = require('./routes/transfer');
var viewTokenDataRouter = require('./routes/viewTokenData');
var withdrawBalanceRouter = require('./routes/withdrawBalance');


var app = express();


//Web3 and Contract Stuff


var Web3 = require('web3');
// Importing compiled output of FarmVerification contract from build directory
var ChorderContractJSON = require(path.join(__dirname, '../build/contracts/Chorder.json'));

// Establishing connection with Ganache 
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//web3 current provider
// var web3 = new Web3(window.web3.currentProvider);

// Get contract address from network id 4002 (network id of geth private chain)

contractAddress = ChorderContractJSON.networks['5777'].address;
console.log("Contract Address: ", contractAddress);

// ABI
const abi = ChorderContractJSON.abi;

// Creating contract object
ChorderContract = new web3.eth.Contract(abi, contractAddress);

//Setting deployer address using truffle compile, for ganache and geth deployments.
var deployerAddress;
web3.eth.getAccounts().then(e => {
	deployerAddress=e[0]; 
	console.log('Owner (deployer) Address: ' +deployerAddress);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/publishContent', publishContentRouter);
app.use('/buyFromPublisher', buyFromPublisherRouter);
app.use('/setResalePrice', setResalePriceRouter);
app.use('/buyToken', buyTokenRouter);
app.use('/transfer', transferRouter);
app.use('/viewTokenData', viewTokenDataRouter);
app.use('/withdrawBalance', withdrawBalanceRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
