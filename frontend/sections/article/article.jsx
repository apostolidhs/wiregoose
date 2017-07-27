import React from 'react';

import ArticleComponent from '../../components/article/article.jsx';
import { getArticleIdFromLink } from '../../components/article-box/link-generator.js';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';

export default class Article extends React.Component {

  state = {
    article: undefined,
    isLoading: false
  }

  componentDidMount() {
    const id = this.props.routeParams.id;
    const entryId = getArticleIdFromLink(id);
    this.retrieveArticle(entryId);
  }

  retrieveArticle = (entryId) => {
    this.setState({ isLoading: true });
    WiregooseApi.fetchArticle(entryId)
      .then(resp => this.setState({
        article: resp.data.data,
        isLoading: false
      }))
      .catch(() => this.setState({ isLoading: false }));
  }

  render() {
    const { article, isLoading } = this.state;

    return (
      <ArticleComponent article={article} isLoading={isLoading} />
    );
  }

}
