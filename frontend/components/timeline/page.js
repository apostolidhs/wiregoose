import _ from 'lodash';
import { browserHistory } from 'react-router';

export default class Page {

  lastFeeds = undefined
  timelineState = undefined
  lastScrollTop = undefined
  hasMore = true

  virtualScrollList = {};

  prevSectionPos = -1;
  firstSectionPos = -1;
  secondSectionPos = -1;
  activeSections = [];


  componentDidMount(component) {
    if (this.timelineState) {
      // component.timeline.setState(this.timelineState);
      // setTimeout(() => {
      //   component.setScrollTop(this.lastScrollTop);
      // }, 300);
      // component.handleMetaData();
    } else {
      // component.retrieveTimeline();
    }
    this.retrieveNextTimeline(component);
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
      const elements = component.timeline.createElements(feeds);
      this.addElementsOnTimeline(component, elements);
      //component.timeline.addFeeds(feeds);
    }
    component.timeline.setLoadingState(false);
    //this.timelineState = component.timeline.state;

    return resp;
  }

  addElementsOnTimeline(component, elements) {
    if (this.prevSectionPos !== -1) {
      const prevActiveSection = this.removeActiveSection(component, this.prevSectionPos);
      this.addVirtualScrollList(prevActiveSection.elements, this.prevSectionPos);
    }

    const activeSection = {idx: this.firstSectionPos, elements};
    if (this.firstSectionPos > this.secondSectionPos) {
      this.activeSections.push(activeSection);
      component.timeline.appendElements(elements);
    } else if (this.firstSectionPos < this.secondSectionPos) {
      this.activeSections.splice(0, 0, activeSection);
      component.timeline.prependElements(elements);
    } else {
      throw new Error('virtual timeline: second and first section cannot be the same');
    }



    // ///
    // const currentTimelineElements = component.timeline.state.elements;
    // if (!_.isEmpty(currentTimelineElements)) {
    //   this.setPreviousScrollElements(currentTimelineElements);
    // }
    // component.timeline.setCurrentElements(elements);
  }

  retrievePrevTimeline(component) {


    // if (this.currentListPosition === 0) {
    //   return;
    // }
    // this.prevListPosition = this.currentListPosition;
    // --this.currentListPosition;
    // const elements = this.getVirtualScrollListElements(this.currentListPosition);
    // if (!_.isEmpty(elements)) {
    //   this.addElementsOnTimeline(elements);
    // } else {
    //   throw new Error('previous virtual timeline elements should always exist');
    // }
  }

  retrieveNextTimeline(component) {
    this.prevSectionPos = this.secondSectionPos;
    this.secondSectionPos = this.firstSectionPos;
    ++this.firstSectionPos;
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

  removeActiveSection(component, idx) {
    const activeSection = _.find(this.activeSections, activeSection => activeSection.idx === idx);
    if (!activeSection) {
      throw new Error('virtual timeline: trying to remove a section that does not exist');
    }
    component.timeline.removeElements(activeSection.elements);
    _.pull(this.activeSections, activeSection);
    return activeSection;
  }

  isActiveSection(idx) {
    return _.find(this.activeSections, activeSection => activeSection.idx === idx);
  }

  getVirtualScrollListElements(idx) {
    const elements = this.virtualScrollList[idx];
    if (elements) {
      delete this.virtualScrollList.idx;
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
  }
}
