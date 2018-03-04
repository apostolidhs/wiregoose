import isEmpty from 'lodash/isEmpty';
import throttle from 'lodash/throttle';
import first from 'lodash/first';
import last from 'lodash/last';
import find from 'lodash/find';
import filter from 'lodash/filter';
import each from 'lodash/each';
import mapValues from 'lodash/mapValues';
import size from 'lodash/size';

import flow from 'lodash/fp/flow';
import values from 'lodash/fp/values';
import flatten from 'lodash/fp/flatten';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import componentSize from '../../components/responsible/component-size.js';
import {generateFeedsLayout} from './fead-layout-generator.js';

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
  advertiseElements = {};

  constructor({hideCategory = false, hideProvider = false} = {}) {
    this.feedGeneratorOptions = {hideCategory, hideProvider};
  }

  componentDidMount(component) {
    this.targetComponent = component;

    this.recalculateComponentPositions();

    if (isEmpty(this.virtualList)) {
      this.retrieveNextTimeline();
    } else {
      if (this.lastScrollTop) {
        this.targetComponent.setScrollTop(this.lastScrollTop);
      } else {
        this.onScroll();
      }
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
      Math.max(this.virtualList.length / this.columnsPerRow, 1)
      * (Page.ARTICLE_BOX_HEIGHT + Page.TIMELINE_PADDING)
    );
    this.targetComponent.timeline.scrollContainerEl.style.height = `${scrollContainerHeight}px`;
  }

  onResize = throttle(() => {
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

  isGoogleElement = element => {
    return element.key.includes('advertise');
  }

  isFbFollowElement = element => {
    return element.key.includes('facebook-follow');
  }

  onScroll = throttle(() => {
    if (!this.targetComponent) {
      return;
    }
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

    if (first(timelineElements) === first(elements)
      && last(timelineElements) === last(elements)) {
      return;
    }

    this.targetComponent.timeline.setState({elements}, () => {
      const advertiseElements = filter(elements, this.isGoogleElement);
      each(advertiseElements, advertiseElement => {
        if (this.advertiseElements[advertiseElement.key]) {
          //this.advertiseElements[advertiseElement.key].display =
        } else {
          (adsbygoogle = window.adsbygoogle || []).push({});
          this.advertiseElements[advertiseElement.key] = advertiseElement;
        }
      });

      // const fbFollowElements = filter(elements, this.isFbFollowElement);
      // each(fbFollowElements, fbFollowElement => {
      //   if (this.advertiseElements[fbFollowElement.key]) {

      //   } else {
      //     this.advertiseElements[fbFollowElement.key] = fbFollowElement;
      //   }
      // });
    });
  }, 200)

  updateVirtualListPositions = () => {
    each(this.virtualList, this.calculateArticleBoxPosition);
  }

  retrieveNextTimeline = () => {
    if (this.isLoading || !this.hasMore) {
      return;
    }
    this.isLoading = true;
    this.targetComponent.timeline.setLoadingState(true);
    return this.targetComponent.retrieveTimeline()
      .then(resp => this.timelineRetrievedSuccessfully(resp))
      .finally(() => {
        this.isLoading = false;
        this.targetComponent
          && this.targetComponent.timeline.setLoadingState(false);
      })
  }

  timelineRetrievedSuccessfully = (resp) => {
    if (!this.targetComponent) {
      return;
    }

    const { data } = resp.data;
    if (!data) {
      browserHistory.replace('/401');
      return;
    }

    this.targetComponent.handleMetaData();

    this.lastFeeds = mapValues(
      data,
      feeds => (size(feeds) > 0 ? last(feeds).published.getTime() : undefined)
    );

    const feeds = flow(values, flatten)(data);

    if (isEmpty(feeds)) {
      this.hasMore = false;
      if (this.isEmpty()) {
        this.targetComponent.setState({showBlankSlate: true});
      }
    } else {
      const feedElements = generateFeedsLayout(feeds, this.feedGeneratorOptions);
      each(feedElements, feedElement => {
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

  isEmpty = () => {
    return isEmpty(this.virtualList) && !this.hasMore;
  }

  invalidateCache = () => {
    // todo: cleanup google-adv and fb-follow static elements
    this.lastFeeds = undefined
    this.hasMore = true
    this.virtualList = []
    this.articleBoxWidth = 0; // will be filled in runtime
    this.totalItemsFit = 0;
    this.isLoading = false
    this.columnsPerRow = 0;
    this.lastScrollTop = 0;
    this.advertiseElements = {};
  }

}
