import React from 'react';
import PropTypes from 'prop-types';

import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';;
import Header from '../../../components/timeline/header.jsx';
import getRegistrationFromLink from '../../../components/rss-registration/link-utilities.js';
import RegistrationTag from '../../../components/rss-registration/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

export default class Registration extends InfiniteScrollPage {

  static lastFeeds = undefined
  static timelineState = undefined
  static lastScrollTop = undefined

  state = {
    registration: undefined,
    notFound: false
  }

  componentDidMount() {
    super.componentDidMount();
    const link = this.props.routeParams.id;
    const registration = getRegistrationFromLink(link);
    if (!registration) {
      this.setState({ notFound: true });
      return;
    }
    this.setState({ registration }, this.retrieveTimeline);
  }

  componentWillUnmount() {
    Registration.lastScrollTop = this.getScrollTop();
    super.componentWillUnmount();
  }

  retrieveTimeline = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }

    this.timeline.setLoadingState(true);
    if (!Registration.lastFeeds) {
      const registration = this.state.registration._id;
      Registration.lastFeeds = { [registration]: _.now() };
    }

    WiregooseApi.timeline.registration(Registration.lastFeeds)
      .then(resp => {
        const data = resp.data.data;
        if (!data) {
          this.setState({ notFound: true });
          return;
        }
        Registration.lastFeeds = _.mapValues(
          data,
          feeds => (_.size(feeds) > 0 ? _.last(feeds).published.getTime() : undefined)
        );
        this.timeline.setLoadingState(false);
        const feeds = _(data)
          .values()
          .flatten()
          .value();
        this.timeline.addFeeds(feeds);
        Registration.timelineState = this.timeline.state;
      });
  }

  // called by InfiniteScrollPage
  onBottomScrollReached = () => {
    this.retrieveTimeline();
  }

  render() {
    const { notFound, registration } = this.state;

    if (notFound) {
      return this.renderNotFound();
    } else {
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

  renderNotFound() {
    return (
      <span>Not Found</span>
    );
  }

}
