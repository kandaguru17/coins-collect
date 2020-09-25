import React, { useState } from 'react';
import factoryInstance from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { useHistory } from 'react-router-dom';

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
      await factoryInstance.methods.createCampaign(state.minimumContribution, state.description).send({ from: accounts[0] });
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
      <h1>Create a new Project here</h1>
      <form onSubmit={onFormSubmit} className='row'>
        <div className='input-group col-6 offset-2'>
          <input type='number' value={state.minimumContribution} className='form-control' placeholder='Minimum Contribution' name='minimumContribution' onChange={onChange} />
          <div class='input-group-append'>
            <span class='input-group-text' id='basic-addon2'>
              Wei
            </span>
          </div>
        </div>
        <div className='col-6 offset-2 mt-3'>
          <textarea
            rows='10'
            type='text'
            value={state.description}
            className='form-control '
            placeholder='description'
            name='description'
            onChange={onChange}
            value={state.description}
          />
        </div>
        <div className='col-6 offset-2 mt-3'>
          <button type='submit' className='btn btn-primary' disabled={state.isLoading}>
            {state.isLoading && <span class='spinner-grow spinner-grow-sm mr-1' role='status' aria-hidden='true' />}
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProject;
