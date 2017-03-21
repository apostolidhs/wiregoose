import React from 'react';

export default class Header extends React.Component {
  state = { isLoggedIn: undefined }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              Wiregoose
            </a>
          </div>
        </div>
      </nav>
    );
  }
}
