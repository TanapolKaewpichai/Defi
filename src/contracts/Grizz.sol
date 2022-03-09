pragma solidity  ^0.5.0;

contract Grizz{
    string public name = 'Grizz';
    string public symbol = 'GRZ';
    uint256 public totalSupply = 1000000000000000000000000 ;// 1 million tokens
    uint8 public decimals = 18; 

    event transfer(address indexed _from,address indexed _to,uint _value);
    event approval(address indexed _owner,address indexed _spender,uint _value);

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint))public allowance;


    function approve(address _spender,uint _value)public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        emit approval(msg.sender, _spender, _value);(msg.sender,_spender,_value);
        return true;
    }

    function ownerTransfer(address _to,uint _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit transfer(msg.sender,_to,_value);
        return true;
    }

    function  transferFrom(address _from,address _to,uint _value) public returns(bool success){
        require(balanceOf[_from]>= _value);
        require(allowance[_from][msg.sender]>= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[msg.sender][_from] -=_value;
        emit transfer(_from,_to,_value);
        return true;
    }
}
