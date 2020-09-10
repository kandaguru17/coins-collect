import React, { useState } from 'react';

function SpendingRequestForm({ onFormSubmit, isLoading, setSpendingRequest, state }) {
  // const [state, setState] = useState({ description: '', value: '', recepient: '' });

  const onChange = (e) => {
    e.persist();
    setSpendingRequest((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(state.description, state.value, state.recepient);
  };

  const renderForm = () => {
    return (
      !isLoading && (
        <div className='card col-8 px-4 py-4 mt-2 text-center'>
          <h5>Create Spending Request!</h5>
          <form onSubmit={onSubmit}>
            <input name='description' placeholder='description' onChange={onChange} className='form-control my-1' />
            <input name='value' placeholder='value' onChange={onChange} className='form-control my-1' />
            <input name='recepient' placeholder='recepient' onChange={onChange} className='form-control my-2' />
            <button className='btn btn-primary'>Create Request</button>
          </form>
        </div>
      )
    );
  };

  return renderForm();
}

export default SpendingRequestForm;
