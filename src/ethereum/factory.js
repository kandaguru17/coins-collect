import web3 from './web3';
import factory from './build/CampaignFactory.json';

const deployedContractAddress = '0xE82e5a7C841e94596bed4AB5B8a4b2F2B79c939A';

// getting the deployed instance of the the campaignFactory on the blockchain
const factoryInstance = new web3.eth.Contract(JSON.parse(factory.interface), deployedContractAddress);

export default factoryInstance;
