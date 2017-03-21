import React from 'react';
import { Route } from 'react-router';

import '../../less/index.less';
import Header from '../header/Header.jsx';
import ComponentsGallery
  from '../../sections/components-gallery/ComponentsGallery.jsx';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <Route path="/componentsGallery" component={ComponentsGallery} />
          <Route path="*" component={ComponentsGallery} />
        </div>
      </div>
    );
  }
}
