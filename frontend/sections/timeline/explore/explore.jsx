import isEmpty from 'lodash/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, Panel, Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import styles from '../timeline.less';
import { publish } from '../../../components/events/events.jsx';
import Header from '../../../components/timeline/header.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import {createResponseHandler, composeCachedResponse}
  from '../../../components/offline-mode/cached-explore-timeline.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Explore extends InfiniteScrollPage {

  static page = new TimelinePage();

  state = {}
  timeline = undefined // ref

  componentDidMount() {
    this.cachedResponseHandler = createResponseHandler();
    Explore.page.componentDidMount(this);
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Explore.page.componentWillUnmount();
    if (this.state.cachedResponsePromise) {
      Explore.page.invalidateCache();
    }
  }

  retrieveTimeline = () => {
    if (this.state.cachedResponsePromise) {
      return Promise.resolve({data: { data: {} }});;
    }

    return WiregooseApi.timeline.explore(
      Explore.page.lastFeeds,
      BrowserLanguageDetection(),
      {
        onOffline: () => {
          if (isEmpty(Explore.page.virtualList)) {
            const cachedResp = composeCachedResponse();
            const cachedResponsePromise = cachedResp && Promise.resolve(cachedResp);
            this.setState({cachedResponsePromise});
            return cachedResponsePromise;
          }
        }
      }
    )
    .then(resp => this.cachedResponseHandler(resp));
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

  renderCachedContentNotification() {
    return (
      <Panel>
        <Row>
          <Col sm={1}>
            <h1 className="text-center w-m-0">
              <FontAwesome name="wifi" className="text-warning" />
            </h1>
          </Col>
          <Col sm={11}>
            <strong>{tr.offlineModeTitle}</strong>
            <p>
              {tr.offlineModeDescription}
              {' '}
              {tr.or}
              {' '}
              <a href="#" onClick={evt => {evt.preventDefault(); location.reload()}}>
                {tr.refresh}
              </a>
            </p>
          </Col>
        </Row>
      </Panel>
    );
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
        {this.state.cachedResponsePromise &&
          this.renderCachedContentNotification()
        }
        <Timeline ref={(ref) => this.timeline = ref} />
      </div>
    );
  }
}
