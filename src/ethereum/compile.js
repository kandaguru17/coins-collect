const fse = require('fs-extra');
const solc = require('solc');
const path = require('path');

// get the build folder path
const buildPath = path.resolve(__dirname, 'build');

// remove the build folder as the compile process starts
fse.removeSync(buildPath);

// get the campaign contract path
const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
// Read file synchronously
const source = fse.readFileSync(contractPath, 'utf-8');
//compile the Campaign contract
const compiledContracts = solc.compile(source, 1).contracts;

//make sure if build is available and create one if not existing
fse.ensureDirSync(buildPath);

//iterate through the compiledcontract json and retrieve the contracts as separate json files
for (let contract in compiledContracts) {
  const contractAbiPath = path.resolve(buildPath, `${contract.replace(':', '')}.json`);
  fse.writeJsonSync(contractAbiPath, compiledContracts[contract]);
}
