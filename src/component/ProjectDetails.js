import React from 'react';
import { useHistory } from 'react-router-dom';

const CONST_DEF = {
  manager: 'The manager creates this campaign and can create requests to withdraw money',
  basicContribution: 'You must contribute at least this much wei to become an approver',
  request: 'A request tries to withdraw money from the contract prior approval',
  contributors: 'Number of people who have already donated to this campaign',
  balance: 'The balance is how much money this campaign has left to spend',
};

function ProjectDetails({ isLoading, result, campaignId }) {
  const history = useHistory();

  const renderCards = (title, value, style, className, metric, onClick, metaData) => {
    return (
      !isLoading && (
        <div className={`card ${className} mb-3`} style={style} onClick={onClick}>
          <div className='card-header'>
            <strong>{title}</strong>
          </div>
          <div className='card-body'>
            <p className='card-titile'>
              <strong>
                {`${value} `}
                <em>{metric}</em>
              </strong>
            </p>
            <p className='card-text text-muted'>{metaData}</p>
          </div>
        </div>
      )
    );
  };

  return (
    <div className='col-6'>
      <div className='col-12'>
        {renderCards('Manager Info', result[0], {}, 'bg-light', null, null, CONST_DEF['manager'])}
      </div>
      <div className='col-12'>{renderCards('Project Description', result[1], {}, 'bg-light')}</div>
      <div className='row'>
        <div className='col-6'>
          {renderCards('Balance Amount', result[2], {}, 'bg-light', 'Wei', null, CONST_DEF['balance'])}
        </div>
        <div className='col-6'>
          {renderCards('Basic Contribution', result[3], {}, 'bg-light', 'Wei', null, CONST_DEF['basicContribution'])}
        </div>
      </div>
      <div className='row'>
        <div className='col-6'>
          {renderCards('Contributors Count', result[4], {}, 'bg-light', null, null, CONST_DEF['contributors'])}
        </div>
        <div className='col-6'>
          {renderCards(
            'Spending Requests Count',
            result[5],
            { cursor: 'pointer' },
            'bg-light',
            null,
            () => history.push(`/campaigns/${campaignId}/requests`),
            CONST_DEF['request']
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
