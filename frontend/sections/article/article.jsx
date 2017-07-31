import _ from 'lodash';
import React from 'react';
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
    const entryId = getIdFromLink(link);
    this.retrieveArticle(entryId);
  }

  retrieveArticle = (entryId) => {
    this.setState({ isLoading: true });
    WiregooseApi.fetchArticle(entryId, true)
      .then(resp => {
        const article = resp.data.data;
        if (article) {
          this.setState({
            article: resp.data.data,
            isLoading: false
          });
        }
      })
      .catch((resp) => {
        const errorCode = _.get(resp, 'response.data.errors[0].code');
        // errorCode === 1003 not found
        this.setState({ isLoading: false })
      });
  }

  render() {
    const { article, isLoading } = this.state;

    if (isLoading || article) {
      return (<ArticleComponent article={article} isLoading={isLoading} />);
    } else {
      return this.renderNotFound();
    }
  }

  renderNotFound = () => {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="chain-broken" />
        </h1>
        <p className="lead">
          Article Not Found
        </p>
        <p>
          You could {''}
          <Link
            to="/"
            role="button"
            title="Explore News"
          >
            continue reading news
          </Link>
        </p>
      </div>
    );
  }

}
