import React, { useState } from 'react';
import factoryInstance from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { useHistory } from 'react-router-dom';
import From from '../component/From';

function CreateProject() {
  const [state, setState] = useState({ minimumContribution: 0, description: '', message: '', isLoading: false });
  const history = useHistory();

  const onChange = (e) => {
    e.persist();
    setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onFormSubmit = async (e) => {
    setState((prevState) => ({ ...prevState, isLoading: true, message: '' }));
    e.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await factoryInstance.methods
        .createCampaign(state.minimumContribution, state.description)
        .send({ from: accounts[0] });
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
          <h4 class='alert-heading'>Oops!</h4>
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
        title={'Create a new Project here'}
        formType={'create'}
      />
    </div>
  );
}

export default CreateProject;
