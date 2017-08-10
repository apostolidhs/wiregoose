import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';

import styles from './article.less';
import tr from '../../components/localization/localization.js';
import { publish } from '../../components/events/events.js';
import ArticleComponent from '../../components/article/article.jsx';
import { getIdFromLink } from '../../components/utilities/text-utilities.js';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Article extends React.Component {

  state = {
    article: undefined,
    isLoading: false,
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
      article: undefined
    });
    WiregooseApi.fetchArticle(entryId, true)
      .then(resp => {
        const article = resp.data.data;
        if (!article) {
          browserHistory.replace('/401');
          return;
        }

        this.setState({
          article,
          isLoading: false
        }, this.handleMetaData);
      })
      .catch((resp) => {
        this.setState({ isLoading: false });
      })
  }

  handleMetaData = () => {
    const { article } = this.state;
    publish('page-ready', {
      title: article.title,
      description: tr.formatString(tr.articleDescription, article.entryId.description),
      image: article.entryId.image,
      time: article.entryId.published,
      lang: article.entryId.lang,
      url: article.link
    });
  }

  render() {
    const { article, isLoading } = this.state;

    if (isLoading || article) {
      return (<ArticleComponent article={article} isLoading={isLoading} />);
    }
  }
}
