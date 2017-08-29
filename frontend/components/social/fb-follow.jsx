import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { FACEBOOK_APP_ID, FACEBOOK_PAGE } from '../../../config-public.js';
import { toParam } from '../utilities/text-utilities.js';

export default class FBFollowBox extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
  }

  static defaultProps = {
    width: 200,
    height: 200
  }

  state = {
    src: ''
  }

  componentDidMount() {
    const fbFollowDomain = 'https://www.facebook.com/plugins/follow.php';
    const params = {
      href: FACEBOOK_PAGE,
      width: this.props.width,
      height: this.props.height,
      layout: 'standard',
      size: 'large',
      show_faces: 'true',
      appId: FACEBOOK_APP_ID
    };
    const src = `${fbFollowDomain}?${toParam(params)}`;
    this.setState({ src });
  }

  render() {
    const {
      width,
      height
    } = this.props;

    return (
      <iframe src={this.state.src}
        width={width}
        height={height}
        style={{border:'none',overflow:'hidden'}}
        scrolling="no"
        frameBorder="0"
        allowTransparency="true">
      </iframe>
    );
  }

}
