import React from 'react';
import PropTypes from 'prop-types';

import { FACEBOOK_PAGE } from '../../../config-public.js';
import * as Facebook from '../services/facebook.js';

export default class FBFollowBox extends React.Component {

  static propTypes = {
    width: PropTypes.number
  }

  static defaultProps = {
    width: 200
  }

  componentDidMount() {
    Facebook.initialize();
  }

  render() {
    const {width} = this.props;

    return (
      <div className="fb-like"
        data-href={FACEBOOK_PAGE}
        data-width={width + ''}
        data-layout="standard"
        data-action="like"
        data-size="large"
        data-show-faces="true"
        data-share="false">
      </div>
    );
  }

}
