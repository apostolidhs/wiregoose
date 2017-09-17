import _ from 'lodash';
import React from 'react';

export default class Page extends React.Component {

  sidebar = undefined
  target = undefined
  defaultRegisterInfiniteScrollOpts = {
    infiniteScrollYOffset: 630, // pixels height
    throttledScrollDelay: 300 // ms
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
    if (this.sidebar) {
      return this.sidebar.scrollTop;
    } else {
      return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    }
  }

  getScrollHeight = () => {
    if (this.sidebar) {
      return this.sidebar.scrollHeight;
    } else {
      return (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    }
  }

  setScrollTop = (scrollTop) => {
    if (this.sidebar) {
      this.sidebar.scrollTop = scrollTop;
    } else {
      if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop = scrollTop;
      } else {
        document.body.scrollTop = scrollTop;
      }
    }

  }

  handleOnScroll = _.throttle(() => {
    this.checkBottomScroll();
    this.checkTopScroll();
  }, this.defaultRegisterInfiniteScrollOpts.throttledScrollDelay)

  // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
  // const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  // const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

  checkBottomScroll = () => {
    const scrollTop = this.getScrollTop();
    const scrollHeight = this.getScrollHeight();

    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const throttledOffset = this.defaultRegisterInfiniteScrollOpts.infiniteScrollYOffset;
    const scrolledToBottom = (Math.ceil(scrollTop + clientHeight) + throttledOffset) >= scrollHeight;
    //console.log(scrollTop, scrollHeight, clientHeight, scrolledToBottom);
    if (scrolledToBottom) {
      this.onBottomScrollReached();
    }
  }

  checkTopScroll = () => {
    const scrollTop = this.getScrollTop();

    if (scrollTop < this.defaultRegisterInfiniteScrollOpts.infiniteScrollYOffset) {
      this.onTopScrollReached();
    }
  }

}
