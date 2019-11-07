import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

// Import components
import Navbar from "./components/Navbar.components"
import IndexHeader from "./components/LoginPublic.components"
import Register from "./components/RegisterPublic.components"
import LoginPage from "./components/LoginPublic.components"
import Signup from "./components/SignupPublic.components"
import Admin from "./components/Admin.components"

// Import auth components
import PrivateRoute from "./components/PrivateRoute.components"
import {AuthContext} from "./services/Auth"

function App() {
  return (
    // Map url paths to diff. components to load on page
    <AuthContext.Provider value={false}>
      <Router>
        <Route path="/" component ={Navbar} />
        <Route exact path="/" component={IndexHeader} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/admin" component={Admin} />
      </Router>
    </AuthContext.Provider>
    );
  }

export default App;
