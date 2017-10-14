import _ from 'lodash';
import { browserHistory } from 'react-router';

export default class Page {

  lastFeeds = undefined
  timelineState = undefined
  lastScrollTop = 0
  hasMore = true

  topScrollLock = false
  loadingVLIdx = -1
  firstActiveVLIdx = -2
  secondActiveVLIdx = -1
  virtualList = []

  componentDidMount(component) {
    if (this.timelineState) {
      component.timeline.setState(this.timelineState, () => {
        setTimeout(() => {
          component.setScrollTop(this.lastScrollTop);
        }, 0);
      });
      component.handleMetaData();
    } else {
      this.retrieveNextTimeline(component);
    }
  }

  componentWillUnmount(component) {
    this.lastScrollTop = component.getScrollTop();
    this.timelineState = component.timeline.state;
  }

  timelineRetrievedSuccessfully(component, resp, idx) {
    const { data } = resp.data;
    if (!data) {
      browserHistory.replace('/401');
      return;
    }

    const VLLen = this.virtualList.length;
    if (idx !== VLLen) {
      throw new Error(
        `virtual scroll: fetched an unordered index,
        list length: ${VLLen}, current: ${idx}`
      );
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
      return [];
    } else {
      const feedElements = component.timeline.createElements(feeds);
      const blankElements = idx === 0 ? [] : this.createBlankElements(component, VLLen);
      const elements = [...blankElements, ...feedElements];
      this.virtualList.push(elements);

      return elements;
    }
  }

  retrievePrevTimeline(component) {
    if (
      this.bottomScrollLock
      || this.topScrollLock
      || this.firstActiveVLIdx <= 0
    ) {
      return;
    }
    this.topScrollLock = true;
    this.decreaseActiveVLIdxs();
    this.updateActiveElements(component, false)
      .finally(() => {
        this.topScrollLock = false;

      });
  }

  retrieveNextTimeline(component) {
    if (
      this.bottomScrollLock
      || (this.loadingVLIdx !== -1
      && this.loadingVLIdx === this.secondActiveVLIdx)
    ) {
      return;
    }
    this.bottomScrollLock = true;
    this.raiseActiveVLIdxs();
    this.updateActiveElements(component, true)
    .finally(() => {
      this.bottomScrollLock = false;
    });
  }

  raiseActiveVLIdxs() {
    ++this.firstActiveVLIdx;
    ++this.secondActiveVLIdx;
  }

  decreaseActiveVLIdxs() {
    if (this.firstActiveVLIdx <= 0) {
      return;
    }
    --this.firstActiveVLIdx;
    --this.secondActiveVLIdx;
  }

  updateActiveElements(component, flow) {
    const firstActiveVLIdx = this.firstActiveVLIdx;
    const secondActiveVLIdx = this.secondActiveVLIdx;
    const firstActiveElementsPrms = this.getActiveElements(component, firstActiveVLIdx);
    const secondActiveElementsPrms = this.getActiveElements(component, secondActiveVLIdx);

    return Promise.all(
      [
        firstActiveElementsPrms,
        secondActiveElementsPrms
      ]
    ).then(([firstActiveElements, secondActiveElements]) => {
      if (
        this.firstActiveVLIdx !== firstActiveVLIdx
        || this.secondActiveVLIdx !== secondActiveVLIdx
      ) {
        return;
      }

      const secondActiveFeedElements = _.filter(secondActiveElements, el => {
        return !_.startsWith(el.key, 'whitespace');
      });

      const activeElements = [
        ...firstActiveElements,
        ...secondActiveFeedElements
      ];

      return new Promise((resolve) => {
        const prevHeight = component.getScrollHeight();
        if (flow) {
          this.setTimelineElements(component, firstActiveElements, () => {
            setTimeout(() => {
              this.setTimelineElements(component, activeElements, () => {
                resolve();
              });
            }, 0);
          });
        } else {
          this.setTimelineElements(component, activeElements);
          resolve();
          this.setTimelineElements(component, secondActiveFeedElements, () => {
            const prevHeight = component.getScrollHeight();
            setTimeout(() => {
              this.setTimelineElements(component, activeElements, () => {
                const currHeight = component.getScrollHeight();
                const scrollTop = component.getScrollTop();
                component.setScrollTop(scrollTop + (currHeight - prevHeight));
                resolve();
              });
            }, 0);
          });
        }
      });
    });
  }

  getActiveElements(component, idx) {
    if (idx < 0) {
      return Promise.resolve([]);
    }

    const cachedElements = this.virtualList[idx];
    if (cachedElements) {
      return Promise.resolve(cachedElements);
    }

    const VLLen = this.virtualList.length;
    if (idx !== VLLen) {
      throw new Error(
        `virtual scroll: trying to fetch an unordered index,
        list length: ${VLLen}, current: ${idx}`
      );
    }

    this.loadingVLIdx = idx;
    component.timeline.setLoadingState(true);
    this.setTimelineElements(component, this.virtualList[idx - 1] || []);
    return component.retrieveTimeline()
      .then(resp => this.timelineRetrievedSuccessfully(component, resp, idx))
      .finally(() => {
        component.timeline.setLoadingState(false);
        this.loadingVLIdx = -1;
      })
  }

  createBlankElements(component, nextIdx) {
    const currentIdx = nextIdx - 1;
    const totalEls = this.virtualList[currentIdx].length;
    let totalWhiteSpaceElements = 0;
    if (window.innerWidth > 1200) {
      totalWhiteSpaceElements = totalEls % 4;
    }
    return _.map(
      _.times(totalWhiteSpaceElements),
      () => component.timeline.createWhiteSpaceElement()
    );
  }

  setTimelineElements(component, elements, next = _.noop) {
    //const tt = (component.getScrollHeight() - prevScrollPos) + component.getScrollTop();
    //component.setScrollTop(component.getScrollHeight());

    component.timeline.setState({elements}, () => {

      next();
    });
  }

  invalidateCache() {
    this.lastFeeds = undefined;
    this.timelineState = undefined;
    this.lastScrollTop = undefined;
    this.hasMore = true;

    this.topScrollLock = false;
    this.loadingVLIdx = -1;
    this.firstActiveVLIdx = -2;
    this.secondActiveVLIdx = -1;
    this.virtualList = [];
  }
}
