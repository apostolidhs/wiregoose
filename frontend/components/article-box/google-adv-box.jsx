import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './article-box.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class GoogleAdvBox extends React.Component {

  render() {
    return (
      <article styleName="article article-full" className="panel panel-default text-center">
        <ins className="adsbygoogle"
          style={{display:'block'}}
          data-ad-format="fluid"
          data-ad-layout-key="-7t-9-id+da+1er"
          data-ad-client="ca-pub-3571483150053473"
          data-ad-slot="9143901045">
        </ins>
      </article>
    );
  }
}
