import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import Chorder from './Chorder';


class App extends Component {
    state = {
        ipfsHash: null,
        buffer: '',
        movieId:'',
        movieIdPrimary:'',
        price:'',
        saleCommision:'',
        tokenID:'',
        tokenIDsale:'',
        pricePrimary:'',
        priceSetupSale:'',
        tokenIDsecSale:'',
        priceSecSale:'',
        tokenIDfreeSale:'',
        addressTo:'',
        tokenIDview:'',
        ipfsGateway:'https://gateway.ipfs.io/ipfs/'
    };

    componentDidMount(){
        document.title = "Chorder"
    };
    
    //methods to capture textbox values and assign them to state variables  
    updateMovieId=(txt) =>{
        this.setState({movieId: txt.target.value});  
    };

    updateMovieIdPrimary=(txt) =>{
        this.setState({movieIdPrimary: txt.target.value});  
    };

    updatePricePrimary=(txt) =>{
        this.setState({pricePrimary: txt.target.value});  
    };

    updatePrice=(txt)=>{
        this.setState({price: txt.target.value});
    };

    updatePriceSetupSale=(txt)=>{
        this.setState({priceSetupSale: txt.target.value});
    };

    updateSaleCommision=(txt)=>{
        this.setState({saleCommision: txt.target.value});
    };

    updateTokenID=(txt)=>{
        this.setState({tokenID: txt.target.value});
        
    };

    updateTokenIDSale=(txt)=>{
        this.setState({tokenIDsale: txt.target.value});
    };

    updateTokenIDsecSale=(txt)=>{
        this.setState({tokenIDsecSale: txt.target.value});
    };

    updatepriceSecSale=(txt)=>{
        this.setState({priceSecSale: txt.target.value});
    };

    updateTokenIDfreeSale=(txt)=>{
        this.setState({tokenIDfreeSale: txt.target.value});
    };

    updateAddressto=(txt)=>{
        this.setState({addressTo: txt.target.value});
    };

    updateTokenIDview=(txt)=>{
        this.setState({tokenIDview: txt.target.value});
    };

    //methods to capture & convert uploaded file into buffer
    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    convertToBuffer = async (reader) => {
        //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        this.setState({ buffer });
    };

    //method to push the buffer into IPFS and receive hash that is send to the contract
    onPublish = async (event) => {
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });

        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(err, ipfsHash);
            this.setState({ ipfsHash: ipfsHash[0].hash });

        
            Chorder.methods.addMovieDetails(this.state.ipfsHash,this.state.movieId,this.state.price,this.state.saleCommision).send({
                from: accounts[0]
            }).then(response => {
                console.log("PublishMovie: ", response)
            }).catch(err => console.log(err));
         })
    };

    //method that executes the first ever purchase of the token
    onPrimaryPurchase = async (event) =>{
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });

        await Chorder.methods.buyFromPublisher(this.state.movieIdPrimary).send({
            from: accounts[0],
            value: this.state.pricePrimary
        }).then(response => {
            console.log('SaleResponse: ', response);
            let tmpId = response.events.Transfer.returnValues.tokenId;
            this.setState({tokenID:tmpId});
        }).catch(err => console.log(err));
    
    };

    //method to view token content i.e. to redirect to IPFS gateway of the content after primary purchase
    onViewContent = async (event) =>{
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });
        alert('Please make a note of your Token ID as it will not be shown again !');
        Chorder.methods.viewTokenData(this.state.tokenID).call({
            from: accounts[0]
        }).then(response =>{
            window.open(this.state.ipfsGateway + response);
        }).catch(err => console.log(err));

    };

    //method to setup token for resale
    onSetupResale = async (event) =>{
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });
        var approvedAddress = 0x00;  //placeholder for now, will change with helper contract

        await Chorder.methods.setResalePrice(this.state.priceSetupSale,this.state.tokenIDsale, approvedAddress).send({
            from: accounts[0]
        }).then(response => {
            console.log('Set Resale Response: ', response);
            alert(this.state.tokenIDsale + " is up for sale at " + this.state.priceSetupSale + " Finney");
        }).catch(err => console.log(err));

    };

    //method to buy a token from another individual
    onSecPurchase = async (event) =>{
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });

        await Chorder.methods.buyToken(this.state.tokenIDsecSale).send({
            from: accounts[0],
            value: this.state.priceSecSale
        }).then(response=>{
            console.log('Secondary Purchase Response: ',response);
            alert("Token bought !!");
        }).catch(err => console.log(err));

    };
    //method to transfer a token to any user of choice (not as a sale)
    onFreeTransfer = async(event)=>{
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });

        await Chorder.methods.transfer(this.state.addressTo,this.state.tokenIDfreeSale).send({
            from: accounts[0]
        }).then(response=>{
            console.log('Free Transfer Response: ', response);
            alert('Token No: '+this.state.tokenIDfreeSale+' Transfered to: '+this.state.addressTo);
        }).catch(err => console.log(err));
    };

    //method to withdraw money in contract back into the wallet
    onWithdrawBalance = async(event)=>{
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });

        await Chorder.methods.withdrawBalance().send({
            from: accounts[0]
        }).then(response => {
            console.log('Withdraw Balance Response: ',response);
            alert('Successfully withdrawn amount from contract !');
        }).catch(err => console.log(err));
    };
    //method to redirect user to IPFS gateway for any token ID given as long as the user owns the token
    onContentView = async(event)=>{
        event.preventDefault();
        console.log("web3 value is ", web3.eth.getAccounts());
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ', accounts[0]);
        const ethAddress = await Chorder.options.address;
        this.setState({ ethAddress });

        Chorder.methods.viewTokenData(this.state.tokenIDview).call({
            from: accounts[0]
        }).then(response =>{
            window.open(this.state.ipfsGateway + response);
        }).catch(err => console.log(err));


    };


    //ALL ERRORS FROM CONTRACT ARE RESOLVED/SHOWN IN METAMASK.
