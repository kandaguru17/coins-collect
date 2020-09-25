import React, { useState } from 'react';

function RequestTableRow({ counter, rowData, contributorsCount, finalizeRequest, approveRequest }) {
  const [state, setState] = useState(false);

  const onClick = async (e) => {
    if (contributorsCount / 2 < rowData[4]) {
      setState(true);
      await finalizeRequest(e, counter);
    } else {
      setState(true);
      await approveRequest(counter);
    }
    setState(false);
  };

  return (
    <tr>
      <th scope='row'>{counter + 1}</th>
      <td>{rowData[0]}</td>
      <td>{rowData[1]}</td>
      <td>{rowData[2]}</td>
      <td>{rowData[3] ? 'Completed' : 'Pending'}</td>
      <td>{`${rowData[4]}/${contributorsCount}`}</td>
      <td>
        <button
          className={`btn btn-sm ${contributorsCount / 2 < rowData[4] ? 'btn-success' : 'btn-info'} `}
          style={{ cursor: 'default' }}
          disabled={rowData[3]}
          onClick={(e) => onClick(e)}
        >
          {contributorsCount / 2 < rowData[4] ? 'Finalize' : 'Approve'}
          {state && <span class='spinner-grow spinner-grow-sm mr-1' role='status' aria-hidden='true' />}
        </button>
      </td>
    </tr>
  );
}

export default RequestTableRow;
