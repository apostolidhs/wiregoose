import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Link, browserHistory } from 'react-router';

import styles from './category.less';
import { publish } from '../../../components/events/events.js';
import Header from '../../../components/timeline/header.jsx';
import CategoryTag from '../../../components/category/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import Loader from '../../../components/loader/loader.jsx';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Category extends InfiniteScrollPage {

  static page = new TimelinePage();

  timeline = undefined // ref

  state = {
    categories: undefined
  }

  componentDidMount() {
    const category = this.props.routeParams.id;
    if (Category.page.lastFeeds && Category.page.lastFeeds[category] === undefined) {
      Category.page.invalidateCache();
    }

    this.retrieveCategories()
      .then(this.checkCategoryExistence)
      .then(() => Category.page.componentDidMount(this));

    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Category.page.componentWillUnmount(this);
  }

  retrieveCategories = () => {
    return WiregooseApi.statics.categories()
      .then(resp => {
        const categories = resp.data.data;
        this.setState({ categories });
      });
  }

  checkCategoryExistence = () => {
    const category = this.props.routeParams.id;
    if (!_.includes(this.state.categories, category)) {
      browserHistory.replace('/401');
      throw new Error();
    }
  }

  retrieveTimeline = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }

    this.timeline.setLoadingState(true);
    if (!Category.page.lastFeeds) {
      const category = this.props.routeParams.id;
      Category.page.lastFeeds = { [category]: _.now() };
    }
    WiregooseApi.timeline.category(Category.page.lastFeeds, BrowserLanguageDetection(), true)
      .then(resp => Category.page.timelineRetrievedSuccessfully(this, resp))
      .then(this.handleMetaData);
  }

  handleMetaData = () => {
    const category = this.props.routeParams.id;
    const catName = tr[category] || category;
    publish('page-ready', {
      title: catName,
      keywords: catName,
      description: tr.formatString(tr.timelineCategoryDescription, catName)
    });
  }

  // called by InfiniteScrollPage
  onBottomScrollReached = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }
    Category.page.retrieveNextTimeline(this);
  }

  // called by InfiniteScrollPage
  onTopScrollReached = () => {
    Category.page.retrievePrevTimeline(this);
  }

  render() {
    return (
      <div>
        <Header onClose={() => this.props.router.push('/')}>
          <CategoryTag name={this.props.routeParams.id} />
        </Header>
        <Timeline ref={(ref) => this.timeline = ref} hideCategory={true} />
      </div>
    );
  }
}
