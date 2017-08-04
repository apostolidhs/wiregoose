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
import * as Auth from '../../../components/authorization/auth.js';

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
    });
    super.componentDidMount();
  }

  componentWillUnmount() {
    Registration.page.componentWillUnmount(this);
    super.componentWillUnmount();
  }

  retrieveTimeline = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }

    this.timeline.setLoadingState(true);
    if (!Registration.page.lastFeeds) {
      const registration = this.state.registration._id;
      Registration.page.lastFeeds = { [registration]: _.now() };
    }

    WiregooseApi.timeline.registration(Registration.page.lastFeeds, Auth.getSessionLang(), true)
      .then(resp => Registration.page.timelineRetrievedSuccessfully(this, resp))
      .then(resp => resp && this.handleMetaData(resp));
  }

  handleMetaData = (resp) => {
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
    this.retrieveTimeline();
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
