import React, { useEffect, useState } from 'react';
import ContributeForm from '../component/ContributeForm';
import ProjectDetails from '../component/ProjectDetails';
import SpendingRequestForm from '../component/SpendingRequestForm';
import getCampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { renderLoading } from './ShowProjects';

function ViewProjectDetails(props) {
  const { campaignId } = props.match.params;
  const [state, setState] = useState({ isLoading: true, result: {}, message: '' });
  const [reRender, setReRender] = useState(false);

  const campaignInstance = getCampaignInstance(campaignId);

  useEffect(() => {
    const getProejctData = async () => {
      try {
        const projectData = await campaignInstance.methods.getCampaignInfo().call();
        setState((prevState) => ({ ...prevState, isLoading: false, result: projectData }));
      } catch (err) {
        setState((prevState) => ({ ...prevState, message: err.message, isLoading: false }));
      }
    };
    getProejctData();
  }, [reRender]);

  const loadingData = () => {
    return state.isLoading && <div className='text-center'>{renderLoading()}</div>;
  };

  const createSpendingRequest = async (desc, value, rece) => {
    const accounts = await web3.eth.getAccounts();
    try {
      await campaignInstance.methods.createSpendingRequest(desc, value, rece).send({
        from: accounts[0],
      });
      setReRender(!reRender);
    } catch (err) {
      setState((prevState) => ({ ...prevState, message: err.message }));
    }
  };

  const contributeToProject = async (value) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.contribute().send({
        from: accounts[0],
        value,
      });
      setReRender(!reRender);
    } catch (err) {
      setState((prevState) => ({ ...prevState, message: err.message }));
    }
  };

  const renderForms = () => {
    return (
      !state.isLoading && (
        <div className='row mt-5'>
          <ProjectDetails result={state.result} isLoading={state.isLoading} campaignId={campaignId} />
          <div className='col-6'>
            <ContributeForm
              placeholder='Contribution Amount'
              buttonText='contribute'
              isLoading={state.isLoading}
              contributeToProject={contributeToProject}
            />
            <SpendingRequestForm onFormSubmit={createSpendingRequest} isLoading={state.isLoading} />
          </div>
        </div>
      )
    );
  };

  return (
    <>
      <h2 className='text-center'>
        <strong>{campaignId}</strong>
      </h2>
      <div className='text-center'>
        {loadingData()}
        {renderForms()}
      </div>
    </>
  );
}

export default ViewProjectDetails;