import React, { useState } from 'react';

function ContributeForm({ placeholder, buttonText, contributeToProject, isLoading }) {
  const [state, setState] = useState({ amount: 0, isLoading: false, message: '' });

  const onInputChange = (e) => {
    setState({ amount: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, isLoading: true }));
    await contributeToProject(state.amount);
    setState((prevState) => ({ ...prevState, isLoading: false }));
  };

  const renderForm = () => {
    return (
      <div className='card col-8 px-4 py-4 text-center'>
        <h5>Contribute Wei to Project!</h5>
        <form onSubmit={onSubmit}>
          <div className='input-group'>
            <input
              className='form-control'
              type='number'
              placeholder={placeholder}
              onChange={onInputChange}
              name='amount'
              value={state.amount}
            />
            <div class='input-group-append'>
              <span class='input-group-text' id='basic-addon2'>
                Wei
              </span>
            </div>
          </div>
          <button type='submit' className='btn btn-primary mt-3' disabled={state.isLoading}>
            {state.isLoading && <span class='spinner-grow spinner-grow-sm mr-1' role='status' aria-hidden='true' />}
            {buttonText}
          </button>
        </form>
      </div>
    );
  };

  return <>{renderForm()}</>;
}

export default ContributeForm;
