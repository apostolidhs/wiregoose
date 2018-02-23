import isEmpty from 'lodash/isEmpty';
import now from 'lodash/now';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import { publish } from '../../../components/events/events.jsx';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';;
import Header from '../../../components/timeline/header.jsx';
import getRegistrationFromLink from '../../../components/rss-registration/link-utilities.js';
import RegistrationTag from '../../../components/rss-registration/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';
import Offline from '../../../components/offline-mode/offline.jsx';
import withReload from '../../../components/utilities/reload-hoc.jsx';

class Registration extends InfiniteScrollPage {

  static page = new TimelinePage({hideProvider: true, hideCategory: true});

  state = {
    registration: undefined
  }

  componentDidMount() {
    const registration = getRegistrationFromLink(this.props.routeParams.id);
    if (!registration) {
      browserHistory.replace('/401');
      return;
    }

    if (Registration.page.lastFeeds && Registration.page.lastFeeds[registration._id] === undefined) {
      Registration.page.invalidateCache();
    }

    this.setState({registration}, () => {
      Registration.page.componentDidMount(this);
      super.componentDidMount();
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Registration.page.componentWillUnmount();
  }

  retrieveTimeline = () => {
    if (!Registration.page.lastFeeds) {
      Registration.page.lastFeeds = { [this.state.registration._id]: now() };
    }
    return WiregooseApi.timeline.registration(
      Registration.page.lastFeeds,
      BrowserLanguageDetection(),
      {
        onOffline: () => {
          if (isEmpty(Registration.page.virtualList)) {
            this.setState({isOffline: true});
          }
        }
      }
    );
  }

  handleMetaData = () => {
    const { category, provider } = this.state.registration;
    const title = `${provider} ${category}`;
    const keywords = `${provider},${category}`;
    publish('page-ready', {
      title,
      keywords,
      description: tr.formatString(tr.timelineRegistrationDescription, title).join('')
    });
  }

  onScroll = () => {
    Registration.page.onScroll(this);
  }

  render() {
    return (
      <div>
        <Header onClose={() => this.props.router.push('/')}>
          { this.state.registration &&
            <RegistrationTag registration={this.state.registration} />
          }
        </Header>
        {this.state.isOffline &&
          <Offline />
        }
        <Timeline ref={(ref) => this.timeline = ref} />
      </div>
    );
  }

}

export default withReload(Registration);
