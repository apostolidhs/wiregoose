import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import validateURL from 'react-proptypes-url-validator';
import { Link } from 'react-router';
import TimeAgo from 'react-timeago';
import FontAwesome from 'react-fontawesome';

import entryPropType from '../article-box/entry-prop-type.js';

export default class Article extends React.Component {
  static ARTICLE_REDIRECTION_DELAY = 3; //s

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

  state = {
    redirectIn: -1
  }

  componentWillReceiveProps = ({ article, isLoading }) => {
    if (!isLoading && article && article.error && this.state.redirectIn === -1) {
      const redirectIn = Article.ARTICLE_REDIRECTION_DELAY;
      this.setState({ redirectIn });
      _.each(_.times(redirectIn), sec => {
        setTimeout(() => {
          const normalSec = sec + 1;
          const isLast = normalSec === redirectIn;
          this.setState({ redirectIn: isLast ? -1 : normalSec });
          if (isLast) {
            window.open(article.link, "_blank");
          }
        }, sec * 1000);
      });
    }
  }

  render() {
    const { article, isLoading } = this.props;

    return (
      <div className={"article-body"}>
         <div className="article-container font-size5 content-width4">
           { article &&
            <article className="article-reader-content line-height4">
              { this.renderHeader(article) }
              {(() => {
                if (article.error) {
                  return this.renderError(article);
                } else {
                  return <section dangerouslySetInnerHTML={{__html: article.content}}></section>
                }
              })()}
              { !article.error && this.renderFooter(article) }
            </article>
           }
           {
             isLoading &&
             <p>Loading...</p>
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
        <a className="btn btn-lg btn-default" href={article.link} role="button" target="_blank">
          Read Article From Website
        </a>
      </footer>
    );
  }

  renderError = (article) => {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="newspaper-o" />
        </h1>
        <p className="lead">
          Too Small Article!
        </p>
        { this.state.redirectIn !== -1 &&
          <p>
            You will be redirected {''}
            <a href={article.link} role="button" target="_blank">
              at the Original Article
            </a>
            {''} in {Article.ARTICLE_REDIRECTION_DELAY - this.state.redirectIn} sec
          </p>
        }
        { this.state.redirectIn === -1 &&
          <a href={article.link} role="button" target="_blank">
            Read the Original Article
          </a>
        }
        <p>
          <b>Or</b> {''}
          <Link
            to="/"
            role="button"
            title="Explore News"
          >
            Continue Reading News
          </Link>
        </p>
      </div>
    );
  }

}
