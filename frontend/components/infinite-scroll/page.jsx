import _ from 'lodash';
import React from 'react';

export default class Page extends React.Component {

  sidebar = undefined
  target = undefined
  defaultRegisterInfiniteScrollOpts = {
    infiniteScrollYOffset: 630, // pixels height
    throttledScrollDelay: 400 // ms
  };

  componentDidMount() {
    if (!_.isFunction(this.onBottomScrollReached)) {
      throw new Error('Page should implement the \'onBottomScrollReached()\' method');
    }
    this.sidebar = document.getElementsByClassName('w-left-sidebar').item(0);
    this.target = this.sidebar || window;
    this.target.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    this.target.removeEventListener('scroll', this.handleOnScroll);
  }

  getScrollTop = () => {
    return this.sidebar.scrollTop;
  }

  setScrollTop = (scrollTop) => {
    this.sidebar.scrollTop = scrollTop;
  }

  handleOnScroll = _.throttle(() => {
    // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
    // const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    // const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const scrollTop = this.getScrollTop();
    const scrollHeight = this.sidebar.scrollHeight;

    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const throttledOffset = this.defaultRegisterInfiniteScrollOpts.infiniteScrollYOffset;
    const scrolledToBottom = (Math.ceil(scrollTop + clientHeight) + throttledOffset) >= scrollHeight;

    if (scrolledToBottom) {
      this.onBottomScrollReached();
    }
  }, this.defaultRegisterInfiniteScrollOpts.throttledScrollDelay)

}