render() {
return (
<div>
        <h1><center>Chorder</center></h1>
        <br/>
    <fieldset>
        <legend> <h2>Publish Movie (Producer)</h2></legend>
    <div className="container">
        <form onSubmit={this.onPublish}>
                <label>Upload File</label>
                <input type="file" onChange={this.captureFile}/>
                <br/><br/>
                <label>MovieID</label>{'   '}
                <input type="text" value={this.state.movieId} onChange={this.updateMovieId} placeholder="Movie ID" />
                <br/><br/>
                <label>Price</label>{'   '}
                <input type="text" value={this.state.price} onChange={this.updatePrice} placeholder="Finney" />
                <br/><br/>
                <label>Sale Commision</label>{'   '}
                <input type="text" value={this.state.saleCommision} onChange={this.updateSaleCommision} placeholder="Percentage %" />
                <br/>
                <input type="submit" disabled={this.state.saleCommision > 50}value="Publish"/>
        </form>
    </div>
    <div className="container">
        <h3>Withdraw Balance</h3>
        <input type="submit" onClick={this.onWithdrawBalance} value="GetCash"/>
    </div>
</fieldset>
<fieldset>
    <legend><h2>Purchase from Author</h2></legend>
        <div className="container">
                <form onSubmit={this.onPrimaryPurchase}> 
                        <br/>
                        <div>Your Token ID: {this.state.tokenID}{' '}<button disabled={!this.state.tokenID} onClick={this.onViewContent}>View Content</button></div>
                        <br/> 
                        <label>Movie ID</label>{'   '}
                        <input type="text" value={this.state.movieIdPrimary} onChange={this.updateMovieIdPrimary} placeholder="Movie ID" /> 
                        <br/><br/>
                        <label>Price</label>{'   '}
                        <input type="text" value={this.state.pricePrimary} onChange={this.updatePricePrimary} placeholder="Finney" /> 

                        <input type="submit" value="Purchase"/>
                </form>
            </div>
</fieldset>
<fieldset>
    <legend> <h2>Setup Token Sale</h2></legend>
        <div className="container">
                <form onSubmit={this.onSetupResale}> 
                        <label>Token ID</label>{'   '}
                        <input type="text" value={this.state.tokenIDsale} onChange={this.updateTokenIDSale} placeholder="Token ID" /> 
                        <br/><br/>
                        <label>Price</label>{'   '}
                        <input type="text" value={this.state.priceSetupSale} onChange={this.updatePriceSetupSale} placeholder="Finney" /> 
                        <br/><br/>
                        <input type="submit" value="Set Sale"/>
                </form>
            </div>

</fieldset>
<fieldset>
    <legend> <h2>Free Trasfer</h2><p>(Transfer freely to an address)</p></legend>
        <div className="container">
                <form onSubmit={this.onFreeTransfer}> 
                        <label>Token ID</label>{'   '}
                        <input type="text" value={this.state.tokenIDfreeSale} onChange={this.updateTokenIDfreeSale} placeholder="Token ID" /> 
                        <br/><br/>
                        <label>Address Recipient:</label>{'   '}
                        <input type="text" value={this.state.addressTo} onChange={this.updateAddressto} placeholder="Recipient" /> 
                        <br/><br/>
                        <input type="submit" disabled={!this.state.addressTo} value="Transfer"/>
                </form>
            </div>

</fieldset>
<fieldset>
    <legend> <h2>Secondary Purchase</h2><p>(Buy from another individual)</p></legend>
        <div className="container">
                <form onSubmit={this.onSecPurchase}>
                        <br/>
                        <label>Token ID</label>{'   '}
                        <input type="text" value={this.state.tokenIDsecSale} onChange={this.updateTokenIDsecSale} placeholder="Token ID" /> 
                        <br/><br/>
                        <label>Price</label>{'   '}
                        <input type="text" value={this.state.priceSecSale} onChange={this.updatepriceSecSale} placeholder="Finney" /> 
                        <br/><br/>
                        <input type="submit" value="Purchase"/>
                </form>
            </div>

</fieldset>
<fieldset>
    <legend> <h2>View Content</h2><p>(View content of any token)</p></legend>
        <div className="container">
                <form onSubmit={this.onContentView}>
                        <br/>
                        <label>Token ID</label>{'   '}
                        <input type="text" value={this.state.tokenIDview} onChange={this.updateTokenIDview} placeholder="Token ID" /> 
                        <br/><br/>
                        <input type="submit" disabled={!this.state.tokenIDview}value="View"/>
                </form>
            </div>

</fieldset>
</div>);
}
}
export default App;