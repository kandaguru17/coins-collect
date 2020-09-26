import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../component/ProjectCard';
import factoryInstance from '../ethereum/factory';
import web3 from '../ethereum/web3';

export const renderLoading = () => {
  return (
    <div className='spinner-border text-info mt-2 text-center mx-auto' role='status'>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

function ShowProjects() {
  const [campaigns, setCampaigns] = useState({ isloading: true, results: [] });
  const [reRender, setReRender] = useState(true);

  useEffect(() => {
    const getAllCampaigns = async () => {
      const allCampaigns = await factoryInstance.methods.getDeployedContracts().call();
      setCampaigns({ isloading: false, results: allCampaigns.filter((it) => it !== NULL_ADDRESS) });
    };

    getAllCampaigns();
  }, [reRender]);

  const onDelete = async (address) => {
    const accounts = await web3.eth.getAccounts();
    await factoryInstance.methods.deleteCampaign(address).send({
      from: accounts[0],
    });
    setReRender(!reRender);
  };

  const renderAllCampaigns = () => {
    return campaigns.isloading
      ? renderLoading()
      : campaigns.results.map((it) => <ProjectCard address={it} key={it} onDelete={() => onDelete(it)} />);
  };

  return (
    <div>
      <Link className='btn btn-success float-right mt-5' to='/create'>
        <i className='fa fa-plus mr-1' />
        Create Project
      </Link>
      <h1 className='my-5 text-center'>Projects Looking out for Funding</h1>
      <div className='row'>{renderAllCampaigns()}</div>
    </div>
  );
}

export default ShowProjects;
