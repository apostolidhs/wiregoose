import React from 'react';
import PropTypes from 'prop-types';

import { publish } from '../../../components/events/events.js';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';;
import Header from '../../../components/timeline/header.jsx';
import ProviderTag from '../../../components/rss-provider/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import * as Auth from '../../../components/authorization/auth.js';
import tr from '../../../components/localization/localization.js';

export default class Provider extends InfiniteScrollPage {
  static page = new TimelinePage();

  componentDidMount() {
    const provider = this.props.routeParams.id;
    if (Provider.page.lastFeeds && Provider.page.lastFeeds[provider] === undefined) {
      Provider.page.invalidateCache();
    }

    Provider.page.componentDidMount(this);
    super.componentDidMount();
  }

  componentWillUnmount() {
    Provider.page.componentWillUnmount(this);
    super.componentWillUnmount();
  }

  retrieveTimeline = () => {
    if (!(this.timeline && !this.timeline.state.isLoading && Provider.page.hasMore)) {
      return;
    }

    this.timeline.setLoadingState(true);
    if (!Provider.page.lastFeeds) {
      const provider = this.props.routeParams.id;
      Provider.page.lastFeeds = { [provider]: _.now() };
    }

    WiregooseApi.timeline.provider(Provider.page.lastFeeds, Auth.getSessionLang(), true)
      .then(resp => Provider.page.timelineRetrievedSuccessfully(this, resp))
      .then(this.handleMetaData);
  }

  handleMetaData = () => {
    const provider = this.props.routeParams.id;
    publish('page-ready', {
      title: provider,
      keywords: provider,
      description: tr.formatString(tr.timelineProviderDescription, provider)
    });
  }

  // called by InfiniteScrollPage
  onBottomScrollReached = () => {
    this.retrieveTimeline();
  }

  render() {
    return (
      <div>
        <Header onClose={() => this.props.router.push('/')}>
          <ProviderTag name={this.props.routeParams.id} />
        </Header>
        <Timeline ref={(ref) => this.timeline = ref} hideProvider={true} />
      </div>
    );
  }
}
