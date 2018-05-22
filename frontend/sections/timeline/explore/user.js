import isEmpty from 'lodash/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import styles from '../timeline.less';
import { subscribe, unsubscribe, publish } from '../../../components/events/events.js';
import Timeline from '../../../components/timeline/timeline.js';
import TimelinePage from '../../../components/timeline/page.js';
import ExploreHeader from './header';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';
import {getSession} from '../../../components/authorization/auth.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class User extends InfiniteScrollPage {

  static page = new TimelinePage();

  state = {}
  currentPage = 1;
  timeline = undefined // ref

  componentDidMount() {
    User.page.componentDidMount(this);
    super.componentDidMount();
    // this.restartSubscription = subscribe(
    //   'credentials',
    //   () => document.location.reload()
    // );
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    User.page.componentWillUnmount();
    //this.restartSubscription();
  }

  retrieveTimeline = () => {
    const userId = getSession().user._id;
    return WiregooseApi.timeline.user(
      userId,
      this.currentPage
    )
    .then(resp => {
      resp.data.data = {
        [this.currentPage + '']: resp.data.data
      };
      ++this.currentPage;
      return resp;
    })
  }

  handleMetaData = () => {
    publish('page-ready', {
      // title: tr.timelineUserTitle,
      // keywords: tr.timelineUserKeywords,
      // description: tr.timelineUserDescription
      // image:
      // time:
      // lang:
    });
  }

  onScroll = () => {
    User.page.onScroll(this);
  }

  render() {
    return (
      <div>
        <ExploreHeader>
          <Timeline ref={(ref) => this.timeline = ref} />
        </ExploreHeader>
      </div>
    );
  }
}
