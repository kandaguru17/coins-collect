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
  const [spendingRequest, setSpendingRequest] = useState({ description: '', value: '', recepient: '' });
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
  }, []);

  const loadingData = () => {
    return state.isLoading && <div className='text-center'>{renderLoading()}</div>;
  };

  const contributeToProject = async (value) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.contribute().send({
        from: accounts[0],
        value,
      });
      history.push(`/campaigns/${campaignId}/contributors`);
    } catch (err) {
      setState((prevState) => ({ ...prevState, message: err.message }));
    }
  };

  const createSpendingRequest = async (desc, value, rece) => {
    const accounts = await web3.eth.getAccounts();
    try {
      await campaignInstance.methods.createSpendingRequest(desc, value, rece).send({
        from: accounts[0],
      });
      history.push(`/campaigns/${campaignId}/requests`);
    } catch (err) {
      setState((prevState) => ({ ...prevState, message: err.message }));
    }
  };

  return (
    <>
      <h2>
        Project Info of <strong>{campaignId}</strong>
      </h2>
      {loadingData()}
      <div className='row mt-5'>
        <ProjectDetails result={state.result} isLoading={state.isLoading} />
        <div className='col-6'>
          <ContributeForm placeholder='Contribution Amount' buttonText='contribute' isLoading={state.isLoading} onFormSumit={contributeToProject} />
          <SpendingRequestForm onFormSubmit={createSpendingRequest} isLoading={state.isLoading} setSpendingRequest={setSpendingRequest} state={spendingRequest} />
        </div>
      </div>
    </>
  );
}

export default ViewProjectDetails;
