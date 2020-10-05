import React from 'react';
import { Link } from 'react-router-dom';

function ProjectCard({ address, onDelete }) {
  return (
    <div className='col-6 my-2'>
      <div className='card text-center' key={address}>
        <div className='card-header'>
          <strong>{address}</strong>
        </div>
        <div className='card-body'>
          <Link to={`/view/${address}`} className='btn btn-primary mx-1'>
            View project
          </Link>
          <Link to={`/update/${address}`} className='btn btn-info mx-1'>
            Edit
          </Link>
          <button className='btn btn-danger' onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
