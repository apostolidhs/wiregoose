import throttle from 'lodash/throttle';
import findLast from 'lodash/findLast';
import each from 'lodash/each';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import ContentSelector from './content-selector.js';
import styles from './content-selector.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ContentSelectorWrapper extends React.Component {

  static propTypes = {
    inModal: PropTypes.bool,
    topPosition: PropTypes.number
  }

  state = {headTitle: ''}

  componentDidMount() {
    this.scrollTarget = this.props.inModal ? this.wrapperEl : window;
    this.headEls = Array.from(this.wrapperEl.querySelectorAll('h3[data-sticky-head]'));
    this.scrollTarget.addEventListener('scroll', this.handleOnScroll, true);
    this.handleOnScroll();
    this.outModalHeaderStyle = {top: `${this.props.topPosition}px`};
  }

  componentWillUnmount() {
    this.scrollTarget.removeEventListener('scroll', this.handleOnScroll, true);
    this.handleOnScroll.cancel();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.headTitle !== nextState.headTitle;
  }

  handleOnScroll = throttle(evt => {
    evt && evt.stopPropagation();
    const scrollTop = (this.scrollTarget.scrollTop || this.scrollTarget.scrollY) + 60;
    const stickyHeadEl = findLast(this.headEls, headEl => headEl.offsetTop < scrollTop) || this.headEls[0];
    const headTitle = stickyHeadEl.getAttribute('data-sticky-head');
    if (this.state.headTitle !== headTitle) {
      each(this.headEls, headEl => headEl.style.visibility = 'initial');
      this.headEls[0].style.display = 'none';
      stickyHeadEl.style.visibility = 'hidden';
      this.setState({headTitle});
    }
  }, 250)

  renderHeader() {
    const {headTitle} = this.state;
    return (
      <header styleName="header" >
        <h3>{headTitle}</h3>
      </header>
    );
  }

  render() {
    const {topPosition, inModal} = this.props;
    return (
      <div>
        {inModal
          ? this.renderHeader()
          : <div className="container" styleName="fixed-header" style={this.outModalHeaderStyle}>
              {this.renderHeader()}
            </div>
        }
        <div styleName="content-selector-wrapper" className="content-selector-wrapper" ref={e => this.wrapperEl = e}>
          <ContentSelector {...this.props}/>
        </div>
      </div>
    );
  }

}
