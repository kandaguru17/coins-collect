pragma solidity >=0.4.25 <0.7.0;

contract CampaignFactory {
    CampaignStruct[] public deployedCampaigns;

    uint256 nextIndex = 1;

    struct CampaignStruct {
        uint256 id;
        Campaign campaign;
    }

    function createCampaign(
        uint256 minimumContribution,
        string memory description
    ) public {
        Campaign createdCampaign = new Campaign(
            minimumContribution,
            description,
            msg.sender
        );

        deployedCampaigns.push(
            CampaignStruct({campaign: createdCampaign, id: nextIndex})
        );
        nextIndex++;
    }

    function updateCampaign(
        uint256 index,
        uint256 _minimumContribution,
        string memory _description
    ) public {
        CampaignStruct storage cs = deployedCampaigns[index];
        Campaign c = cs.campaign;
        c.setMinimumContribution(_minimumContribution);
        c.setCampaignDescription(_description);
    }

    function getDeployedContracts() public view returns (Campaign[] memory) {
        Campaign[] memory campaigns = new Campaign[](deployedCampaigns.length);
        for (uint256 i = 0; i < deployedCampaigns.length; i++) {
            CampaignStruct storage cs = deployedCampaigns[i];
            campaigns[i] = cs.campaign;
        }
        return campaigns;
    }

    function getOneCampaign(uint256 index)
        public
        view
        returns (uint256, string memory)
    {
        return (
            deployedCampaigns[index].campaign.minimumContribution(),
            deployedCampaigns[index].campaign.campignDescription()
        );
    }

    function deleteCampaign(uint256 index) public {
        delete deployedCampaigns[index];
    }

    function getCampaignIndex(uint256 index) public view returns (uint256) {}

    modifier onlyMananger(Campaign c) {
        require(
            msg.sender == c.manager(),
            "only Mananger can perform this operation"
        );
        _;
    }
}

contract Campaign {
    address public manager;
    uint256 public minimumContribution;
    string public campignDescription;
    mapping(address => bool) public contributors;
    uint256 public contributorsCount;
    Request[] public requests;ss

    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvers;
    }

    constructor(
        uint256 _minimumContribution,
        string memory _description,
        address _senderAddress
    ) public {
        manager = _senderAddress;
        minimumContribution = _minimumContribution;
        campignDescription = _description;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // function is payable because this transaction needs some value (ether/wei)
    function contribute() public payable minimumContributionCheck {
        require(!contributors[msg.sender], "Already Contributed");
        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createSpendingRequest(
        string memory _description,
        uint256 _value,
        address payable _recipient
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
            string memory,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            manager,
            campignDescription,
            address(this).balance,
            minimumContribution,
            contributorsCount,
            requests.length
        );
    }

    function setMinimumContribution(uint256 _minimumContribution) external {
        minimumContribution = _minimumContribution;
    }

    function setCampaignDescription(string calldata _description) external {
        campignDescription = _description;
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
