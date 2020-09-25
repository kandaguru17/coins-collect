import React, { useEffect, useState } from 'react';
import getCampaignInstance from '../ethereum/campaign';
import { renderLoading } from './showProjects';
import ProjectDetails from '../component/ProjectDetails';
import ContributeForm from '../component/ContributeForm';
import web3 from '../ethereum/web3';
import SpendingRequestForm from '../component/SpendingRequestForm';
import { useHistory } from 'react-router-dom';

function ViewProjectDetails(props) {
  const { campaignId } = props.match.params;
  const history = useHistory();
  const [state, setState] = useState({ isLoading: true, result: {}, message: '' });
  const [isLoading, setLoading] = useState(false);
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
  }, [isLoading]);

  const loadingData = () => {
    return state.isLoading && <div className='text-center'>{renderLoading()}</div>;
  };

  const createSpendingRequest = async (desc, value, rece) => {
    const accounts = await web3.eth.getAccounts();
    try {
      await campaignInstance.methods.createSpendingRequest(desc, value, rece).send({
        from: accounts[0],
      });
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
              isLoading={isLoading}
              contributeToProject={contributeToProject}
            />
            <SpendingRequestForm onFormSubmit={createSpendingRequest} isLoading={isLoading} />
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
