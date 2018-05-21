import React from 'react';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import {
  pushInterest,
  removeInterest,
  getInterest
} from '../../components/user/interests.js';
import ContentSelectorWrapper from '../../components/content-selector/content-selector-wrapper.js';
import styles from './user.less';
import BrowserLanguageDetection from '../../components/utilities/browser-language-detection.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Interests extends React.Component {

  render() {
    const lang = BrowserLanguageDetection();

    const props = {
      topPosition: 83,
      enableInterests: true
    };

    return (
      <div styleName="interests-page">
        <ContentSelectorWrapper {...props}/>
      </div>
    );
  }

}
