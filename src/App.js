import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

// Import public components
import Navbar from "./components/Navbar.components"
import HomePublic from "./components/HomePublic.components"
import LoginPublic from "./components/LoginPublic.components"
import Register from "./components/RegisterPublic.components"
import About from "./components/About.components.js"

// Import private components
import TeamsPrivate from "./components/TeamsPrivate.components"
import ProjectsPrivate from "./components/ProjectsPrivate.components"
import DashboardPrivate from "./components/DashboardPrivate.components"
import ProfilePrivate from "./components/ProfilePrivate.components"

// Import auth components
import PrivateRoute from "./components/PrivateRoute.components"
import {AuthContext} from "./services/AuthReducer"
import {authInitialState, authReducer} from "./services/AuthReducer"

function App() {
  const [state, dispatch] = React.useReducer(authReducer, authInitialState)
  return (
    // Map url paths to diff. components to load on page
    <AuthContext.Provider value={{
      state,
      handleLogin: () => dispatch({type: 'login'}),
      handleLogout: () => dispatch({type: 'logout'})
      }}>
      <Router>
        <Route path="/" component ={Navbar} />
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={HomePublic} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={LoginPublic} />
        <PrivateRoute exact path="/dashboard" component={DashboardPrivate} />
        <PrivateRoute exact path="/teams" component={TeamsPrivate} />
        <PrivateRoute exact path="/projects" component={ProjectsPrivate} />
        <PrivateRoute exact path="/profile" component={ProfilePrivate} />
      </Router>
    </AuthContext.Provider>
    );
  }

export default App;
