pragma solidity ^0.5.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract Chorder is ERC721{

    //@Publisher Publishing content on the network by the producer

    //struct to store content details
    struct ContentInfo{
        //hash of the content. Will change this method with NuCypher Integration
        string ipfsHash;
        //address of the publisher, to recieve the payments.
        address publisherAddress;
        //commission in percentage that the publisher recievers for every subsequent transaction
        uint256 transactionCommission;
    }

    //mappings with unique MovieIds.
    //movieId is the keyvalue, to store the movie details
    mapping(uint256 => ContentInfo) internal fileinfo;
    //movieId is the keyvalue, to store the price of the token for initial buy (MRP of the content)
    mapping (uint256 => uint256) internal setPrice;

    //@TokenOwner reselling the content on the platform
    struct Reselling{
        uint256 resalePrice;
        bool isUpForResale;
        uint256 movieId;
    }

    //tokenID to Reselling mapping, to map the token's data and reselling details
    mapping (uint256 => Reselling) internal reSale;

    //an internally kept balance ledger for all the players on the ecosystem.
    mapping (address => uint256) internal accountBalance;

    //This will be the tokendata.
    struct tokenIPFS{
        string ipfsHash;
    }

    //tokenId to tokenIPFS mapping
    mapping(uint256 => tokenIPFS) internal tokenData;

    //arbitrary counter to help generate unique tokenID
    uint256 tokenCounter;

    //events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event MoviePublished(address indexed publisher, uint256 indexed movieId);
    //event to be emitted when a seller puts out a token for sale
    event ResalePriceSet(uint256 indexed resalePrice, uint256 indexed tokenId, uint256 indexed movieId);

    /**
     * @dev Gets the token name
     * @return string representing the token name
     */
    function name() external pure returns (string memory) {  // @dev view/pure
        return "ChorderToken";
    }

    /**
     * @dev Gets the token symbol
     * @return string representing the token symbol
     */
    function symbol() external pure returns (string memory) {
        return "CHT";
    }


    //function to add movie details into the chain i.e. publish the movie
    function addMovieDetails (string memory _ipfshash, uint256 _movieId, uint256 _price, uint256 _transactionCommission) public {
        require(fileinfo[_movieId].publisherAddress==address(0), "This movie has already been published!");
        fileinfo[_movieId].ipfsHash = _ipfshash;
        fileinfo[_movieId].publisherAddress = msg.sender;
        fileinfo[_movieId].transactionCommission = _transactionCommission;
        setPrice[_movieId] = _price*1 finney;
        emit MoviePublished(msg.sender, _movieId);

    }

    //tokenId a value that will be less than 10,000,000,000
    function _generateTokenID(uint256 _movieId) private returns(uint256){
        tokenCounter++;
        uint256 tokenid = uint256(keccak256(abi.encodePacked(_movieId, now,tokenCounter))) % 10000;
        return(tokenid);
    }

    function _generateToken(address to, uint256 tokenId, uint256 _movieId) internal {
        _mint(to, tokenId);

        //resalePrice set to initial MRP by default
        reSale[tokenId].resalePrice = setPrice[_movieId];
        //token is not up for resale by default; the owner needs to put it up for sale.
        //(bool is false by default, so no code here)
        reSale[tokenId].movieId = _movieId;
        tokenData[tokenId].ipfsHash = fileinfo[_movieId].ipfsHash;
        //tokenData[tokenId].ipfsHash = fileinfo[isbn].ipfsHash;
        emit Transfer(address(0), to, tokenId);
    }

    function buyFromPublisher(uint _movieId) public payable returns (bool) {
        //to revert back if the buyer doesn't have the price by the author.
        require(fileinfo[_movieId].publisherAddress != address(0),"Movie does not exist !");
        require(msg.value >= setPrice[_movieId],"Insufficient funds ! Please pay the price as set by the author.");
        uint256 tokenId = _generateTokenID(_movieId);
        //A new and unique token gets generated, corresponding to the particular movie.
        _generateToken(msg.sender, tokenId,_movieId);
        //publisher's balance gets updated
        accountBalance[fileinfo[_movieId].publisherAddress] += msg.value;
        return true;
    }

    //function to set resale price on a token that is being put up for sale
    function setResalePrice(uint256 newPrice, uint256 tokenId) public{
        require(ownerOf(tokenId)==msg.sender, "You are not the owner of this token!");
        reSale[tokenId].resalePrice = newPrice*1 finney;
        reSale[tokenId].isUpForResale = true;
        emit ResalePriceSet(newPrice, tokenId, reSale[tokenId].movieId);
    }

    function buyToken(uint256 tokenId) public payable{
        //works only if the given token is up for sale
        require(reSale[tokenId].isUpForResale == true, "This token hasn't been put for sale by the owner");
        //set to a static value. This becomes an auction in future versions
        require(msg.value >= reSale[tokenId].resalePrice, "Your price doesn't match the price given by the tokenOwner");

        //Finding the commissionPercent from fileinfo, and then finding the concrete value of it
        uint256 resaleCommission = msg.value*((fileinfo[reSale[tokenId].movieId].transactionCommission)/100);
        //updating accountBalance for the publisher
        accountBalance[fileinfo[reSale[tokenId].movieId].publisherAddress] += resaleCommission;

        //updating the accountBalance for the tokenOwner
        accountBalance[ownerOf(tokenId)] += (msg.value - resaleCommission);

        emit Transfer(ownerOf(tokenId), msg.sender, tokenId);
        transferFrom(ownerOf(tokenId), msg.sender, tokenId);
        reSale[tokenId].isUpForResale = false;
    }


    //To transfer a token freely to an address. Only owner of the said token can do it.
    function transfer(address _to, uint256 _tokenId) public{
        require(ownerOf(_tokenId)==msg.sender, "You are not the owner of this token!");
        transferFrom(ownerOf(_tokenId), _to, _tokenId);
        reSale[_tokenId].isUpForResale = false;
        emit Transfer(msg.sender, _to, _tokenId);
    }

    //To view the tokenData, i.e to consume the content. only tokenOwner can do so.
    function viewTokenData(uint256 tokenId) public view returns(string memory){
        require(_exists(tokenId), "Token doesn't exist!");
        require(ownerOf(tokenId)==msg.sender, "You are not the owner of this token!");
        return tokenData[tokenId].ipfsHash;
    }


    //function to get all cash stored in contract back into the respective owners' account
    function withdrawBalance() public payable{
        require(accountBalance[msg.sender]!=0, "You don't have any balance to withdraw");
        (msg.sender).transfer(accountBalance[msg.sender]);
        accountBalance[msg.sender] = 0;
    }



}