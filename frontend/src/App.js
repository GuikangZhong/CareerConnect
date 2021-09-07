import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Home from './pages/Home';
import Signup from './pages/Signup';
import JobPosting from './pages/JobPosting';
import CreateJobPosting from './pages/CreateJobPosting';
import Credits from './pages/Credits';
import Applications from './pages/Applications';
import Application from './pages/Application';
import Profile from './pages/Profile';
import React from 'react';
import { AuthContextProvider } from './context/AuthContext';
import Interview from './pages/Interview';

import SignupConfirmation from './pages/SignupConfirmation';
import Schedules from './pages/Schedules';

const App = () => {

  return (
      <Router>
        <AuthContextProvider>
          <div>
            <Route exact path='/' component={Home}/>
            <Route exact path='/signin' component={Signin}/>
            <Route exact path='/signup' component={Signup}/>
            <Route exact path="/job/:id" component={JobPosting}/>
            <Route exact path="/createjob" component={CreateJobPosting}/>
            <Route exact path="/credits" component={Credits}/>
            <Route exact path="/applications" component={Applications}/>
            <Route exact path="/application/:applicationId" component={Application}/>
            <Route exact path="/profile/:companyId" component={Profile}/>
            <Route exact path={`/interview/:roomId/:title/:peerName`} component={Interview}/>
            <Route exact path={`/schedule`} component={Schedules}/>
            <Route exact path="/confirm/:token" component={SignupConfirmation}/>
          </div>
        </AuthContextProvider>
      </Router>
  );
}

export default App;
