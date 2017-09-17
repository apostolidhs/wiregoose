import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import { publish } from '../../../components/events/events.js';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';;
import Header from '../../../components/timeline/header.jsx';
import getRegistrationFromLink from '../../../components/rss-registration/link-utilities.js';
import RegistrationTag from '../../../components/rss-registration/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';

export default class Registration extends InfiniteScrollPage {

  static page = new TimelinePage();

  state = {
    registration: undefined
  }

  componentDidMount() {
    const link = this.props.routeParams.id;
    const registration = getRegistrationFromLink(link);
    if (!registration) {
      browserHistory.replace('/401');
      return;
    }
    this.setState({ registration }, () => {
      Registration.page.componentDidMount(this);
      super.componentDidMount();
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Registration.page.componentWillUnmount(this);
  }

  retrieveTimeline = () => {
    if (!Registration.page.lastFeeds) {
      const registration = this.state.registration._id;
      Registration.page.lastFeeds = { [registration]: _.now() };
    }
    return WiregooseApi.timeline.registration(
      Registration.page.lastFeeds,
      BrowserLanguageDetection(),
      true
    );
  }

  handleMetaData = () => {
    const { category, provider } = this.state.registration;
    const title = `${provider} ${category}`;
    const keywords = `${provider},${category}`;
    publish('page-ready', {
      title,
      keywords,
      description: tr.formatString(tr.timelineRegistrationDescription, title)
    });
  }

  // called by InfiniteScrollPage
  onBottomScrollReached = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }
    Registration.page.retrieveNextTimeline(this);
  }

  // called by InfiniteScrollPage
  onTopScrollReached = () => {
    Registration.page.retrievePrevTimeline(this);
  }

  render() {
    const { registration } = this.state;
    return (
      <div>
        <Header onClose={() => this.props.router.push('/')}>
          { registration &&
            <RegistrationTag registration={registration} />
          }
        </Header>
        <Timeline ref={(ref) => this.timeline = ref} hideProvider={true} hideCategory={true} />
      </div>
    );
  }

}
