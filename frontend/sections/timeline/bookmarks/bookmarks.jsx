import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import Loader from '../../../components/loader/loader.jsx';
import { publish } from '../../../components/events/events.jsx';
import Header from '../../../components/timeline/header.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import {getSession} from '../../../components/authorization/auth.js';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';
import FontAwesome from 'react-fontawesome';
import Offline from '../../../components/offline-mode/offline.jsx';

export default class Bookmarks extends InfiniteScrollPage {

  static page = new TimelinePage();

  state = {}
  timelineHasRetrieved = false;
  timeline = undefined // ref

  componentDidMount() {
    Bookmarks.page.componentDidMount(this);
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Bookmarks.page.componentWillUnmount();
    Bookmarks.page.invalidateCache();
  }

  retrieveTimeline = () => {
    if (this.timelineHasRetrieved) {
      return Promise.resolve({data: { data: {} }});
    }
    const userId = getSession().user._id;
    const request = WiregooseApi.timeline.bookmarks(userId, {
        onOffline: () => {
          if (!this.timelineHasRetrieved) {
            this.setState({isOffline: true});
          }
        }
    }).then(resp => {
      this.timelineHasRetrieved = true;
      return resp;
    });

    this.refs.bookmarkLoad.promise = request;

    return request;
  }

  handleMetaData = () => {
    publish('page-ready', {
      title: tr.timelineBookmarksTitle,
      keywords: tr.timelineBookmarksKeywords,
      description: tr.timelineBookmarksDescription
    });
  }

  onScroll = () => {
    Bookmarks.page.onScroll(this);
  }

  renderBlankSlate() {
    return (
      <div className="text-center">
        <h1>{tr.timelineBookmarksBlankSlateTitle}</h1>
        <p>
          <Link
            to="/"
            role="button"
            title={tr.exploreNews}
          >
            {tr.promptReading}
          </Link>
          {' '}
          {tr.timelineBookmarksBlankSlateDesc}
        </p>
        <h1>{<FontAwesome name="bookmark" />}</h1>
      </div>
    );
  }

  render() {
    const {showBlankSlate, isOffline} = this.state;
    return (
      <div>
        {!showBlankSlate &&
          <Header>
            <h3>{tr.timelineBookmarksDescription}</h3>
          </Header>
        }
        {isOffline &&
          <Offline />
        }
        {showBlankSlate &&
          this.renderBlankSlate()
        }
        <Loader ref="bookmarkLoad">
          <Timeline ref={(ref) => this.timeline = ref} />
        </Loader>
      </div>
    );
  }

}
