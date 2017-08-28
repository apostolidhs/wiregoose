import React from 'react';
import PropTypes from 'prop-types';
import { FBFollow } from 'facebook-plugins';
import CSSModules from 'react-css-modules';
import FontAwesome from 'react-fontawesome';

import styles from './article-box.less';
import tr from '../localization/localization.js';
import { FACEBOOK_APP_ID, FACEBOOK_PAGE } from '../../../config-public.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class FBFollowBox extends React.Component {

  render() {
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
            <FBFollow
              height={300}
              width={200}
              appId={FACEBOOK_APP_ID}
              href={FACEBOOK_PAGE}
            />
          </div>
        </div>
      </article>
    );
  }
}
