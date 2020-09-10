import React from 'react';

function ProjectDetails({ isLoading, result }) {
  const renderCards = (title, value, style, className, metric) => {
    return (
      !isLoading && (
        <div className={`card ${className} mb-3`} style={style}>
          <div className='card-header'>
            <strong>{title}</strong>
          </div>
          <div className='card-body'>
            <p className='card-text'>
              {value} <em>{metric}</em>
            </p>
          </div>
        </div>
      )
    );
  };
  return (
    <div className='col-6'>
      <div className='col-12'>{renderCards('Manager Info', result[0], {}, 'bg-light text-center')}</div>
      <div className='row'>
        <div className='col-6'>{renderCards('Balance Amount', result[1], {}, 'bg-light text-center', 'Wei')}</div>
        <div className='col-6'>{renderCards('Basic Contribution', result[2], {}, 'bg-light text-center', 'Wei')}</div>
      </div>
      <div className='row'>
        <div className='col-6'>{renderCards('Contributors Count', result[3], {}, 'bg-light text-center')}</div>
        <div className='col-6'>{renderCards('Spending Requests Count', result[4], {}, 'bg-light text-center')}</div>
      </div>
    </div>
  );
}

export default ProjectDetails;
