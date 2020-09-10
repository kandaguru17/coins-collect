import campaign from '../ethereum/build/Campaign.json';
import web3 from './web3';

const getDeployedCampaignInstance = (address) => {
  return new web3.eth.Contract(JSON.parse(campaign.interface), address);
};

export default getDeployedCampaignInstance;
