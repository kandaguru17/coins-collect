import React, { useEffect, useState } from 'react';
import getCampaignInstance from '../ethereum/campaign';
import { renderLoading } from './showProjects';
import web3 from '../ethereum/web3';
import RequestTableRow from '../component/RequestTableRow';

function ViewSpendingRequests(props) {
  const { campaignId } = props.match.params;
  const [state, setState] = useState({
    spendingRequests: [],
    isLoading: true,
    contributorsCount: 0,
    message: '',
  });
  const campaign = getCampaignInstance(campaignId);

  useEffect(() => {
    async function getSpendingRequests() {
      let srArr = [];
      const cCount = await campaign.methods.contributorsCount().call();
      const srLen = await campaign.methods.getSpendingRequestLength().call();
      for (let i = 0; i < srLen; i++) {
        const sr = await campaign.methods.requests(i).call();
        srArr.push(sr);
      }
      setState({ spendingRequests: srArr, isLoading: false, contributorsCount: cCount });
    }
    getSpendingRequests();
  }, []);

  const approveRequest = async (index) => {
    try {
      // setState((prevState) => ({ ...prevState ));
      const account = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(index).send({
        from: account[0],
      });
      setState((prevState) => ({ ...prevState }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, message: err.message }));
    }
  };

  const finalizeRequest = async (e, index) => {
    if (e.target.disabled) {
      // or this.disabled
      return;
    }
    try {
      // setState((prevState) => ({ ...prevState ));
      const account = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(index).send({
        from: account[0],
      });
      setState((prevState) => ({ ...prevState }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, message: err.message }));
    }
  };

  if (state && state.isLoading) return <div className='text-center'>{renderLoading()}</div>;

  const renderSpendingRequests = () => {
    return state.spendingRequests.map((it, i) => {
      console.log(it);
      return (
        <RequestTableRow
          counter={i}
          rowData={it}
          contributorsCount={state.contributorsCount}
          finalizeRequest={finalizeRequest}
          approveRequest={approveRequest}
        />
      );
    });
  };

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th scope='col'>#</th>
          <th scope='col'>Description</th>
          <th scope='col'>Amount (in Wei)</th>
          <th scope='col'>Recepient</th>
          <th scope='col'>Status</th>
          <th scope='col'>Approvals</th>
          <th scope='col'>Action</th>
        </tr>
      </thead>
    );
  };

  const renderMessage = () => {
    const className = 'alert alert-danger alert-dismissible fade show';
    return (
      !!state.message && (
        <div className={`${className} p-1 mt-3 text-center`} role='alert' style={{ textOverflow: 'ellipsis' }}>
          <h4 class='alert-heading'>Oops!</h4>
          {state.message}
          <button
            type='button'
            className='close'
            data-dismiss='alert'
            aria-label='Close'
            onClick={() => {
              setState((prevState) => ({ ...prevState, message: '' }));
            }}
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
      )
    );
  };

  return (
    <>
      {renderMessage()}
      <table className='table'>
        {renderTableHeader()}
        <tbody>{renderSpendingRequests()}</tbody>
      </table>
    </>
  );
}

export default ViewSpendingRequests;
