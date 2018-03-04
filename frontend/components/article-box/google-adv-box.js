import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './article-box.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class GoogleAdvBox extends React.Component {

  static advertises = {};

  static propTypes = {
    advKey: PropTypes.string
  }

  componentDidMount() {
    const {advKey} = this.props;
    const advertise = GoogleAdvBox.advertises[advKey];
    if (advertise) {
      this.advertiseEl.appendChild(advertise); // meybe add it to the body
    } else {

    }
  }

  componentWillUnmount() {
    const {advKey} = this.props;
    const advertise = GoogleAdvBox.advertises[advKey];
    if (advertise) {

    } else {
      GoogleAdvBox.advertises[advKey] = this.advertiseEl;
    }
  }

  renderAdvertise() {
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

  render() {
    const {advKey} = this.props;
    const advertise = GoogleAdvBox.advertises[advKey];
    return (
      <div ref={el => this.advertiseEl = el} >
        {!advertise &&
          this.renderAdvertise()
        }
      </div>
    );
  }
}
