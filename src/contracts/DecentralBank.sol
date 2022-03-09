pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank{
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public staker;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd,Tether _tether) public   {
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }
    


    //deposit
    function deposit(uint _amount) public {
        require(_amount > 0,'amount cannot be zero');
        //transfer tether token to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        //update stanking balance
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender ]){
            staker.push(msg.sender);
        } 
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

        //unstake token
        function unstakeToken() public{
            uint balance = stakingBalance[msg.sender];
            require(balance > 0,"balance can't be zero");
            //transfer token to specified contract address from our bank
            tether.transfer(msg.sender,balance);
            //reset staking balance
            stakingBalance[msg.sender] = 0;
            //update staking status
            isStaking[msg.sender]=false;
        } 

    //issueReward
    function issueToken()public {
        //require the owner to issue token
        require(msg.sender == owner,'caller must be owner');
        for(uint i = 0;i<staker.length;i++){
            address recipient = staker[i];
            uint balance = stakingBalance[recipient]/9; // /9 to create incentive for staker
            if(balance > 0){
            rwd.transfer(recipient,balance);
            }
        }
    }
}
