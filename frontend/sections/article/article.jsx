import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import styles from './article.less';
import ArticleComponent from '../../components/article/article.jsx';
import { getIdFromLink } from '../../components/text-utilities/text-utilities.js';
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
        });
      })
      .catch((resp) => {
        this.setState({ isLoading: false });
      })
  }

  render() {
    const { article, isLoading } = this.state;

    if (isLoading || article) {
      return (<ArticleComponent article={article} isLoading={isLoading} />);
    }
  }
}
