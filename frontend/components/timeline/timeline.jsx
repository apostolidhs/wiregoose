import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './timeline.less';
import tr from '../localization/localization.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Timeline extends React.Component {
  scrollContainerEl = undefined

  state = {
    elements: [],
    isLoading: false
  }

  reset() {
    this.setState({
      elements: [],
      isLoading: false
    });
  }

  setLoadingState = (isLoading = false) => {
    this.setState({ isLoading });
  }

  render() {
    const { elements, isLoading } = this.state;

    return (
      <div>
        <div className="clearfix" styleName='scroll-container' ref={el => this.scrollContainerEl = el} >
          {elements}
        </div>
        { isLoading &&
          this.renderLoading()
        }
      </div>
    );
  }

  renderLoading = () => {
    return (
      <h4 className="w-text-loading" styleName="text-loading" data-text={tr.loadingMore}>
        {tr.loadingMore}
      </h4>
    );
  }

}
