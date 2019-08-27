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
    //mapping from tokenId to resalePrice
    mapping (uint256 => uint256) internal reSalePrices;

}