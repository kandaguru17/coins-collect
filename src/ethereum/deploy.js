//0x83103D1D1c4DaBD731A09286F4a39871d3F3464B

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const NMEONIC = 'parent spy dumb penalty question news lunch chuckle imitate swap garlic surface';
const INFURA_RINKEBY = 'https://rinkeby.infura.io/v3/dded8b6d9e1844dabf3329ccd394f290';

const provider = new HDWalletProvider(NMEONIC, INFURA_RINKEBY);

const web3 = new Web3(provider);

const deployFactoryContract = async () => {
  const myAccounts = await web3.eth.getAccounts();
  const coinCollectAccount = myAccounts[2];

  console.log(`trying to deploy the contract using the account ${coinCollectAccount}`);

  try {
    const factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: '0x' + compiledFactory.bytecode })
      .send({ from: coinCollectAccount });
    console.log(`Campaign Factory contract deployed to Rinkeby network successfully at ${factory.options.address}`);
  } catch (err) {
    console.log(err);
  }
};

deployFactoryContract();
