import React from 'react';
import PropTypes from 'prop-types';

import { publish } from '../../../components/events/events.jsx';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';;
import Header from '../../../components/timeline/header.jsx';
import ProviderTag from '../../../components/rss-provider/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';
import Offline from '../../../components/offline-mode/offline.jsx';

export default class Provider extends InfiniteScrollPage {
  static page = new TimelinePage();

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
      Provider.page.lastFeeds = { [provider]: _.now() };
    }
    return WiregooseApi.timeline.provider(
      Provider.page.lastFeeds,
      BrowserLanguageDetection(),
      {
        onOffline: () => {
          if (_.isEmpty(Provider.page.virtualList)) {
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
        <Timeline ref={(ref) => this.timeline = ref} hideProvider={true} />
      </div>
    );
  }
}
