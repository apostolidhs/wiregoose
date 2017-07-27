import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

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
    WiregooseApi.timeline.explore(this.lastFeeds)
      .then(resp => {
        const { data } = resp.data;
        this.lastFeeds = _.mapValues(
          data,
          feeds => (_.size(feeds) > 0 ? _.last(feeds).published.getTime() : undefined)
        );
        this.timeline.setLoadingState(false);
        const feeds = _(data)
          .values()
          .flatten()
          .value();
        this.timeline.addFeeds(feeds);
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
          <Nav bsStyle="pills" activeKey={1}>
            <LinkContainer to="/">
              <NavItem eventKey={1}>Explore</NavItem>
            </LinkContainer>
          </Nav>
        </Header>
        <Timeline ref={(ref) => this.timeline = ref} />
      </div>
    );
  }

}
