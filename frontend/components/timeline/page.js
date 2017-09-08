import _ from 'lodash';
import { browserHistory } from 'react-router';

export default class Page {

  lastFeeds = undefined
  timelineState = undefined
  lastScrollTop = 0
  hasMore = true

  virtualScrollList = {};

  prevSectionPos = -1;
  firstSectionPos = -1;
  secondSectionPos = -1;
  currentScrollFlow = true; // true = down, false = up
  activeSections = [];


  componentDidMount(component) {
    if (this.timelineState) {
      component.timeline.setState(this.timelineState, () => {
        component.setScrollTop(this.lastScrollTop);
      });
      // setTimeout(() => {
      //   component.setScrollTop(this.lastScrollTop);
      // }, 300);
      component.handleMetaData();
    } else {
      this.retrieveNextTimeline(component);
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

    let addElementPrms;
    if (_.isEmpty(feeds)) {
      this.hasMore = false;
      addElementPrms = Promise.resolve();
    } else {
      const elements = component.timeline.createElements(feeds);
      addElementPrms = this.addElementsOnTimeline(component, elements);
    }

    addElementPrms.then(() => {
      component.timeline.setLoadingState(false);
      this.timelineState = component.timeline.state;
    });

    return resp;
  }

  addElementsOnTimeline(component, elements) {
    return new Promise((resolve) => {
      if (this.prevSectionPos !== -1) {
        const prevActiveSection = this.removeActiveSection(component, this.prevSectionPos);
        this.addVirtualScrollList(prevActiveSection.elements, this.prevSectionPos);
      }

      if (this.firstSectionPos === this.secondSectionPos) {
        throw new Error('virtual timeline: second and first section cannot be the same');
      }

      if (this.currentScrollFlow) {
        setTimeout(() => {
          this.addActiveSection(component, elements);
          resolve();
        }, 0);
      } else {
        this.addActiveSection(component, elements);
        resolve();
      }

    });
  }

  isRetrievePrevTimelineLoading = false;
  retrievePrevTimeline(component) {
    if (this.firstSectionPos === -1 || this.firstSectionPos === 0 || this.secondSectionPos === 0) {
      return;
    }

    console.log('retrievePrevTimeline');

    if (this.firstSectionPos > this.secondSectionPos) {
      this.prevSectionPos = this.firstSectionPos;
      this.firstSectionPos = this.secondSectionPos - 1;
    } else {
      this.prevSectionPos = this.secondSectionPos;
      this.secondSectionPos = this.firstSectionPos;
      --this.firstSectionPos;
    }
    this.currentScrollFlow = false;

    const elements = this.getVirtualScrollListElements(this.firstSectionPos);
    if (!_.isEmpty(elements)) {
      this.addElementsOnTimeline(component, elements)
        .then(() => component.checkTopScroll());
    } else {
      throw new Error('previous virtual timeline elements should always exist');
    }
  }

  retrieveNextTimeline(component) {
    console.log('retrieveNextTimeline');
    if (this.firstSectionPos > this.secondSectionPos) {
      this.prevSectionPos = this.secondSectionPos;
      this.secondSectionPos = this.firstSectionPos;
      ++this.firstSectionPos;
    } else {
      this.prevSectionPos = this.firstSectionPos;
      this.firstSectionPos = this.secondSectionPos + 1;
    }
    this.currentScrollFlow = true;

    if (this.secondSectionPos !== -1 && !this.isActiveSection(this.secondSectionPos)) {
      throw new Error('virtual timeline: second element should always exist');
    }

    const elements = this.getVirtualScrollListElements(this.firstSectionPos);
    if (!_.isEmpty(elements)) {
      this.addElementsOnTimeline(component, elements);
    } else {
      component.retrieveTimeline();
    }
  }

  addActiveSection = (component, elements) => {
    const activeSection = {idx: this.firstSectionPos, elements};
    if (this.currentScrollFlow) {
      this.activeSections.push(activeSection);
      component.timeline.appendElements(elements);
    } else {
      const prevScrollPos = component.getScrollHeight();
      this.activeSections.splice(0, 0, activeSection);
      component.timeline.prependElements(elements);
      const tt = (component.getScrollHeight() - prevScrollPos) + component.getScrollTop();
      component.setScrollTop(tt);
    }
  }

  removeActiveSection(component, idx) {
    const activeSection = _.find(this.activeSections, activeSection => activeSection.idx === idx);
    if (!activeSection) {
      throw new Error('virtual timeline: trying to remove a section that does not exist');
    }
    if (this.currentScrollFlow && activeSection !== this.activeSections[0]) {
      throw new Error('virtual timeline: positive flow should delete the first section');
    } else if (!this.currentScrollFlow && activeSection !== this.activeSections[1]) {
      throw new Error('virtual timeline: positive flow should delete the second section');
    }

    const whiteSpaceElements = component.timeline.removeElements(activeSection.elements, this.currentScrollFlow);

    if (this.currentScrollFlow) {
      this.activeSections[1].elements = whiteSpaceElements.concat(this.activeSections[1].elements);
    } else {
      this.activeSections[0].elements = _.filter(this.activeSections[0].elements, el => {
        return !_.startsWith(el.key, 'whitespace');
      });
    }

    _.pull(this.activeSections, activeSection);

    return activeSection;
  }

  isActiveSection(idx) {
    return _.find(this.activeSections, activeSection => activeSection.idx === idx);
  }

  getVirtualScrollListElements(idx) {
    const elements = this.virtualScrollList[idx];
    if (elements) {
      delete this.virtualScrollList[idx];
      return elements;
    }
  }

  addVirtualScrollList(elements, position) {
    if (this.virtualScrollList[position]) {
      throw new Error('virtual timeline: cannot add an elements that already exist');
    }
    this.virtualScrollList[position] = elements;
  }

  setPreviousScrollElements(elements) {
    this.virtualScrollList[this.prevListPosition] = elements;
  }

  invalidateCache() {
    this.lastFeeds = undefined;
    this.timelineState = undefined;
    this.lastScrollTop = undefined;
    this.hasMore = true;
    this.virtualScrollList = {};
    this.prevSectionPos = -1;
    this.firstSectionPos = -1;
    this.secondSectionPos = -1;
    this.currentScrollFlow = true; // true = down, false = up
    this.activeSections = [];
  }
}
