import React from 'react';
import PropTypes from 'prop-types';

import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';;
import Header from '../../../components/timeline/header.jsx';
import ProviderTag from '../../../components/rss-provider/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

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
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }

    this.timeline.setLoadingState(true);
    if (!Provider.page.lastFeeds) {
      const provider = this.props.routeParams.id;
      Provider.page.lastFeeds = { [provider]: _.now() };
    }

    WiregooseApi.timeline.provider(Provider.page.lastFeeds, true)
      .then(resp => Provider.page.timelineRetrievedSuccessfully(this, resp));
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
