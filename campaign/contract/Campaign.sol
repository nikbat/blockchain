pragma solidity ^0.4.17;


contract Campaign {
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    //address[] public approvers;
    mapping(address => bool) public approvers;
    uint approversCount;
    address public contractAddress;
    uint public contractBalance;
    
    
    //modifiers are created just above constructor function

    modifier ristricted(){
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum) public{
        manager = msg.sender;
        minimumContribution = minimum;
        contractAddress = this;
        contractBalance = this.balance;
    }
    
    function contribute() public payable{
        require(msg.value > minimumContribution);
        //approvers.push(msg.sender);
        approvers[msg.sender] = true;
        approversCount++;
        contractBalance = this.balance;
    }
    
    function createRequest(string description,
        uint value,
        address recipient) public ristricted {
            
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });
        
        /*
        request can be created like following also
        Request(description,value,recipient,false);
        dont use this approach, if the order of struct variable changes we will get the error message
        */
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount/2) );
        request.recipient.transfer(request.value);
    }
    
    
}