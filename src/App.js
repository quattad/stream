import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

// Import components
import Navbar from "./components/navbar.components"
import CreateUser from "./components/create-user.components"

function App() {
  return (
    // Map url paths to diff. components to load on page
    <Router>
      <Navbar />
      <Route path="/user" component={ CreateUser } />
    </Router>
    );
  }

export default App;
