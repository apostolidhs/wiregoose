import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from '../timeline.less';
import Header from '../../../components/timeline/header.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Explore extends InfiniteScrollPage {

  timeline: undefined
  lastFeeds: undefined

  componentDidMount() {
    this.retrieveTimeline();
    super.componentDidMount();
  }

  retrieveTimeline = () => {
    if (this.timeline.state.isLoading) {
      return;
    }

    this.timeline.setLoadingState(true);
    const payload = _.mapValues(this.lastFeeds, feed => feed.published.getTime());
    WiregooseApi.timeline.explore(payload)
      .then(resp => {
        this.lastFeeds = resp.data.data;
        this.timeline.setLoadingState(false);
        this.timeline.addFeeds(_.values(this.lastFeeds));
      });
  }

  // called by InfiniteScrollPage
  onBottomScrollReached = () => {
    this.retrieveTimeline();
  }

  render() {
    return (
      <div>
        <Header>
          <span>Explore</span>
        </Header>
        <Timeline ref={(ref) => this.timeline = ref} />
      </div>
    );
  }

}
