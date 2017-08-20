import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import validateURL from 'react-proptypes-url-validator';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';

 import FromNow from '../utilities/from-now.jsx';
import SocialShare from '../article-box/social-share.jsx';
import entryPropType from '../article-box/entry-prop-type.js';
import CategoryTag from '../category/tag.jsx';
import ProviderTag from '../rss-provider/tag.jsx';
import tr from '../localization/localization.js';

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
              this.renderLoading()
           }
        </div>
      </div>
    );
  }

  goBack = () => {
    browserHistory.goBack();
  }

  renderBackButton = () => {
    return (
      <Button bsStyle="link" className="blind-link" onClick={this.goBack}>
        <FontAwesome name="chevron-left" /> {tr.goBack}
      </Button>
    );
  }

  renderLoading = () => {
    return (
      <div className="text-center">
        <img className="w-is-logo-loading" src="/public/assets/img/logo.png" style={{width: '50px'}}/>
        <h4 className="w-text-loading" data-text={tr.loadingArticle}>
          {tr.loadingArticle}
        </h4>
      </div>
    );
  }

  renderHeader = (article) => {
    const entry = article.entryId;
    const title = article.title || article.entryId.title;

    return (
      <header>
        <div className="pull-left" >
          {this.renderBackButton()}
        </div>
        <div className="text-right">
          <SocialShare link={location.href} overlayPlacement={"bottom"} />
        </div>
        <h1>{title}</h1>
        <div>
          <CategoryTag name={entry.category} />
          <ProviderTag name={entry.provider} className="w-ml-7" />
          <FromNow
            className="text-muted pull-right"
            date={entry.published}
          />
        </div>
        { article.byline &&
          <small className="text-muted">
            {tr.by} {article.byline}
          </small>
        }
      </header>
    );
  }

  renderFooter = (article) => {
    return (
      <footer>
        {this.renderBackButton()}
        <div className="text-center">
          <a className="btn btn-default" href={article.link} role="button" target="_blank">
            {tr.articleReadFromWebsite}
          </a>
        </div>
      </footer>
    );
  }

  renderError = (article) => {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="newspaper-o" />
        </h1>
        <p className="lead">{tr.articleRedirectTitle}</p>
        { this.state.redirectIn !== -1 &&
          <p>
            {tr.formatString(
              tr.articleRedirectDesc,
              <a href={article.link} role="button" target="_blank">
                {tr.articleRedirectDescOriginal}
              </a>,
              Article.ARTICLE_REDIRECTION_DELAY - this.state.redirectIn
            )}
          </p>
        }
        { this.state.redirectIn === -1 &&
          <a href={article.link} role="button" target="_blank">
            {tr.articleReadFromWebsite}
          </a>
        }
        <p>
          <b>{tr.or}</b> {''}
          <Link
            to="/"
            role="button"
            title={tr.exploreNews}
          >
            {tr.promptReading}
          </Link>
        </p>
      </div>
    );
  }

}
