import _ from 'lodash';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './timeline.less';
import ArticleBox from '../article-box/article-box.jsx';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Timeline extends React.Component {

  state = {
    elements: [],
    isLoading: false
  }

  addFeeds = (feeds) => {
    const newElements = _.map(feeds, feed => (
      <div key={feed._id} styleName="timeline-box" >
        <ArticleBox entry={feed} />
      </div>
    ));
    const elements = this.state.elements.concat(newElements);
    this.setState({ elements });
  }

  setLoadingState = (isLoading = false) => {
    this.setState({ isLoading });
  }

  render() {
    const { elements, isLoading } = this.state;

    return (
      <div>
        <div className="clearfix">
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
      <p>Loading...</p>
    );
  }
}
