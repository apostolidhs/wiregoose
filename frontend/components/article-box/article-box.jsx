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
  /* <div styleName="image-mock-loader">
    <FontAwesome name="futbol-o" />
  </div> */
  render() {
    const { entry, className= '', ...passDownProps } = this.props;
    const articleLink = createLink(entry.title, entry._id);
    const absoluteArticleLink = createAbsoluteLink(articleLink);

    const hasImage = entry.boxSize !== 'ARTICLE_BOX_NO_IMAGE';
    const hasDescription = false && entry.boxSize !== 'ARTICLE_BOX_NO_DESCRIPTION';
    let isArticleFull = false;
    let articleSizeStyleName;
    if (!hasImage) {
      articleSizeStyleName = 'article-no-image';
    } else if (!hasDescription) {
      articleSizeStyleName = 'article-no-description';
    } else {
      articleSizeStyleName = 'article-full';
      isArticleFull = true;
    }
    const styleName = `article ${articleSizeStyleName}`;
    return (
      <article className={className + ' panel panel-default'} styleName={styleName}>
        { hasImage && (
          <Link to={articleLink} styleName="image">
            <img src={entry.image} alt="" />
          </Link>
        )}
        { !this.props.hideCategory &&
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
            <Link to={articleLink} className="blind-link">
              <h3>
                {ellipsis(entry.title, 70)}
              </h3>
            </Link>
          </header>
          <div styleName="dot-separator">
            { !this.props.hideProvider &&
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
          { hasDescription && (
            <section styleName="summary">
              {ellipsis(entry.description, isArticleFull ? 190 : 120)}
            </section>
          )}
          <footer styleName="footer" className="text-right">
            <OverlayTrigger
              onEntered={this.focusOnShareArticlePopover}
              trigger="click"
              placement="top"
              overlay={this.renderShareLinkPopover(absoluteArticleLink)}
              container={this}
              rootClose
            >
              <Button className="btn btn-link blind-link" title={tr.shareLink} >
                <FontAwesome name="link" />
              </Button>
            </OverlayTrigger>
            <FacebookButton
              className="btn btn-link blind-link"
              url={absoluteArticleLink}
              appId={FACEBOOK_APP_ID}
              title={tr.shareOnFacebook}
            >
              <FontAwesome name="facebook" />
            </FacebookButton>
            <TwitterButton
              className="btn btn-link blind-link"
              url={absoluteArticleLink}
              title={tr.shareOnTwitter}
            >
              <FontAwesome name="twitter" />
            </TwitterButton>
          </footer>
        </div>
      </article>
    );
  }

  focusOnShareArticlePopover = (rootEl) => {
    const inputEl = rootEl.getElementsByTagName('input')[0];
    inputEl.focus();
    inputEl.select();
  }

  renderShareLinkPopover = (absoluteArticleLink) => {
    return (
      <Popover id="popover-copy-article-link">
        <h4>{tr.articleLink}</h4>
        <FormControl type="text" defaultValue={absoluteArticleLink} readOnly />
      </Popover>
    );
  }
}
