import React from 'react';
import Header from '../header/Header.js';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header></Header>
        <div style={{textAlign: 'center'}}>
          <h1>Hello World</h1>
        </div>
      </div>
    );
  }
}
