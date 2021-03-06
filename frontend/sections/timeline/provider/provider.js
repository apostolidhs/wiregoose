import isEmpty from 'lodash/isEmpty';
import now from 'lodash/now';
import React from 'react';
import PropTypes from 'prop-types';

import { publish } from '../../../components/events/events.js';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.js';;
import Header from '../../../components/timeline/header.js';
import ProviderTag from '../../../components/rss-provider/tag.js';
import Timeline from '../../../components/timeline/timeline.js';
import TimelinePage from '../../../components/timeline/page.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';
import Offline from '../../../components/offline-mode/offline.js';
import withReload from '../../../components/utilities/reload-hoc.js';

class Provider extends InfiniteScrollPage {
  static page = new TimelinePage({hideProvider: true});

  state = {}

  componentDidMount() {
    const provider = this.props.routeParams.id;
    if (Provider.page.lastFeeds && Provider.page.lastFeeds[provider] === undefined) {
      Provider.page.invalidateCache();
    }

    Provider.page.componentDidMount(this);
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Provider.page.componentWillUnmount();
  }

  retrieveTimeline = () => {
    if (!Provider.page.lastFeeds) {
      const provider = this.props.routeParams.id;
      Provider.page.lastFeeds = { [provider]: now() };
    }
    return WiregooseApi.timeline.provider(
      Provider.page.lastFeeds,
      BrowserLanguageDetection(),
      {
        onOffline: () => {
          if (isEmpty(Provider.page.virtualList)) {
            this.setState({isOffline: true});
          }
        }
      }
    );
  }

  handleMetaData = () => {
    const provider = this.props.routeParams.id;
    publish('page-ready', {
      title: provider,
      keywords: provider,
      description: tr.formatString(tr.timelineProviderDescription, provider).join('')
    });
  }

  onScroll = () => {
    Provider.page.onScroll(this);
  }

  render() {
    return (
      <div>
        <Header onClose={() => this.props.router.push('/')}>
          <ProviderTag name={this.props.routeParams.id} />
        </Header>
        {this.state.isOffline &&
          <Offline />
        }
        <Timeline ref={(ref) => this.timeline = ref} />
      </div>
    );
  }
}

export default withReload(Provider);
