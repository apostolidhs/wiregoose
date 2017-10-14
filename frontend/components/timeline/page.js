import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import componentSize from '../../components/responsible/component-size.js';

export default class Page {
  static TIMELINE_PADDING = 15;
  static ARTICLE_BOX_HEIGHT = 500;
  targetComponent = undefined;
  lastFeeds = undefined;
  hasMore = true;

  virtualList = [];
  articleBoxWidth = 0; // will be filled in runtime
  totalItemsFit = 0;
  isLoading = false;
  columnsPerRow = 0;
  lastScrollTop = 0;

  componentDidMount(component) {
    this.targetComponent = component;

    this.recalculateComponentPositions();
    if (this.lastScrollTop) {
      this.targetComponent.setScrollTop(this.lastScrollTop);
    }

    if (_.isEmpty(this.virtualList)) {
      this.retrieveNextTimeline();
    }

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this.lastScrollTop = this.targetComponent.getScrollTop();
    this.targetComponent = undefined;
    window.removeEventListener('resize', this.onResize);
  }

  refreshVirtualList = () => {
    const scrollContainerHeight = Math.round(
      (this.virtualList.length / this.columnsPerRow)
      * (Page.ARTICLE_BOX_HEIGHT + Page.TIMELINE_PADDING)
    );
    this.targetComponent.timeline.scrollContainerEl.style.height = `${scrollContainerHeight}px`;
  }

  onResize = _.throttle(() => {
    this.recalculateComponentPositions();
    this.onScroll();
  }, 200)

  recalculateComponentPositions = () => {
    this.columnsPerRow = componentSize.sizeFormatter({
      sm: 2,
      md: 3,
      lg: 4,
    }, 1)(window.innerWidth);

    const widthDividend = componentSize.sizeFormatter({
      sm: 0.45,
      md: 0.31,
      lg: 0.24,
    }, 1)(window.innerWidth);

    this.articleBoxWidth = Math.floor(
      this.targetComponent.timeline.scrollContainerEl.offsetWidth
      * widthDividend
    );
    const absoluteItemsFit = Math.round(
      this.targetComponent.getClientHeight()
      / (Page.ARTICLE_BOX_HEIGHT + Page.TIMELINE_PADDING)
    );
    const itemsFit = Math.max(1, absoluteItemsFit);
    this.totalItemsFit = itemsFit * this.columnsPerRow;

    this.refreshVirtualList();
    this.updateVirtualListPositions();
  }

  onScroll = _.throttle(() => {
    const absoluteFrom = Math.round(
      this.targetComponent.getScrollTop()
      / (Page.ARTICLE_BOX_HEIGHT + Page.TIMELINE_PADDING)
    ) * this.columnsPerRow;

    let from = absoluteFrom - this.totalItemsFit;
    from = Math.max(from, 0);

    let to = from + (this.totalItemsFit * 3);
    if (to > this.virtualList.length) {
      this.retrieveNextTimeline();
      to = this.virtualList.length;
    }

    const timelineElements = this.targetComponent.timeline.state.elements;
    const elements = this.virtualList.slice(from, to);

    if (_.first(timelineElements) === _.first(elements)
      && _.last(timelineElements) === _.last(elements)){
      return;
    }

    this.targetComponent.timeline.setState({elements}, () => {
      const hasGoogleAdv = _.find(elements, element => element.key.includes('advertise'));
      if (hasGoogleAdv) {
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    });
  }, 200)

  updateVirtualListPositions = () => {
    _.each(this.virtualList, this.calculateArticleBoxPosition);
  }

  retrieveNextTimeline = () => {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.targetComponent.timeline.setLoadingState(true);
    return this.targetComponent.retrieveTimeline()
      .then(resp => this.timelineRetrievedSuccessfully(resp))
      .finally(() => {
        this.isLoading = false;
        this.targetComponent.timeline.setLoadingState(false);
      })
  }

  timelineRetrievedSuccessfully = (resp) => {
    const { data } = resp.data;
    if (!data) {
      browserHistory.replace('/401');
      return;
    }

    this.targetComponent.handleMetaData();

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
      const feedElements = this.targetComponent.timeline.createElements(feeds);
      _.each(feedElements, feedElement => {
        this.calculateArticleBoxPosition(feedElement, this.virtualList.length);
        this.virtualList.push(feedElement);
      });
      this.refreshVirtualList();
      this.onScroll();
    }
  }

  calculateArticleBoxPosition = (element, idx) => {
    const row = Math.floor(idx / this.columnsPerRow);
    const column = idx % this.columnsPerRow;

    const top = `${(row * (Page.ARTICLE_BOX_HEIGHT + Page.TIMELINE_PADDING))}px`;

    let left = column * this.articleBoxWidth;
    if (column !== 0) {
      left += Page.TIMELINE_PADDING * column;
    }
    left = `${left}px`;

    const width = `${this.articleBoxWidth}px`;

    element.props.style.top = top;
    element.props.style.left = left;
    element.props.style.width = width;
  }

  invalidateCache = () => {
    this.lastFeeds = undefined
    this.hasMore = true
    this.virtualList = []
    this.articleBoxWidth = 0; // will be filled in runtime
    this.totalItemsFit = 0;
    this.isLoading = false
    this.columnsPerRow = 0;
    this.lastScrollTop = 0;
  }

}
