import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';
import { FacebookButton, TwitterButton } from 'react-social';
import { OverlayTrigger, Popover, Button, FormControl } from 'react-bootstrap';

import { FACEBOOK_APP_ID } from '../../../config-public.js';
import FromNow from '../utilities/from-now.jsx';
import styles from './article-box.less';
import { ellipsis } from '../utilities/text-utilities.js';
import ArticleBoxProps from './entry-prop-type.js';
import { createLink, createAbsoluteLink } from '../utilities/text-utilities.js';
import tr from '../localization/localization.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Entry extends React.Component {

  style = undefined;
  articleLink = undefined;
  absoluteArticleLink = undefined;
  hasImage = undefined;
  hasDescription = undefined;
  isArticleFull = false;
  articleSizeStyleName = '';

  static propTypes = {
    entry: PropTypes.shape(ArticleBoxProps),
    hideCategory: PropTypes.bool,
    hideProvider: PropTypes.bool
  }

  static defaultProps = {
    entry: {
      title: undefined,
      image: undefined,
      description: undefined,
      published: undefined,
      link: undefined,
      author: undefined,
      provider: undefined,
      category: undefined,
    }
  }

  componentWillReceiveProps = () => {
    const { entry } = this.props;
    this.articleLink = createLink(entry.title, entry._id);
    this.absoluteArticleLink = createAbsoluteLink(this.articleLink);

    this.hasImage = entry.boxSize !== 'ARTICLE_BOX_NO_IMAGE';
    this.hasDescription = entry.boxSize !== 'ARTICLE_BOX_NO_DESCRIPTION';
    this.isArticleFull = false;

    if (!this.hasImage) {
      this.articleSizeStyleName = 'article-no-image';
    } else if (!this.hasDescription) {
      this.articleSizeStyleName = 'article-no-description';
    } else {
      this.articleSizeStyleName = 'article-full';
      this.isArticleFull = true;
    }

    this.styleName = `article ${this.articleSizeStyleName}`;
    this.style = undefined;

    if (!this.hasDescription) {
      this.style = {
        backgroundImage: `url(${entry.image})`
      };
    }
  }
  /* <div styleName="image-mock-loader">
    <FontAwesome name="futbol-o" />
  </div> */
  render() {
    const {
      entry,
      hideCategory,
      hideProvider,
      className= '',
      ...passDownProps
    } = this.props;

    return (
      <article
        className={className + ' panel panel-default'}
        styleName={this.styleName}
        style={this.style}
      >
        { this.hasDescription && this.hasImage && (
          <Link to={this.articleLink} styleName="image">
            <img src={entry.image} alt="" />
          </Link>
        )}
        { !hideCategory &&
          <Link
            to={`/category/${entry.category}`}
            role="button"
            title={tr.trFa('category')}
            className="btn"
            styleName="category"
          >
            {tr[entry.category]}
          </Link>
        }
        <div className="panel-body">
          <header styleName="header">
            <Link to={this.articleLink} className="blind-link">
              <h3>
                {ellipsis(entry.title, 70)}
              </h3>
            </Link>
          </header>
          <div styleName="dot-separator">
            { !hideProvider &&
              <Link
                className="btn btn-link-muted w-p-0"
                to={`/provider/${entry.provider}`}
                role="button"
                title={tr.trFa('provider')}
              >
                {entry.provider}
              </Link>
            }
            <FromNow
              styleName="published"
              className="text-muted"
              date={entry.published}
            />
          </div>
          { this.hasDescription && (
            <section styleName="summary">
              {ellipsis(entry.description, this.isArticleFull ? 190 : 120)}
            </section>
          )}
          {this.renderFooter()}
        </div>
      </article>
    );
  }

  focusOnShareArticlePopover = (rootEl) => {
    const inputEl = rootEl.getElementsByTagName('input')[0];
    inputEl.focus();
    inputEl.select();
  }

  renderShareLinkPopover = () => {
    return (
      <Popover id="popover-copy-article-link">
        <h4>{tr.articleLink}</h4>
        <FormControl type="text" defaultValue={this.absoluteArticleLink} readOnly />
      </Popover>
    );
  }

  renderFooter = () => {
    return (
      <footer styleName="footer" className="text-right">
        <OverlayTrigger
          onEntered={this.focusOnShareArticlePopover}
          trigger="click"
          placement="top"
          overlay={this.renderShareLinkPopover()}
          container={this}
          rootClose
        >
          <Button className="btn btn-link blind-link" title={tr.shareLink} >
            <FontAwesome name="link" />
          </Button>
        </OverlayTrigger>
        <FacebookButton
          className="btn btn-link blind-link"
          url={this.absoluteArticleLink}
          appId={FACEBOOK_APP_ID}
          title={tr.shareOnFacebook}
        >
          <FontAwesome name="facebook" />
        </FacebookButton>
        <TwitterButton
          className="btn btn-link blind-link"
          url={this.absoluteArticleLink}
          title={tr.shareOnTwitter}
        >
          <FontAwesome name="twitter" />
        </TwitterButton>
      </footer>
    );
  }
}
