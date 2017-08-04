import _ from 'lodash';
import { browserHistory } from 'react-router';

export default class Page {

  lastFeeds = undefined
  timelineState = undefined
  lastScrollTop = undefined
  hasMore = true

  componentDidMount(component) {
    if (this.timelineState) {
      component.timeline.setState(this.timelineState);
      setTimeout(() => {
        component.setScrollTop(this.lastScrollTop);
      }, 200);
    } else {
      component.retrieveTimeline();
    }
  }

  componentWillUnmount(component) {
    this.lastScrollTop = component.getScrollTop();
  }

  timelineRetrievedSuccessfully(component, resp) {
    const { data } = resp.data;
    if (!data) {
      browserHistory.replace('/401');
      return;
    }
    this.lastFeeds = _.mapValues(
      data,
      feeds => (_.size(feeds) > 0 ? _.last(feeds).published.getTime() : undefined)
    );
    const feeds = _(data)
      .values()
      .flatten()
      .value();

    if (_.isEmpty(feeds)) {
      this.hasMore = false;
    } else {
      component.timeline.addFeeds(feeds);
    }
    component.timeline.setLoadingState(false);
    this.timelineState = component.timeline.state;

    return resp;
  }

  invalidateCache() {
    this.lastFeeds = undefined;
    this.timelineState = undefined;
    this.lastScrollTop = undefined;
  }
}
