import React, { useState } from 'react';

function ContributeForm({ placeholder, buttonText, isLoading, onFormSumit }) {
  const [state, setState] = useState({ amount: 0 });

  const onInputChange = (e) => {
    console.log(e);
    setState({ amount: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onFormSumit(state.amount);
  };

  const renderForm = () => {
    return (
      !isLoading && (
        <div className='card col-8 px-4 py-4 text-center'>
          <h5>Contribute Wei to Project!</h5>
          <form onSubmit={onSubmit}>
            <input className='form-control' type='number' placeholder={placeholder} onChange={onInputChange} name='amount' value={state.amount}></input>
            <button className='btn btn-primary mt-3'>{buttonText}</button>
          </form>
        </div>
      )
    );
  };

  return <>{renderForm()}</>;
}

export default ContributeForm;
