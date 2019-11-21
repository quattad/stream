import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

// Import components
import Navbar from "./components/Navbar.components"
import HomePublic from "./components/HomePublic.components"
import HomePrivate from "./components/HomePrivate.components"
import LoginPublic from "./components/LoginPublic.components"
import Register from "./components/RegisterPublic.components"
import Signup from "./components/SignupPublic.components"

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
        <Route exact path="/" component={HomePublic} />
        <PrivateRoute exact path="/home" component={HomePrivate} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={LoginPublic} />
        <Route path="/signup" component={Signup} />
      </Router>
    </AuthContext.Provider>
    );
  }

export default App;
