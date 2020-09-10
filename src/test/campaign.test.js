const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach('Tests setup', async () => {
  // get all accounts from the ganache cli
  accounts = await web3.eth.getAccounts();

  //create and deploy the factory contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({ data: compiledFactory.bytecode }).send({ from: accounts[0], gas: '1000000' });

  //use the createCampaign method of factory contract to create a campaign
  await factory.methods.createCampaign(web3.utils.toWei('0.01', 'ether')).send({ from: accounts[0], gas: '1000000' });

  // get the address of the created campaign
  [campaignAddress] = await factory.methods.getDeployedContracts().call();

  //get the campaign instance already deployed on the blockchain
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Contract Testing', () => {
  it('deploys contracts succesfully', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('check if manger is not null and correctly assigned', async () => {
    const contractManager = await campaign.methods.manager().call();
    assert.equal(contractManager, accounts[0]);
  });

  it('Contributes more than minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '3',
      });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it('manager can create a spending Request', async () => {
    const newLocal = 'test description';
    await campaign.methods.createSpendingRequest(newLocal, 12, accounts[2]).send({ from: accounts[0], gas: '1000000' });

    const { complete, value, description } = await campaign.methods.requests(0).call();
    assert.equal(complete, false);
    assert.equal(value, 12);
    assert.equal(description, newLocal);
  });

  it('Others cannot create a spending Request', async () => {
    try {
      await campaign.methods.createSpendingRequest(newLocal, 12, accounts[2]).send({ from: accounts[1], gas: '1000000' });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it('Contributor can approve spending requests', async () => {
    //contribute to the campaign
    await campaign.methods.contribute().send({ from: accounts[1], value: web3.utils.toWei('1', 'ether') });

    //create request
    const request = await campaign.methods.createSpendingRequest('test', 12, accounts[2]).send({ from: accounts[0], gas: '1000000' });

    // approve the request
    await campaign.methods.approveRequest(0).send({ from: accounts[1], gas: '1000000' });

    //get the approved request
    const { approvalsCount } = await campaign.methods.requests(0).call();

    assert.equal(approvalsCount, 1);
  });

  it('manager can not approve spending requests', async () => {
    //create request
    const request = await campaign.methods.createSpendingRequest('test', 12, accounts[2]).send({ from: accounts[0], gas: '1000000' });

    try {
      // approve the request
      await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '1000000' });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it('manager can finalize spending requests', async () => {
    //contribute to the campaign
    await campaign.methods.contribute().send({ from: accounts[1], value: web3.utils.toWei('1', 'ether') });

    //create request
    const request = await campaign.methods.createSpendingRequest('test', 12, accounts[2]).send({ from: accounts[0], gas: '1000000' });

    // approve the request
    await campaign.methods.approveRequest(0).send({ from: accounts[1], gas: '1000000' });

    // finalize the request
    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' });

    //get the finalized request
    const { complete, approvalsCount } = await campaign.methods.requests(0).call();

    assert(complete);
    assert.equal(approvalsCount, 1);
    assert.equal(await web3.eth.getBalance(accounts[2]), '100000000000000000012');
  });

  it('contributor can not finalize the request', async () => {
    try {
      //contribute to the campaign
      await campaign.methods.contribute().send({ from: accounts[1], value: web3.utils.toWei('1', 'ether') });

      //create request
      const request = await campaign.methods.createSpendingRequest('test', 12, accounts[2]).send({ from: accounts[0], gas: '1000000' });

      // approve the request
      await campaign.methods.approveRequest(0).send({ from: accounts[1], gas: '1000000' });

      // finalize the request
      await campaign.methods.finalizeRequest(0).send({ from: accounts[1], gas: '1000000' });

      assert(false);
    } catch (err) {
      assert(true);
    }
  });
});
