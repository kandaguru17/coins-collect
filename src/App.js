import React from 'react';
import './App.css';
import ShowProjects from './containers/showProjects';
import CreateProject from './containers/CreateProject';
import Navbar from './component/Navbar';
import { Switch, Route } from 'react-router-dom';
import ViewProjectDetails from './containers/ViewProjectDetails';
import ViewSpendingRequests from './containers/ViewSpendingRequests';

function App() {
  return (
    <div className=''>
      <Navbar />
      <div className='container'>
        <Switch>
          <Route path='/show' component={ShowProjects} />
          <Route path='/create' component={CreateProject} />
          <Route path='/view/:campaignId' component={ViewProjectDetails} />
          <Route path='/campaigns/:campaignId/requests' component={ViewSpendingRequests} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
