pragma solidity ^0.5.0;

import "./Chorder_Helper.sol";

contract Token_Approved_Sale is Chorder_Helper{

    function tokenSale (uint256 _tokenId) public payable{
        require(reSalePrices[_tokenId] == msg.value,
        "The token is either not for sale or your price doesn't match");
    }

}