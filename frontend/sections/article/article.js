import first from 'lodash/first';
import React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';

import styles from './article.less';
import tr from '../../components/localization/localization.js';
import { publish } from '../../components/events/events.js';
import ArticleComponent from '../../components/article/article.js';
import { getIdFromLink } from '../../components/utilities/text-utilities.js';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';
import Offline from '../../components/offline-mode/offline.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Article extends React.Component {

  state = {
    article: undefined,
    isLoading: false,
    relatedEntries: undefined,
    isOffline: false
  }

  componentDidMount() {
    const link = this.props.routeParams.id;
    const entryId = getIdFromLink(link, true);
    if (!entryId) {
      browserHistory.replace('/401');
      return;
    }
    this.retrieveArticle(entryId);
  }

  retrieveArticle = (entryId) => {
    this.setState({
      isLoading: true,
      article: undefined,
      relatedEntries: undefined
    });
    WiregooseApi.fetchArticle(entryId, true, {
      onOffline: () => {
        this.setState({isOffline: true});
      }
    })
    .then(resp => {
      const {article, relatedEntries} = resp.data.data;
      if (!article) {
        browserHistory.replace('/401');
        return;
      }

      this.setState({
        article,
        relatedEntries,
        isLoading: false
      }, this.handleMetaData);
    })
    .catch(() => this.setState({ isLoading: false }));
  }

  handleMetaData = () => {
    const { article } = this.state;
    publish('page-ready', {
      title: article.title || article.entryId.title,
      description: tr.formatString(tr.articleDescription, article.entryId.description).join(''),
      image: article.entryId.image,
      time: article.entryId.published,
      lang: article.entryId.lang,
      // url: article.link || article.entryId.title
    });
  }

  render() {
    const {
      article,
      isLoading,
      relatedEntries,
      isOffline
    } = this.state;

    if (isOffline) {
      return <Offline />;
    } else if (isLoading || article) {
      return (
        <ArticleComponent
          article={article}
          isLoading={isLoading}
          relatedEntries={relatedEntries}
          nextRelatedEntry={first(relatedEntries)}
        />
      );
    }
  }
}
