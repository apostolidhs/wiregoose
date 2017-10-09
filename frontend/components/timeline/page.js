import _ from 'lodash';
import { browserHistory } from 'react-router';

export default class Page {
  lastFeeds = undefined
  hasMore = true

  virtualList = []
  articleBoxHeight = 500;
  articleBoxWidth = 0; // will be filled in runtime
  totalItemsFit
  isLoading = false

  componentDidMount(component) {
    setTimeout(() => {
      this.articleBoxWidth = component.target.innerWidth * 0.24;
    });
    this.retrieveNextTimeline(component);
  }

  componentWillUnmount(component) {

  }

  refreshVirtualList = (component) => {
    const scrollContainerHeight = Math.round((this.virtualList.length / 4) * (this.articleBoxHeight + 15));
    component.timeline.scrollContainerEl.style.height = scrollContainerHeight;

    this.totalItemsFit = Math.round(component.getClientHeight() / (this.articleBoxHeight + 15)) * 4;

    this.onScroll(component);
  }

  onScroll = (component) => {
    let from = (Math.round(component.getScrollTop() / (this.articleBoxHeight + 15)) * 4) - this.totalItemsFit;
    from = Math.max(from, 0);
    let to = from + (this.totalItemsFit * 3);
    to = Math.min(to, this.virtualList.length);
    const elements = this.virtualList.slice(from, to);
    component.timeline.setState({elements}, () => {});
  }

  retrieveNextTimeline = (component) => {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    return component.retrieveTimeline()
      .then(resp => this.timelineRetrievedSuccessfully(component, resp))
      .finally(() => {
        this.isLoading = false;
      })
  }

  timelineRetrievedSuccessfully(component, resp) {
    const { data } = resp.data;
    if (!data) {
      browserHistory.replace('/401');
      return;
    }

    component.handleMetaData();

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
      const feedElements = component.timeline.createElements(feeds);
      this.virtualList.push(...feedElements);

      this.refreshVirtualList(component);
    }
  }


}
