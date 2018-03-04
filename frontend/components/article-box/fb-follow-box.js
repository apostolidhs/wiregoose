import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import FontAwesome from 'react-fontawesome';

import styles from './article-box.less';
import tr from '../localization/localization.js';
import { FACEBOOK_APP_ID, FACEBOOK_PAGE } from '../../../config-public.js';
import FBFollow from '../social/fb-follow.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class FBFollowBox extends React.Component {

  static boxies = {};

  static propTypes = {
    boxKey: PropTypes.string
  }

  componentDidMount() {
    const {boxKey} = this.props;
    const advertise = FBFollowBox.boxies[boxKey];
    if (advertise) {
      this.boxEl.appendChild(advertise);
    } else {

    }
  }

  componentWillUnmount() {
    const {boxKey} = this.props;
    const advertise = FBFollowBox.boxies[boxKey];
    if (advertise) {

    } else {
      FBFollowBox.boxies[boxKey] = this.boxEl;
    }
  }

  renderBox() {
    return (
      <article styleName="article article-full fb-follow" className="panel panel-default text-center">
        <div className="panel-body">
          <div styleName="fb-follow-header">
            <FontAwesome name="facebook" />
          </div>
          <header styleName="header">
            <h3>
              {tr.articleFbTitle}
            </h3>
            <h3 styleName="sub-header">
              <small>
                {tr.articleFbSubHeader}
              </small>
            </h3>
          </header>
          <div styleName="follow-plugin">
            <FBFollow width={200} />
          </div>
        </div>
      </article>
    );
  }

  render() {
    const {boxKey} = this.props;
    const box = FBFollowBox.boxies[boxKey];

    return (
      <div ref={el => this.boxEl = el} >
        {!box &&
          this.renderBox()
        }
      </div>
    );
  }
}
