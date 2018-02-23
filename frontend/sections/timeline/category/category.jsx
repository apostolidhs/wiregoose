import includes from 'lodash/includes';
import now from 'lodash/now';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { LinkContainer } from 'react-router-bootstrap';
import NavItem from 'react-bootstrap/lib/NavItem';
import Nav from 'react-bootstrap/lib/Nav';
import FontAwesome from 'react-fontawesome';
import { Link, browserHistory } from 'react-router';

import styles from './category.less';
import { publish } from '../../../components/events/events.jsx';
import Header from '../../../components/timeline/header.jsx';
import CategoryTag from '../../../components/category/tag.jsx';
import Timeline from '../../../components/timeline/timeline.jsx';
import TimelinePage from '../../../components/timeline/page.js';
import Loader from '../../../components/loader/loader.jsx';
import InfiniteScrollPage from '../../../components/infinite-scroll/page.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../../components/utilities/browser-language-detection.js';
import tr from '../../../components/localization/localization.js';
import Offline from '../../../components/offline-mode/offline.jsx';
import { CATEGORIES } from '../../../../config-public.js';
import withReload from '../../../components/utilities/reload-hoc.jsx';

@CSSModules(styles, {
  allowMultiple: true,
})
class Category extends InfiniteScrollPage {

  static page = new TimelinePage({
    hideCategory: true
  });

  state = {}
  timeline = undefined // ref

  componentDidMount() {
    const category = this.props.routeParams.id;
    if (Category.page.lastFeeds && Category.page.lastFeeds[category] === undefined) {
      Category.page.invalidateCache();
    }

    if (this.checkCategoryExistence()) {
      Category.page.componentDidMount(this);
      super.componentDidMount();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Category.page.componentWillUnmount();
  }

  checkCategoryExistence = () => {
    const category = this.props.routeParams.id;
    if (!includes(CATEGORIES, category)) {
      browserHistory.replace('/401');
      return false;
    }
    return true;
  }

  retrieveTimeline = () => {
    if (!Category.page.lastFeeds) {
      const category = this.props.routeParams.id;
      Category.page.lastFeeds = { [category]: now() };
    }
    return WiregooseApi.timeline.category(
      Category.page.lastFeeds,
      BrowserLanguageDetection(),
      {
        onOffline: () => {
          if (isEmpty(Category.page.virtualList)) {
            this.setState({isOffline: true});
          }
        }
      }
    );
  }

  handleMetaData = () => {
    const category = this.props.routeParams.id;
    const catName = tr[category] || category;
    publish('page-ready', {
      title: catName,
      keywords: catName,
      description: tr.formatString(tr.timelineCategoryDescription, catName).join('')
    });
  }

  onScroll = () => {
    Category.page.onScroll(this);
  }

  render() {
    return (
      <div>
        <Header onClose={() => this.props.router.push('/')}>
          <CategoryTag name={this.props.routeParams.id} />
        </Header>
        {this.state.isOffline &&
          <Offline />
        }
        <Timeline ref={(ref) => this.timeline = ref} />
      </div>
    );
  }
}

export default withReload(Category);
