// pragma solidity ^0.5.0;

// import "./Chorder.sol";

// contract Chorder_Helper{

//     address Chorder;

//     function buy(address _chorder, uint256 tokenId) public payable returns(bool){
//         Chorder = _chorder;
//         require(Chorder.call(bytes4(keccak256("buyToken(uint256)")), tokenId));
//         require(Chorder.call(bytes4(keccak256("buyToken(uint256)")),tokenId));

//     }
// }

pragma solidity ^0.5.0;

contract Chorder_Helper{

    constructor () public {
        owner = msg.sender;
    }
    address owner;
    address Chorder_contract;

    //mapping from tokenId to resalePrice
    mapping (uint256 => uint256) internal reSalePrices;

    //Modifier for onlyOwner functions
    modifier onlyOwner {
       require(msg.sender == owner, 'You are not the contract owner to call this function!');
       _;
    }

    //Function to set the Chorder_contract address, only to be called by the contract deployer
    function setChorderAddress(address _chorderAddress) public onlyOwner{
        Chorder_contract = _chorderAddress;
    }

    //Function to set the values of reSalePrices mapping, to be called from Chorder_contract
    function setResalePrices(uint256 _tokenid, uint256 _resalePrice) public{
        require(msg.sender == Chorder_contract, "You are not authorized to call this function!");
        reSalePrices[_tokenid] = _resalePrice;
    }

}