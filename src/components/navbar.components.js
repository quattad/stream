// Necessary imports common across all components
import React, { Component } from 'react';
import { Link } from 'react-router-dom';  // link to diff routes

export default class Navbar extends Component {
    render() {  // all components must be rendered
        return (
            <React.Fragment>
              <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
                <ul class="navbar-nav">
                <a class="navbar-brand" href="#">Stream</a>
                <li class="nav-item active">
                  <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item active">
                  <a class="nav-link" href="/register">Create User</a>
                </li>
                <li class="nav-item active">
                  <a class="nav-link" href="#">Active</a>
                </li>
                </ul>
              </nav>
            </React.Fragment>
        )
    }
}