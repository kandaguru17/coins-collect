import React from 'react';

export default function From({ onFormSubmit, state, onChange, title }) {
  return (
    <>
      <h1>{title}</h1>
      <div>
        <form onSubmit={onFormSubmit} className='row'>
          <div className='input-group col-6 offset-2'>
            <input
              type='number'
              value={state.minimumContribution}
              className='form-control'
              placeholder='Minimum Contribution'
              name='minimumContribution'
              onChange={onChange}
            />
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
    </>
  );
}
