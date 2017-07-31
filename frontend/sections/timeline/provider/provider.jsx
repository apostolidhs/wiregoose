import React from 'react';
import PropTypes from 'prop-types';

import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';;
import Header from '../../../components/timeline/header.jsx';
import ProviderTag from '../../../components/rss-provider/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

export default class Provider extends InfiniteScrollPage {
  static lastFeeds = undefined
  static timelineState = undefined
  static lastScrollTop = undefined

  state = {
    notFound: false
  }

  componentDidMount() {
    this.retrieveTimeline();
    super.componentDidMount();
  }

  componentWillUnmount() {
    Provider.lastScrollTop = this.getScrollTop();
    super.componentWillUnmount();
  }

  retrieveTimeline = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }

    this.timeline.setLoadingState(true);
    if (!Provider.lastFeeds) {
      const provider = this.props.routeParams.id;
      Provider.lastFeeds = { [provider]: _.now() };
    }

    WiregooseApi.timeline.provider(Provider.lastFeeds, true)
      .then(resp => {
        const data = resp.data.data;
        if (!data) {
          this.setState({ notFound: true });
          return;
        }
        Provider.lastFeeds = _.mapValues(
          data,
          feeds => (_.size(feeds) > 0 ? _.last(feeds).published.getTime() : undefined)
        );
        this.timeline.setLoadingState(false);
        const feeds = _(data)
          .values()
          .flatten()
          .value();
        this.timeline.addFeeds(feeds);
        Provider.timelineState = this.timeline.state;
      });
  }

  // called by InfiniteScrollPage
  onBottomScrollReached = () => {
    this.retrieveTimeline();
  }

  render() {
    const { notFound } = this.state;

    if (notFound) {
      return this.renderNotFound();
    } else {
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

  renderNotFound() {
    return (
      <span>Not Found</span>
    );
  }
}
