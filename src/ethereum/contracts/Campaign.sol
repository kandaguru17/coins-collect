pragma solidity >=0.4.25 <0.7.0;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint256 minimumContribution) public {
        Campaign createdCampaign = new Campaign(
            minimumContribution,
            msg.sender
        );
        deployedCampaigns.push(createdCampaign);
    }

    function getDeployedContracts() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public contributors;
    uint256 public contributorsCount;
    Request[] public requests;

    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvers;
    }

    constructor(uint256 _minimumContribution, address senderAddress) public {
        manager = senderAddress;
        minimumContribution = _minimumContribution;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // function is payable because this transaction needs some value (ether/wei)
    function contribute() public payable minimumContributionCheck {
        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createSpendingRequest(
        string memory _description,
        uint256 _value,
        address _recipient
    ) public onlyMananger {
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            approvalsCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 requestIndex)
        public
        checkIfContributor
        checkIfApprover(requestIndex)
    {
        Request storage currentRequest = requests[requestIndex];
        currentRequest.approvers[msg.sender] = true;
        currentRequest.approvalsCount++;
    }

    function finalizeRequest(uint256 requestIndex)
        public
        payable
        onlyMananger
        checkifAtleastHalfApproved(requests[requestIndex])
    {
        Request storage request = requests[requestIndex];
        require(!requests[requestIndex].complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getCampaignInfo()
        public
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            manager,
            address(this).balance,
            minimumContribution,
            contributorsCount,
            requests.length
        );
    }

    function getSpendingRequestsCount() public view returns (uint256) {
        return requests.length;
    }

    modifier onlyMananger() {
        require(
            msg.sender == manager,
            "only Mananger can perform this operation"
        );
        _;
    }

    modifier minimumContributionCheck() {
        require(
            minimumContribution < msg.value,
            "Amount is less than the minimum contribution"
        );
        _;
    }

    modifier checkIfContributor() {
        require(
            contributors[msg.sender],
            "You must be a contributor to perform this action"
        );
        _;
    }

    modifier checkIfApprover(uint256 requestIndex) {
        require(
            !requests[requestIndex].approvers[msg.sender],
            "You Already Approved this Request"
        );
        _;
    }

    modifier checkifAtleastHalfApproved(Request storage request) {
        require(
            request.approvalsCount > contributorsCount / 2,
            "Atleast 50% of the contributors should approve the request to finalize it"
        );
        _;
    }
}
