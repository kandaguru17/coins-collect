import React from 'react';
import { Link } from 'react-router-dom';
import factoryInstance from '../ethereum/factory';

function ProjectCard({ address }) {
  const onDelete = () => {
    factoryInstance.methods.deleteCampaign();
  };

  return (
    <div className='col-6 my-2'>
      <div className='card text-center' key={address}>
        <div className='card-header'>
          <strong>{address}</strong>
        </div>
        <div className='card-body'>
          <Link to={`/view/${address}`} className='btn btn-outline-primary mx-1'>
            View project
          </Link>
          <button className='btn btn-outline-warning mx-1'>Edit</button>
          <button className='btn btn-outline-danger'>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
