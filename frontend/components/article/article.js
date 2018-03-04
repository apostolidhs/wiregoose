import size from 'lodash/size';
import map from 'lodash/map';
import React from 'react';
import PropTypes from 'prop-types';
import validateURL from 'react-proptypes-url-validator';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { browserHistory } from 'react-router';
import CSSModules from 'react-css-modules';

import FromNow from '../utilities/from-now.js';
import SocialShare from '../article-box/social-share.js';
import entryPropType from '../article-box/entry-prop-type.js';
import ArticleBoxSm from '../article-box/article-box-sm.js';
import ArticleBoxMd from '../article-box/article-box-md.js';
import CategoryTag from '../category/tag.js';
import ProviderTag from '../rss-provider/tag.js';
import tr from '../localization/localization.js';
import { createLink } from '../utilities/text-utilities.js';

import styles from './article.less';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Article extends React.Component {
  static propTypes = {
    article: PropTypes.shape({
      content: PropTypes.string,
      contentEl: PropTypes.any,
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
    relatedEntries: PropTypes.arrayOf(
      PropTypes.shape(entryPropType)
    ),
    nextRelatedEntry: PropTypes.shape(entryPropType)
  }

  articleContentEl = undefined

  setArticleContentEl = (el) => {
    if (!this.articleContentEl) {
      this.articleContentEl = el;
      const {contentEl} = this.props.article;
      this.createAdvertiseIfIsPossible(contentEl);
      el.appendChild(contentEl);
    }
  }

  createAdvertiseIfIsPossible = (content) => {
    setTimeout(() => {
      const pEls = content.getElementsByTagName('p');
      const totalP = pEls.length;
      if (totalP > 2  && !window.wgLazyAddBlockerDetected) {
        const targetEl = pEls[Math.round(totalP * 0.7)];
        const pAdvEl = document.createElement('div');
        pAdvEl.style.padding = '10px 0';
        pAdvEl.innerHTML = this.getParagraphAdv();
        targetEl.parentElement.insertBefore(pAdvEl, targetEl);
        setTimeout(() => {
          (adsbygoogle = window.adsbygoogle || []).push({});
        }, 0);
      }
    }, 500);
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
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-3571483150053473"
        data-ad-slot="9172176420">
      </ins>`
    );
  }

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return this.renderLoading();
    }

    return (
      <Row>
        <Col lg={10} lgOffset={1}>
          <article styleName="article" >
            { this.renderHeader() }
            { this.renderError() }
            { this.renderArticle() }
            { this.renderRelatedArticles() }
            { this.renderFooter() }
          </article>
        </Col>
      </Row>
    );
  }

  renderHeader = () => {
    const { article } = this.props;
    const entry = article.entryId;
    const title = article.title || article.entryId.title;

    return (
      <header styleName="header" >
        {this.renderHeaderToolbar()}
        <h1>{title}</h1>
        <div className="w-mt-14" >
          <CategoryTag name={entry.category} />
          <ProviderTag name={entry.provider} className="w-ml-7" />
          <FromNow
            className="text-muted pull-right"
            date={entry.published}
          />
        </div>
        { size(article.byline) > 2 &&
          <div className="w-mt-14 text-muted" >
            {tr.by} {article.byline}
          </div>
        }
      </header>
    );
  }

  renderHeaderToolbar = () => {
    const { nextRelatedEntry, article } = this.props;
    return (
      <div styleName="header-toolbar" >
        <div styleName="header-toolbar-actions" >
          {this.renderBackButton()}
          <SocialShare
            entryId={article.entryId._id}
            styleName="header-social-share social-share"
            link={location.href}
            overlayPlacement={"bottom"}
          />
        </div>
        <div styleName="header-toolbar-related-entry" >
          <ArticleBoxSm entry={nextRelatedEntry} />
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

  renderArticle = () => {
    if (this.props.article && this.props.article.error) {
      return;
    }

    const { article } = this.props;
    return (
      <div>
        <div className="article-body" >
          <div className="article-container font-size5 content-width4 line-height4">
            <section
              className="article-reader-content"
              ref={ this.setArticleContentEl }>
            </section>
          </div>
        </div>
        <div className="text-center w-mb-7">
            <a
              href={article.link}
              title={article.title}
              className="btn btn-default"
              role="button"
              aria-label={tr.articleReadFromWebsite}
              target="_blank"
              styleName="article-control-btn"
            >
            <FontAwesome name="external-link" /> {' '}
            {tr.articleReadFromWebsite}
          </a>
        </div>
      </div>
    );
  }

  renderRelatedArticles = () => {
    const {relatedEntries} = this.props;
    return (
      <Row styleName="related-articles" >
        {map(relatedEntries, entry => (
          <Col sm={4} key={entry._id}>
            <ArticleBoxMd entry={entry}/>
          </Col>
        ))}
      </Row>
    );

  }

  renderFooter = () => {
    const {article} = this.props;

    return (
      <footer styleName="footer">
        <div>
          <div className="pull-left" >
            {this.renderBackButton()}
          </div>
          <div className="text-right">
            <SocialShare
              entryId={article.entryId._id}
              styleName="social-share"
              link={location.href}
              overlayPlacement={"top"}
            />
          </div>
        </div>
      </footer>
    );
  }

  renderLoading = () => {
    return (
      <div className="text-center">
        <img className="w-is-logo-loading" src={mongooseIcon} styleName="logo-loading" alt="Wiregoose" />
        <h4 className="w-text-loading" data-text={tr.loadingArticle}>
          {tr.loadingArticle}
        </h4>
      </div>
    );
  }

  renderError = () => {
    if (this.props.article && !this.props.article.error) {
      return;
    }
    const { article } = this.props;
    return (
      <div className="text-center" styleName="error">
        <h1>
          <FontAwesome name="newspaper-o" />
        </h1>
        <p className="lead">{tr.articleRedirectTitle}</p>
        <a
          href={article.link}
          title={article.title}
          className="btn btn-default"
          role="button"
          aria-label={tr.articleReadFromWebsite}
          target="_blank"
          styleName="article-control-btn"
        >
          <FontAwesome name="external-link" /> {' '}
          {tr.articleReadFromWebsite}
        </a>
      </div>
    );
  }

}
