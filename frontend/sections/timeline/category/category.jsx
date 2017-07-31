import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import styles from './category.less';
import Header from '../../../components/timeline/header.jsx';
import CategoryTag from '../../../components/category/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import Loader from '../../../components/loader/loader.jsx';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Category extends InfiniteScrollPage {

  static lastFeeds = undefined
  static timelineState = undefined
  static lastScrollTop = undefined

  timeline: undefined // ref
  categoryPrms: undefined

  state = {
    categories: undefined,
    categoryNotFound: false
  }

  componentDidMount() {
    const category = this.props.routeParams.id;
    if (Category.lastFeeds && Category.lastFeeds[category] === undefined) {
      Category.lastFeeds = undefined;
      Category.timelineState = undefined;
      Category.lastScrollTop = undefined;
    }
    this.retrieveCategories()
      .then(this.checkCategoryExistence)
      .then(() => {
        if (this.state.categoryNotFound) {
          return;
        }
        if (Category.timelineState) {
          this.timeline.setState(Category.timelineState);
          setTimeout(() => {
            this.setScrollTop(Category.lastScrollTop);
          }, 200);
        } else {
          this.retrieveTimeline();
        }
      });
    this.refs.categoryLoad.promise = this.categoryPrms;
    super.componentDidMount();
  }

  componentWillUnmount() {
    Category.lastScrollTop = this.getScrollTop();
  }

  retrieveCategories = () => {
    this.categoryPrms = WiregooseApi.statics.categories()
      .then(resp => {
        const categories = resp.data.data;
        this.setState({ categories });
      });
    return this.categoryPrms;
  }

  checkCategoryExistence = () => {
    const category = this.props.routeParams.id;
    if (!_.includes(this.state.categories, category)) {
      this.setState({ categoryNotFound: true });
      return;
    }
    this.setState({ categoryNotFound: false });
  }

  retrieveTimeline = () => {
    if (!(this.timeline && !this.timeline.state.isLoading)) {
      return;
    }

    this.timeline.setLoadingState(true);
    if (!Category.lastFeeds) {
      const category = this.props.routeParams.id;
      Category.lastFeeds = { [category]: _.now() };
    }
    WiregooseApi.timeline.category(Category.lastFeeds, true)
      .then(resp => {
        const { data } = resp.data;
        Category.lastFeeds = _.mapValues(
          data,
          feeds => (_.size(feeds) > 0 ? _.last(feeds).published.getTime() : undefined)
        );
        this.timeline.setLoadingState(false);
        const feeds = _(data)
          .values()
          .flatten()
          .value();
        this.timeline.addFeeds(feeds);
        Category.timelineState = this.timeline.state;
      });
  }

  // called by InfiniteScrollPage
  onBottomScrollReached = () => {
    this.retrieveTimeline();
  }

  render() {
    const { categories, categoryNotFound } = this.state;

    return (
      <Loader ref="categoryLoad" className="w-mt-7">
        {(() => {
          if (categoryNotFound) {
            return this.renderNotFound();
          } else {
            return (
              <div>
                <Header onClose={() => this.props.router.push('/')}>
                  <CategoryTag name={this.props.routeParams.id} />
                </Header>
                <Timeline ref={(ref) => this.timeline = ref} hideCategory={true} />
              </div>
            );
          }
        })()}
      </Loader>
    );
  }

  renderNotFound = () => {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="chain-broken" />
        </h1>
        <p className="lead">
          Category Not Found
        </p>
        <p>
          Find what you want on
          {_.map(this.state.categories, cat => (
            <Link
              className="w-ml-7"
              key={cat}
              to={`/category/${cat}`}
              role="button"
              title={cat}
            >
              {cat}
            </Link>
          ))}
        </p>
      </div>
    );
  }

}
