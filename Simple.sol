//SPDX-License-Identifier: unlicensed

pragma solidity >=0.5.0 <0.7.0;

contract Simple {
    uint256 number;

    event Sum(uint256 indexed total);

    constructor(uint256 _number) public {
        number = _number;
    }

    function readNumber() public view returns (uint256) {
        return number;
    }

    function add(uint256 _addingNumber) public {
        number = number + _addingNumber;
        emit Sum(number);
    }

    function sub(uint256 _subNumber) public {
        number = number - _subNumber;
        emit Sum(number);
    }

    function mul(uint256 _mulNumber) private {
        number = number * _mulNumber;
    }
}
