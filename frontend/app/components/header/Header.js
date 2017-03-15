import React, {Component} from 'react';

export default class Header extends Component {
  state = { isLoggedIn: undefined }

  static propTypes = {
    user: React.PropTypes.object
  }

  static defaultProps = {
    user: undefined
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              Wiregoose
            </a>
          </div>
        </div>
      </nav>
    );
  }
}