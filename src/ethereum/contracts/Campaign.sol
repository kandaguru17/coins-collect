pragma solidity >=0.4.25 <0.7.0;

contract CampaignFactory {
    struct CampaignStruct {
        uint256 id;
        Campaign campaign;
    }

    CampaignStruct[] public deployedCampaigns;
    uint256 nextIndex = 1;

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

    // function updateCampaign(
    //     address _campaignAddress,
    //     uint256 _minimumContribution,
    //     string memory _description
    // ) public {
    //     Campaign campAtAddress = Campaign(_campaignAddress);
    //     campAtAddress.setMinimumContribution(_minimumContribution);
    //     campAtAddress.setCampaignDescription(_description);
    // }

    function getDeployedContracts() public view returns (Campaign[] memory) {
        Campaign[] memory campaigns = new Campaign[](deployedCampaigns.length);
        for (uint256 i = 0; i < deployedCampaigns.length; i++) {
            CampaignStruct storage cs = deployedCampaigns[i];
            campaigns[i] = cs.campaign;
        }
        return campaigns;
    }

    function deleteCampaign(address _campaignAddress) public {
        uint256 foundIndex = getCampaignIndex(_campaignAddress);
        Campaign campToDelete = Campaign(_campaignAddress);
        delete deployedCampaigns[foundIndex - 1];
        campToDelete.killInstance();
    }

    function getCampaignIndex(address _campaignAddress)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < deployedCampaigns.length; i++) {
            if (address(deployedCampaigns[i].campaign) == _campaignAddress) {
                return deployedCampaigns[i].id;
            }
        }
        revert("Campaign not found");
    }
}

contract Campaign {
    address public manager;
    uint256 public minimumContribution;
    string public campignDescription;
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

    function killInstance() public {
        selfdestruct(manager);
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

    function updateCampaign(
        uint256 _minimumContribution,
        string memory _description
    ) public onlyMananger {
        minimumContribution = _minimumContribution;
        campignDescription = _description;
    }

    // function setMinimumContribution(uint256 _minimumContribution) external {
    //     minimumContribution = _minimumContribution;
    // }

    // function setCampaignDescription(string _description) external {
    //     campignDescription = _description;
    // }

    function getSpendingRequestLength() public view returns (uint256) {
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
