import _ from 'lodash';
import React from 'react';

export default class Page extends React.Component {

  defaultRegisterInfiniteScrollOpts = {
    infiniteScrollYOffset: 400, // pixels height
    throttledScrollDelay: 500 // ms
  };

  componentDidMount() {
    if (!_.isFunction(this.onBottomScrollReached)) {
      throw new Error('Page should implement the \'onBottomScrollReached()\' method');
    }
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll = _.throttle(() => {
    // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const throttledOffset = this.defaultRegisterInfiniteScrollOpts.infiniteScrollYOffset;
    const scrolledToBottom = (Math.ceil(scrollTop + clientHeight) + throttledOffset) >= scrollHeight;

    if (scrolledToBottom) {
      this.onBottomScrollReached();
    }
  }, this.defaultRegisterInfiniteScrollOpts.throttledScrollDelay)

}
