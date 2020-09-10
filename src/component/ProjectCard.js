import React from 'react';
import { Link } from 'react-router-dom';

function ProjectCard({ address, description }) {
  return (
    <div className='col-4 my-2'>
      <div className='card text-center' key={address}>
        <div className='card-header'>{address}</div>
        <div className='card-body'>
          <h5 className='card-title'>Project Address : {address}</h5>
          <p className='card-text'>{description}</p>
          <Link to={`/view/${address}`} className='btn btn-primary'>
            View project
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
