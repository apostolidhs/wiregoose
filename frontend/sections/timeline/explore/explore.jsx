import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

import styles from '../timeline.less';
import { publish } from '../../../components/events/events.jsx';
import Header from '../../../components/timeline/header.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
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
    super.componentWillUnmount();
    Explore.page.componentWillUnmount();
  }

  retrieveTimeline = () => {
    return WiregooseApi.timeline.explore(
      Explore.page.lastFeeds,
      BrowserLanguageDetection(),
      true
    );
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

  onScroll = () => {
    Explore.page.onScroll(this);
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
