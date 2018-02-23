import map from 'lodash/map';
import castArray from 'lodash/castArray';
import uniqueId from 'lodash/uniqueId';
import identity from 'lodash/identity';
import shuffle from 'lodash/shuffle';
import groupBy from 'lodash/groupBy';
import compact from 'lodash/compact';
import each from 'lodash/each';
import isArray from 'lodash/isArray';
import chunk from 'lodash/chunk';
import React from 'react';

import { IS_DEV } from '../../../config-public.js';
import ArticleBox from '../article-box/article-box.jsx';
import GoogleAdvBox from '../article-box/google-adv-box.jsx';
import FBFollowBox from '../article-box/fb-follow-box.jsx';

const FB_FOLLOW_WIDGET_POSITION = 14;
const ADVERTISE_WIDGET_FREQUENCY = 19;
const ADVERTISE_WIDGET_INITIAL_POSITION = 9;
let totalElementsFromAllTimelines = 0;
let googleAdsLaunched = 0;

export function generateFeedsLayout(feeds, opts) {
  // changeFeedsToDebug(feeds);
  const cascadedFeeds = cascadeFeedsView(feeds);
  const newElements = map(cascadedFeeds, (cascadedFeed) => {
    ++totalElementsFromAllTimelines;

    if (shouldRenderFBFollowBox()) {
      return renderFBFollowBox();
    }

    if (shouldRenderAdvertiseBox()) {
      ++googleAdsLaunched;
      return renderAdvertiseBox();
    }

    const feeds = castArray(cascadedFeed);
    return (
      <div key={feeds[0]._id} styleName="timeline-box" style={{}} >
        {map(feeds, feed => renderArticleBox(feed, opts))}
      </div>
    );
  });

  return newElements;
}

function shouldRenderFBFollowBox() {
  return totalElementsFromAllTimelines === FB_FOLLOW_WIDGET_POSITION;
}

function shouldRenderAdvertiseBox() {
  return (
    !window.wgLazyAddBlockerDetected
    && (
      totalElementsFromAllTimelines === ADVERTISE_WIDGET_INITIAL_POSITION
      || (
        totalElementsFromAllTimelines !== ADVERTISE_WIDGET_FREQUENCY
        && totalElementsFromAllTimelines % ADVERTISE_WIDGET_FREQUENCY === 0
      )
    )
  );
}


function renderArticleBox(feed, opts) {
  return (
    <ArticleBox
      key={feed._id}
      entry={feed}
      hideCategory={opts.hideCategory}
      hideProvider={opts.hideProvider}
      showMockImage={feed.showMockImage}
      style={{}}
    />
  );
}

function renderFBFollowBox() {
  return (
    <div key={uniqueId('facebook-follow-Key-')} styleName="timeline-box" style={{}} >
      <FBFollowBox />
    </div>
  );
}

function renderAdvertiseBox() {
  return (
    <div key={uniqueId('advertise-key-')} styleName="timeline-box"  style={{}} >
      <GoogleAdvBox />
    </div>
  );
}

// noImage -> [2]
// noDescr -> [1]
function cascadeFeedsView(feeds) {
  const cascadedFeeds = createCascadeFeedsView(feeds);
  const prioritiesFeeds = createPriorityOnFullBoxes(cascadedFeeds);
  const fullfiedFeeds = createFullHeightOnSingleNoImageBoxes(prioritiesFeeds);
  return fullfiedFeeds;
}

function createCascadeFeedsView(feeds) {
  const shuffle = IS_DEV ? (f => identity(f)) : (f => shuffle(f));
  const byBoxSize = groupBy(feeds, feed => feed.boxSize);
  const noImages = byBoxSize['ARTICLE_BOX_NO_IMAGE'];
  const noDescrs = byBoxSize['ARTICLE_BOX_NO_DESCRIPTION'];
  const fulls = byBoxSize['ARTICLE_BOX_FULL'];
  let cascadeFeeds;
  if (!noImages && !noDescrs) {
    cascadeFeeds = shuffle(feeds);
  } else if (!noImages) {
    cascadeFeeds = cascadeNoDescriptionFeedsView(fulls, noDescrs);
  } else if (!noDescrs) {
    cascadeFeeds = shuffle(feeds);
  } else {
    let view = [];
    while(noImages.length && noDescrs.length) {
      const noImage = noImages.pop();
      const noDescr = noDescrs.pop();
      view.push(shuffle([noImage, noDescr]));
    }
    view = cascadeNoDescriptionFeedsView(view, noDescrs);
    cascadeFeeds = shuffle(view.concat(noImages).concat(fulls));
  }
  return compact(cascadeFeeds);
}

function createFullHeightOnSingleNoImageBoxes(cascadeFeeds) {
  each(cascadeFeeds, cascadeFeed => {
    if (
      !isArray(cascadeFeed)
      && cascadeFeed.boxSize === 'ARTICLE_BOX_NO_IMAGE'
    ) {
      cascadeFeed.showMockImage = true;
    }
  });
  return cascadeFeeds;
}

function createPriorityOnFullBoxes(cascadeFeeds) {
  const cascadeFeedsByBoxSize = groupBy(
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

function cascadeNoDescriptionFeedsView(list, noDescrs) {
  const noDescChunks = chunk(noDescrs, 3);
  return shuffle(noDescChunks.concat(list));
}

/////// debug
// noImage = 0;
// noDescription = 0;
// function changeFeedsToDebug(feeds) {
//   each(feeds, feed => {
//     if (++noImage % 5 === 0) {
//       feed.boxSize = 'ARTICLE_BOX_NO_IMAGE';
//     } else if (++noDescription % 2 === 0) {
//       feed.boxSize = 'ARTICLE_BOX_NO_DESCRIPTION';
//     }
//   });
// }
