import React from 'react';
import PropTypes from 'prop-types';
import validateURL from 'react-proptypes-url-validator';
import { Link } from 'react-router';
import TimeAgo from 'react-timeago';

import entryPropType from '../article-box/entry-prop-type.js';

export default class Article extends React.Component {

  static propTypes = {
    article: PropTypes.shape({
      content: PropTypes.string,
      contentLength: PropTypes.number,
      title: PropTypes.string,
      byline: PropTypes.string,
      error: PropTypes.shape({
        code: PropTypes.number,
        msg: PropTypes.string
      }),
      link: validateURL,
      entryId:  PropTypes.shape(entryPropType),
      createdAt: PropTypes.instanceOf(Date)
    }),
    isLoading: PropTypes.bool
  }

  render() {
    const { article, isLoading } = this.props;

    return (
      <div className={"article-body"}>
         <div className="article-container font-size5 content-width4">
           { !isLoading && article &&
            <article className="article-reader-content line-height4">
              { this.renderHeader(article) }
              <section dangerouslySetInnerHTML={{__html: article.content}}></section>
              { this.renderFooter(article) }
            </article>
           }
        </div>
      </div>
    );
  }

  renderHeader = (article) => {
    const entry = article.entryId;
    const title = article.title || article.entryId.title;

    return (
      <header>
        <h1>{title}</h1>
        <div>
          <Link
            className="btn btn-link-muted"
            to="/"
            role="button"
            title="Category"
          >
            {entry.category}
          </Link>
          <Link
            className="btn btn-link-muted"
            to="/"
            role="button"
            title="Provider"
          >
            {entry.provider}
          </Link>
          <TimeAgo
            className="text-muted pull-right"
            date={entry.published}
            minPeriod={1}
          />
        </div>
        { article.byline &&
          <small className="text-muted">
            By {article.byline}
          </small>
        }
      </header>
    );
  }

  renderFooter = (article) => {
    return (
      <footer className="text-center">
        <a className="btn btn-lg btn-default" href={article.link} role="button">
          Read Article From Website
        </a>
      </footer>
    );
  }

}
