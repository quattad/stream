// Necessary imports common across all components
import React, { Component } from 'react';
import { Link } from 'react-router-dom';  // link to diff routes

export default class Navbar extends Component {
    // First define custom functions
    constructor(props) {
      super(props); // call super to point to parent class constructor before using 'this'

      // Define States
      this.state = {
        'menu': false
      }

      // Define bind custom functions to parent component
      // this.jsScrollTrigger = this.jsScrollTrigger.bind(this)
      this.toggleMenu = this.toggleMenu.bind(this)
    }

      toggleMenu() {
        this.setState({menu: !this.state.menu})
      }

    render() {
        const show = (this.state.menu) ? "show":"";
        return (
            <React.Fragment>
              <nav class="navbar navbar-expand-lg bg-dark navbar-dark fixed-top" id="main-nav">
                <div class="container">
                <a class="navbar-brand js-scroll-trigger" href="/home">Stream</a>
                  <button class="navbar-toggler navbar-toggler-right" type="button" onClick={this.toggleMenu}>Menu<i class="fas fa-bars"></i></button>
                  <div class={"collapse navbar-collapse" + show} id="navbarResponsive">
                    <ul class="navbar-nav text-uppercase ml-auto">
                    <li class="nav-item active">
                        <a class="nav-link js-scroll-trigger" href="/about">Check: {show}</a>
                      </li>
                      <li class="nav-item active">
                        <a class="nav-link js-scroll-trigger" href="/about">About</a>
                      </li>
                      <li class="nav-item active">
                        <a class="nav-link js-scroll-trigger" href="/register">Register</a>
                      </li> 
                      <li class="nav-item active">
                        <a class="nav-link js-scroll-trigger" href="/login">Login</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </React.Fragment>
        )
    }
}