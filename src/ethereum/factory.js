import web3 from './web3';
import factory from './build/CampaignFactory.json';

const deployedContractAddress = '0xb3fB0ABd2333E36d4931F7B75c1bFd7220F9298B';

// getting the deployed instance of the the campaignFactory on the blockchain
const factoryInstance = new web3.eth.Contract(JSON.parse(factory.interface), deployedContractAddress);

export default factoryInstance;
