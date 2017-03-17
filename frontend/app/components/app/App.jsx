import React from 'react';
import '../../less/index.less';
import Header from '../header/Header.jsx';
import ComponentsGallery
  from '../../sections/components-gallery/ComponentsGallery.jsx';

export default class App extends React.Component {
  app = undefined;

  render() {
    return (
      <div>
        <Header />
        {/* <div style={{ textAlign: 'center' }}>
          <h1>Hello World</h1>
        </div>*/}
        <ComponentsGallery />
      </div>
    );
  }
}
