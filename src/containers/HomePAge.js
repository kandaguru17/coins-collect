import React from 'react';
import { useHistory } from 'react-router-dom';

export function HomePage() {
  const history = useHistory();
  return (
    <div className='text-center' style={{ marginTop: '25vh' }}>
      <button className='btn btn-success btn-lg' onClick={() => history.push('/show')}>
        Get started
      </button>
    </div>
  );
}
