import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import From from '../component/From';
import getDeployedCampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';

function UpdateProject(props) {
  const [state, setState] = useState({ minimumContribution: 0, description: '', message: '', isLoading: false });
  const history = useHistory();
  const { campaignId } = props.match.params;
  const campaign = getDeployedCampaignInstance(campaignId);

  const onChange = (e) => {
    e.persist();
    setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const getIntialData = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      const res = await campaign.methods.getCampaignInfo().call();
      setState((prevState) => ({ ...prevState, minimumContribution: res[3], description: res[1], isLoading: false }));
    };
    getIntialData();
  }, []);

  const onFormSubmit = async (e) => {
    setState((prevState) => ({ ...prevState, isLoading: true, message: '' }));
    e.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.updateCampaign(state.minimumContribution, state.description).send({ from: accounts[0] });
      setState((prevState) => ({ ...prevState, isLoading: false }));
      history.push('/show');
    } catch (err) {
      setState((prevState) => ({ ...prevState, message: err.message, isLoading: false }));
    }
  };

  const renderMessage = () => {
    const className = 'alert alert-danger alert-dismissible fade show';
    return (
      !state.isLoading &&
      !!state.message && (
        <div className={`${className} p-3 mt-3`} role='alert'>
          <h4 className='alert-heading'>Oops!</h4>
          {state.message}
          <button
            type='button'
            className='close'
            data-dismiss='alert'
            aria-label='Close'
            onClick={() => {
              setState((prevState) => ({ ...prevState, message: '' }));
            }}
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
      )
    );
  };

  return (
    <div className='text-center'>
      {renderMessage()}
      <From
        onFormSubmit={onFormSubmit}
        onChange={onChange}
        state={state}
        title={'Update your Project here'}
        formType={'update'}
      />
    </div>
  );
}

export default UpdateProject;
