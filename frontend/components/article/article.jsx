import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import validateURL from 'react-proptypes-url-validator';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import CSSModules from 'react-css-modules';

import FromNow from '../utilities/from-now.jsx';
import SocialShare from '../article-box/social-share.jsx';
import entryPropType from '../article-box/entry-prop-type.js';
import CategoryTag from '../category/tag.jsx';
import ProviderTag from '../rss-provider/tag.jsx';
import tr from '../localization/localization.js';
import styles from './article.less';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Article extends React.Component {
  static totalDisplayedAdds = 0;
  static DISPLAY_ADDS_FREQUENCY = 1;

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
    isLoading: PropTypes.bool,
    relatedEntries: PropTypes.arrayOf(entryPropType)
  }

  articleContentEl = undefined

  setArticleContentEl = (el) => {
    if (!this.articleContentEl) {
      this.articleContentEl = el;
      ++Article.totalDisplayedAdds;
      this.createAdvertiseIfIsPossible();
    }
  }

  createAdvertiseIfIsPossible = () => {
    if (Article.totalDisplayedAdds % Article.DISPLAY_ADDS_FREQUENCY === 0) {
      return;
    }
    const pEls = this.articleContentEl.getElementsByTagName('p');
    const totalP = pEls.length;
    if (totalP > 1) {
      const targetEl = pEls[Math.round(totalP * 0.7)];
      const pAdvEl = document.createElement('div');
      pAdvEl.style.padding = '10px 0';
      pAdvEl.innerHTML = this.getParagraphAdv();
      targetEl.parentElement.insertBefore(pAdvEl, targetEl);
      setTimeout(() => {
        (adsbygoogle = window.adsbygoogle || []).push({});
      }, 0);
    }
  }

  goBack = () => {
    const pathname = browserHistory.getCurrentLocation().pathname;
    setTimeout(() => {
      const nextPathname = browserHistory.getCurrentLocation().pathname;
      if (pathname === nextPathname) {
        browserHistory.replace('/');
      }
    }, 0);
    browserHistory.goBack();
  }

  getParagraphAdv = () => {
    return (
      `<ins class="adsbygoogle"
        style="display:block; text-align:center;"
        data-ad-format="fluid"
        data-ad-layout="in-article"
        data-ad-client="ca-pub-3571483150053473"
        data-ad-slot="8983891351">
      </ins>`
    );
  }

  render() {
    const { article, isLoading } = this.props;

    return (
      <div className="article-body" >
         <div className="article-container font-size5 content-width4">
           { article &&
              <article className="article-reader-content line-height4">
                { this.renderHeader(article) }
                {(() => {
                  if (article.error) {
                    return this.renderError(article);
                  } else {
                    return (
                      <section
                        ref={ this.setArticleContentEl }
                        dangerouslySetInnerHTML={{__html: article.content}}>
                      </section>
                    )
                  }
                })()}
                {
                  !article.error &&
                    this.renderFooter(article)
                }
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

  renderBackButton = () => {
    return (
      <Button bsStyle="link" className="blind-link" onClick={this.goBack}>
        <FontAwesome name="chevron-left" /> {tr.goBack}
      </Button>
    );
  }

  renderSocialBanner = () => {
    return (
      <div>
        <div className="pull-left" >
          {this.renderBackButton()}
        </div>
        <div className="text-right">
          <SocialShare link={location.href} overlayPlacement={"bottom"} />
        </div>
      </div>
    );
  }

  renderLoading = () => {
    return (
      <div className="text-center">
        <img className="w-is-logo-loading" src={mongooseIcon} styleName="logo-loading" />
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
        {this.renderSocialBanner()}
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
        <div className="text-center w-mb-7">
          <a className="btn btn-default" href={article.link} role="button" target="_blank" styleName="article-control-btn" >
            {tr.articleReadFromWebsite}
          </a>
        </div>
        {this.renderSocialBanner()}
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
        <a href={article.link} className="btn btn-default" role="button" target="_blank" styleName="article-control-btn">
          <FontAwesome name="external-link" /> {' '}
          {tr.articleReadFromWebsite}
        </a>
      </div>
    );
  }

}
