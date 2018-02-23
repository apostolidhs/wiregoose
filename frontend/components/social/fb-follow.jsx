import React from 'react';
import PropTypes from 'prop-types';

import { FACEBOOK_APP_ID, FACEBOOK_PAGE } from '../../../config-public.js';
import { toParam } from '../utilities/text-utilities.js';
import * as Facebook from '../services/facebook.js';

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

  componentDidMount() {Facebook.isReady();
    // const fbFollowDomain = 'https://www.facebook.com/plugins/follow.php';
    // const params = {
    //   href: FACEBOOK_PAGE,
    //   width: this.props.width,
    //   height: this.props.height,
    //   layout: 'standard',
    //   size: 'large',
    //   show_faces: 'true',
    //   appId: FACEBOOK_APP_ID
    // };
    // const src = `${fbFollowDomain}?${toParam(params)}`;
    // this.setState({ src });
  }

  render() {
    const {
      width,
      height
    } = this.props;
//https://www.facebook.com/v2.12/plugins/like.php?app_id=113869198637480&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2FlY4eZXm_YWu.js%3Fversion%3D42%23cb%3Df2490e622e6b6bc%26domain%3Ddevelopers.facebook.com%26origin%3Dhttps%253A%252F%252Fdevelopers.facebook.com%252Ff7cafc57fa021%26relation%3Dparent.parent&container_width=678&href=https%3A%2F%2Fwww.facebook.com%2Fwiregoose&locale=en_US&sdk=joey&share=true&show_faces=true
    return (
      <div className="fb-like"
        data-href={FACEBOOK_PAGE}
        data-width="200"
        data-layout="standard"
        data-action="like"
        data-size="large"
        data-show-faces="true"
        data-share="false">
      </div>
    );

    // return (
    //   <iframe src={this.state.src}
    //     width={width}
    //     height={height}
    //     style={{border:'none',overflow:'hidden'}}
    //     scrolling="no"
    //     frameBorder="0"
    //     allowTransparency="true">
    //   </iframe>
    // );
  }

}
