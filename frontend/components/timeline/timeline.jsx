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
  static FB_FOLLOW_WIDGET_POSITION = 14;
  static ADVERTISE_WIDGET_FREQUENCY = 19;
  static ADVERTISE_WIDGET_INITIAL_POSITION = 9;
  static totalElementsFromAllTimelines = 0;

  static propTypes = {
    hideCategory: PropTypes.bool,
    hideProvider: PropTypes.bool,
  }

  scrollContainerEl = undefined

  totalElements = 0
  googleAdsLaunched = 0

  state = {
    elements: [],
    isLoading: false
  }

  createWhiteSpaceElement() {
    return (<div key={_.uniqueId('whitespace-')} styleName="timeline-box" ></div>);
  }

  createElements(feeds) {
    // this.changeFeedsToDebug(feeds);
    const cascadedFeeds = this.cascadeFeedsView(feeds);
    const newElements = _.map(cascadedFeeds, (cascadedFeed) => {
      ++Timeline.totalElementsFromAllTimelines;

      if (this.shouldRenderFBFollowBox()) {
        return this.renderFBFollowBox();
      }

      if (this.shouldRenderAdvertiseBox()) {
        ++this.googleAdsLaunched;
        return this.renderAdvertiseBox();
      }

      const feeds = _.castArray(cascadedFeed);
      return (
        <div key={feeds[0]._id} styleName="timeline-box" style={{}} >
          {_.map(feeds, this.renderArticleBox)}
        </div>
      );
    });

    return newElements;
  }

  shouldRenderFBFollowBox = () => {
    return Timeline.totalElementsFromAllTimelines === Timeline.FB_FOLLOW_WIDGET_POSITION;
  }

  shouldRenderAdvertiseBox = () => {
    return (
      Timeline.totalElementsFromAllTimelines === Timeline.ADVERTISE_WIDGET_INITIAL_POSITION
      || (
        Timeline.totalElementsFromAllTimelines !== Timeline.ADVERTISE_WIDGET_FREQUENCY
        && Timeline.totalElementsFromAllTimelines % Timeline.ADVERTISE_WIDGET_FREQUENCY === 0
      )
    );
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

  renderArticleBox = (feed) => {
    return (
      <ArticleBox
        key={feed._id}
        entry={feed}
        hideCategory={this.props.hideCategory}
        hideProvider={this.props.hideProvider}
        showMockImage={feed.showMockImage}
        style={{}}
      />
    );
  }

  renderFBFollowBox = () => {
    return (
      <div key={_.uniqueId('facebook-follow-Key-')} styleName="timeline-box" style={{}} >
        <FBFollowBox />
      </div>
    );
  }

  renderAdvertiseBox = () => {
    return (
      <div key={_.uniqueId('advertise-key-')} styleName="timeline-box"  style={{}} >
        <ins className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-format="fluid"
          data-ad-layout-key="-8j+1w-dx+ec+gk"
          data-ad-client="ca-pub-3571483150053473"
          data-ad-slot="9953314902">
        </ins>
      </div>
    );
  }

  // noImage -> [2]
  // noDescr -> [1]
  cascadeFeedsView = (feeds) => {
    const cascadedFeeds = this.createCascadeFeedsView(feeds);
    const prioritiesFeeds = this.createPriorityOnFullBoxes(cascadedFeeds);
    const fullfiedFeeds = this.createFullHeightOnSingleNoImageBoxes(prioritiesFeeds);
    return fullfiedFeeds;
  }

  createCascadeFeedsView = (feeds) => {
    const byBoxSize = _.groupBy(feeds, feed => feed.boxSize);
    const noImages = byBoxSize['ARTICLE_BOX_NO_IMAGE'];
    const noDescrs = byBoxSize['ARTICLE_BOX_NO_DESCRIPTION'];
    const fulls = byBoxSize['ARTICLE_BOX_FULL'];
    let cascadeFeeds;
    if (!noImages && !noDescrs) {
      cascadeFeeds = /*_.shuffle*/(feeds);
    } else if (!noImages) {
      cascadeFeeds = this.cascadeNoDescriptionFeedsView(fulls, noDescrs);
    } else if (!noDescrs) {
      cascadeFeeds = /*_.shuffle*/(feeds);
    } else {
      let view = [];
      while(noImages.length && noDescrs.length) {
        const noImage = noImages.pop();
        const noDescr = noDescrs.pop();
        view.push(/*_.shuffle*/([noImage, noDescr]));
      }
      view = this.cascadeNoDescriptionFeedsView(view, noDescrs);
      cascadeFeeds = /*_.shuffle*/(view.concat(noImages).concat(fulls));
    }
    return cascadeFeeds;
  }

  createFullHeightOnSingleNoImageBoxes = (cascadeFeeds) => {
    _.each(cascadeFeeds, cascadeFeed => {
      if (
        !_.isArray(cascadeFeed)
        && cascadeFeed.boxSize === 'ARTICLE_BOX_NO_IMAGE'
      ) {
        cascadeFeed.showMockImage = true;
      }
    });
    return cascadeFeeds;
  }

  createPriorityOnFullBoxes = (cascadeFeeds) => {
    const cascadeFeedsByBoxSize = _.groupBy(
      cascadeFeeds,
      cascadeFeed => cascadeFeed.boxSize === 'ARTICLE_BOX_FULL' ? 'full' : 'noFull'
    );

    const prioritiesView = [];
    const full = cascadeFeedsByBoxSize.full || [];
    const noFull = cascadeFeedsByBoxSize.noFull || [];
    while(full.length > 2 && noFull.length) {
      prioritiesView.push(full.pop());
      prioritiesView.push(full.pop());
      prioritiesView.push(full.pop());
      prioritiesView.push(noFull.pop());
    }

    return prioritiesView
      .concat(full)
      .concat(noFull);
  }

  cascadeNoDescriptionFeedsView = (list, noDescrs) => {
    const noDescChunks = _.chunk(noDescrs, 3);
    return _.shuffle(noDescChunks.concat(list));
  }

  /////// debug
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
