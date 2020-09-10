import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../component/ProjectCard';
import factoryInstance from '../ethereum/factory';

export const renderLoading = () => {
  return (
    <div className='spinner-border text-info mx-auto' role='status'>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

function ShowProjects() {
  const [campaigns, setCampaigns] = useState({ isloading: true, results: [] });

  useEffect(() => {
    const getAllCampaigns = async () => {
      const allCampaigns = await factoryInstance.methods.getDeployedContracts().call();
      setCampaigns({ isloading: false, results: allCampaigns });
    };

    getAllCampaigns();
  }, []);

  const renderAllCampaigns = () => {
    return campaigns.isloading ? renderLoading() : campaigns.results.map((it) => <ProjectCard address={it} description={it} key={it} />);
  };

  return (
    <div>
      <Link className='btn btn-primary float-right mt-5' to='/create'>
        <i className='fa fa-plus mr-1' />
        Create Project
      </Link>
      <h1 className='my-5 text-center'>Projects Looking out for Funding</h1>
      <div className='row'>{renderAllCampaigns()}</div>
    </div>
  );
}

export default ShowProjects;
