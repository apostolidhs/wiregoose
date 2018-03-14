import React from 'react';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import ContentSelectorWrapper from '../../components/content-selector/content-selector-wrapper.js';
import styles from './user.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Interests extends React.Component {

  render() {
    const props = {
      onCategoryClick: category => {},
      onProviderClick: provider => {},
      onCategoryByProviderClick: registration => {},
      topPosition: 83
    };

    return (
      <div>
        <ContentSelectorWrapper {...props}/>
      </div>
    );
  }

}
