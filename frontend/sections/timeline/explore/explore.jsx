import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

import styles from '../timeline.less';
import { publish } from '../../../components/events/events.js';
import Header from '../../../components/timeline/header.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import * as Auth from '../../../components/authorization/auth.js';
import tr from '../../../components/localization/localization.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Explore extends InfiniteScrollPage {

  static page = new TimelinePage();

  timeline = undefined // ref

  componentDidMount() {
    Explore.page.componentDidMount(this);
    super.componentDidMount();
  }

  componentWillUnmount() {
    Explore.page.componentWillUnmount(this);
  }

  retrieveTimeline = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }

    this.timeline.setLoadingState(true);
    WiregooseApi.timeline.explore(Explore.page.lastFeeds, Auth.getSessionLang(), true)
      .then(resp => Explore.page.timelineRetrievedSuccessfully(this, resp))
      .then(this.handleMetaData);
  }

  handleMetaData = () => {
    publish('page-ready', {
      title: tr.timelineExploreTitle,
      keywords: tr.timelineExploreKeywords,
      description: tr.timelineExploreDescription
      // image:
      // time:
      // lang:
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
              <NavItem eventKey={1}>{tr.explore}</NavItem>
            </LinkContainer>
          </Nav>
        </Header>
        <Timeline ref={(ref) => this.timeline = ref} />
      </div>
    );
  }

}
