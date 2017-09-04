import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './timeline.less';
import ArticleBox from '../article-box/article-box.jsx';
import FBFollowBox from '../article-box/fb-follow-box.jsx';
import tr from '../localization/localization.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Timeline extends React.Component {
  static FB_FOLLOW_WIDGET_POSITION = 8;

  static propTypes = {
    hideCategory: PropTypes.bool,
    hideProvider: PropTypes.bool,
  }

  state = {
    elements: [],
    isLoading: false
  }

  // addFeeds = (feeds) => {

  // }

  appendElements(elements) {
    const stateElements = this.state.elements;
    this.setState({
      elements: stateElements.concat(elements)
    });
  }

  prependElements(elements) {
    const stateElements = this.state.elements;
    this.setState({
      elements: elements.concat(stateElements)
    });
  }

  removeElements(elements) {
    const stateElements = this.state.elements;
    _.pullAll(stateElements, elements);
  }

  createElements(feeds) {
    // this.changeFeedsToDebug(feeds);
    const cascadedFeeds = this.cascadeFeedsView(feeds);
    const elementsLength = this.state.elements.length;
    const newElements = _.map(cascadedFeeds, (cascadedFeed, feedsIdx) => {
      const feeds = _.castArray(cascadedFeed);
      return (
        <div key={feeds[0]._id} styleName="timeline-box" >
          {_.map(feeds, (feed) => {
            if (elementsLength + feedsIdx === Timeline.FB_FOLLOW_WIDGET_POSITION) {
              return (
                <FBFollowBox key="facebookFollowKey" />
              );
            } else {
              return (
                <ArticleBox
                  key={feed._id}
                  entry={feed}
                  hideCategory={this.props.hideCategory}
                  hideProvider={this.props.hideProvider}
                  showMockImage={feed.showMockImage}
                />
              );
            }
          })}
        </div>
      );
    });
    return newElements;
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
      <h4 className="w-text-loading" data-text={tr.loadingMore}>
        {tr.loadingMore}
      </h4>
    );
  }

  // noImage -> [2]
  // noDescr -> [1]
  cascadeFeedsView = (feeds) => {
    const byBoxSize = _.groupBy(feeds, feed => feed.boxSize);
    const noImages = byBoxSize['ARTICLE_BOX_NO_IMAGE'];
    const noDescrs = byBoxSize['ARTICLE_BOX_NO_DESCRIPTION'];
    const fulls = byBoxSize['ARTICLE_BOX_FULL'];
    let cascadeFeeds;
    if (!noImages && !noDescrs) {
      cascadeFeeds = _.shuffle(feeds);
    } else if (!noImages) {
      cascadeFeeds = this.cascadeNoDescriptionFeedsView(fulls, noDescrs);
    } else if (!noDescrs) {
      cascadeFeeds = _.shuffle(feeds);
    } else {
      let view = [];
      while(noImages.length && noDescrs.length) {
        const noImage = noImages.pop();
        const noDescr = noDescrs.pop();
        view.push(_.shuffle([noImage, noDescr]));
      }
      view = this.cascadeNoDescriptionFeedsView(view, noDescrs);
      cascadeFeeds = _.shuffle(view.concat(noImages).concat(fulls));
    }
    _.each(cascadeFeeds, cascadeFeed => {
        cascadeFeed.showMockImage = !_.isArray(cascadeFeed)
                                  && cascadeFeed.boxSize === 'ARTICLE_BOX_NO_IMAGE';
    });
    return cascadeFeeds;
  }

  cascadeNoDescriptionFeedsView = (list, noDescrs) => {
    const noDescChunks = _.chunk(noDescrs, 3);
    return _.shuffle(noDescChunks.concat(list));
  }

  noImage = 0;
  noDescription = 0;
  changeFeedsToDebug = (feeds) => {
    _.each(feeds, feed => {
      if (++this.noImage % 5 === 0) {
        feed.boxSize = 'ARTICLE_BOX_NO_IMAGE';
      } else if (++this.noDescription % 2 === 0) {
        feed.boxSize = 'ARTICLE_BOX_NO_DESCRIPTION';
      }
    });
  }
}
