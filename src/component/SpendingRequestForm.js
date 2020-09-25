import React, { useState } from 'react';

function SpendingRequestForm({ onFormSubmit, isLoading }) {
  const [state, setState] = useState({ description: '', value: '', recepient: '', isLoading: false });

  const onChange = (e) => {
    e.persist();
    setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, isLoading: true }));
    await onFormSubmit(state.description, state.value, state.recepient);
    setState((prevState) => ({ ...prevState, isLoading: false }));
  };

  const renderForm = () => {
    return (
      <div className='card col-8 px-4 py-4 mt-2 text-center'>
        <h5>Create Spending Request!</h5>
        <form onSubmit={onSubmit}>
          <div className='input-group'>
            <input name='value' placeholder='value' onChange={onChange} className='form-control' />
            <div class='input-group-append'>
              <span class='input-group-text' id='basic-addon2'>
                Wei
              </span>
            </div>
          </div>

          <input name='recepient' placeholder='recepient' onChange={onChange} className='form-control my-2' />
          <textarea
            rows='5'
            name='description'
            placeholder='description'
            onChange={onChange}
            className='form-control my-1'
          />
          <button type='submit' className='btn btn-primary mt-3' disabled={state.isLoading}>
            {state.isLoading && <span class='spinner-grow spinner-grow-sm mr-1' role='status' aria-hidden='true' />}
            Create Request
          </button>
        </form>
      </div>
    );
  };

  return renderForm();
}

export default SpendingRequestForm;
