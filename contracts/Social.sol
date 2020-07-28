pragma solidity >=0.5.0 <0.6.0;

contract Social{

    address[] private user;

    function registerUser(address _user) public{
        user.push(_user);
    }

    function validateUser(address _user) view public returns (bool){
        for(uint i=0; i <= user.length; i++){
            if(user[i] == _user){
                return true;
            }
        }return false;
    }


}
