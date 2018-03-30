import React from 'react';
import { connect, } from 'react-redux';
import { Link, Redirect, } from 'react-router-dom';

import LoginForm from './login-form';
import Modal from './modal.js';
import RegistrationForm from './registration-form.js';
import About from './about.js';

import './landing-page.css';

export function LandingPage(props) {
  // If we are logged in redirect straight to the user's dashboard
  if (props.loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="landing-page">
    <Modal />
      <section id="header" className="container">
        <div className="about content">
          <header>
            <h1 className="landing-header">
              OUR APP NAME
            </h1>
            <h2 className="landing-sub-header">
              Working remote shouldn't FEEL remote.
            </h2>
          </header>
          <footer>
            {/* Add image inside link to click to the next page  */}
          </footer>
        </div>
      </section>
      <About />
      <section id="sign-up" className="container">
        <div className="about content">
        <RegistrationForm />
          <header>
          </header>
          <footer>
            {/* Add image inside link to click to the next page  */}
          </footer>
        </div>
      </section>
    </div>
  );
}

const mapStateToProps = state => ({ loggedIn: state.auth.currentUser !== null, });

export default connect(mapStateToProps)(LandingPage);
