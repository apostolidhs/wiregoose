import React from 'react';
import Header from '../header/Header.jsx';

export default class App extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
