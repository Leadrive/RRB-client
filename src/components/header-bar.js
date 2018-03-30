import React from 'react';
import { Link, } from 'react-router-dom';
import { connect, } from 'react-redux';
import { slide as Menu, } from 'react-burger-menu';

import { clearAuth, } from '../actions/auth';
import { clearAuthToken, } from '../local-storage';
import LoginForm from './login-form';
import './header-bar.css';

export class HeaderBar extends React.Component {
  logOut() {
    this.props.dispatch(clearAuth());
    clearAuthToken();
  }

  render() {
    // Only render the log out button if we are logged in
    let logOutButton;
    console.log(this.props.loggedIn);
    if (this.props.loggedIn) {
      logOutButton = (
        <a href="#" onClick={() => this.logOut()}>LOG OUT</a>
      );
    }
    else {
      logOutButton = (
        <Link to="/register">SIGN IN</Link>
      );
    }
    return (
      <Menu right>
        <ul>
          <li>
            <a href="#about">
              About
            </a>
          </li>
          <li>
            <a href="#github">
              Github
            </a>
          </li>

          <li>
            <a href="#sign-up">
              Sign Up
            </a>
          </li>
          <li>
            <a href="#">
              {logOutButton}
            </a>
          </li>
        </ul>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({ loggedIn: state.auth.currentUser !== null, });

export default connect(mapStateToProps)(HeaderBar);
