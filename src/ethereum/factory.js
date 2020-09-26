import web3 from './web3';
import factory from './build/CampaignFactory.json';

const deployedContractAddress = '0x83103D1D1c4DaBD731A09286F4a39871d3F3464B';

// getting the deployed instance of the the campaignFactory on the blockchain
const factoryInstance = new web3.eth.Contract(JSON.parse(factory.interface), deployedContractAddress);

export default factoryInstance;
