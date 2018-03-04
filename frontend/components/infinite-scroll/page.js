import isNumber from 'lodash/isNumber';
import throttle from 'lodash/throttle';
import React from 'react';

export default class Page extends React.Component {
  static defaultRegisterInfiniteScrollOpts = {
    infiniteScrollYOffset: 630, // pixels height
    throttledScrollDelay: 200 // ms
  };

  target = undefined

  componentDidMount() {
    this.target = window;
    this.target.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    this.target.removeEventListener('scroll', this.handleOnScroll);
  }

  getScrollTop = () => {
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  }

  getScrollHeight = () => {
    return (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
  }

  getClientHeight = () => {
    return document.documentElement.clientHeight || window.innerHeight;
  }

  setScrollTop = (scrollTop) => {
    const docScrollTop = document.documentElement && document.documentElement.scrollTop;
    if (isNumber(docScrollTop)) {
      document.documentElement.scrollTop = scrollTop;
    } else {
      document.body.scrollTop = scrollTop;
    }
  }

  handleOnScroll = throttle(() => {
    this.onScroll();
  }, Page.defaultRegisterInfiniteScrollOpts.throttledScrollDelay)

  // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
  // const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  // const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

  // checkBottomScroll = () => {
  //   const scrollTop = this.getScrollTop();
  //   const scrollHeight = this.getScrollHeight();

  //   const clientHeight = this.getClientHeight();
  //   const throttledOffset = this.defaultRegisterInfiniteScrollOpts.infiniteScrollYOffset;
  //   const scrolledToBottom = (Math.ceil(scrollTop + clientHeight) + throttledOffset) >= scrollHeight;
  //   //console.log(scrollTop, scrollHeight, clientHeight, scrolledToBottom);
  //   if (scrolledToBottom) {
  //     this.onBottomScrollReached();
  //   }
  // }

  // checkTopScroll = () => {
  //   const scrollTop = this.getScrollTop();

  //   if (scrollTop < this.defaultRegisterInfiniteScrollOpts.infiniteScrollYOffset) {
  //     this.onTopScrollReached();
  //   }
  // }

}
