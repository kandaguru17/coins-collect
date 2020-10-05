import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import CreateProject from './containers/CreateProject';
import { HomePage } from './containers/HomePAge';
import ShowProjects from './containers/ShowProjects';
import UpdateProject from './containers/UpdateProject';
import ViewProjectDetails from './containers/ViewProjectDetails';
import ViewSpendingRequests from './containers/ViewSpendingRequests';

function App() {
  return (
    <div>
      <Navbar />
      <div className='container'>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/show' component={ShowProjects} />
          <Route exact path='/create' component={CreateProject} />
          <Route exact path='/view/:campaignId' component={ViewProjectDetails} />
          <Route exact path='/update/:campaignId' component={UpdateProject} />
          <Route exact path='/campaigns/:campaignId/requests' component={ViewSpendingRequests} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
