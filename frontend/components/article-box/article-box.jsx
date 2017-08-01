import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import CSSModules from 'react-css-modules';
import { FacebookButton, TwitterButton } from 'react-social';
import { OverlayTrigger, Popover, Button, FormControl } from 'react-bootstrap';

import { FACEBOOK_APP_ID } from '../../config.js';
import styles from './article-box.less';
import { ellipsis } from '../text-utilities/text-utilities.js';
import ArticleBoxProps from './entry-prop-type.js';
import { createLink, createAbsoluteLink } from '../text-utilities/text-utilities.js';

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

  render() {
    const { entry, className= '', ...passDownProps } = this.props;
    const articleLink = createLink(entry.title, entry._id);
    const absoluteArticleLink = createAbsoluteLink(articleLink);
    return (
      <article className={className + ' panel panel-default'} styleName="article">
        <Link to={articleLink} styleName="image">
          <img src={entry.image} alt="" />
        </Link>
        { !this.props.hideCategory &&
          <Link
            to={`/category/${entry.category}`}
            role="button"
            title="Category"
            className="btn"
            styleName="category"
          >
            {entry.category}
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
                title="Provider"
              >
                {entry.provider}
              </Link>
            }
            <TimeAgo
              className="text-muted"
              date={entry.published}
              minPeriod={1}
            />
          </div>
          <section styleName="summary">
            {ellipsis(entry.description, 190)}
          </section>
          <footer styleName="footer" className="text-right">
            <OverlayTrigger
              onEntered={this.focusOnShareArticlePopover}
              trigger="click"
              placement="top"
              overlay={this.renderShareLinkPopover(absoluteArticleLink)}
              container={this}
              rootClose
            >
              <Button className="btn btn-link blind-link" title="Article Link" >
                <FontAwesome name="link" />
              </Button>
            </OverlayTrigger>
            <FacebookButton
              className="btn btn-link blind-link"
              url={absoluteArticleLink}
              appId={FACEBOOK_APP_ID}
              title="Share on Facebook"
            >
              <FontAwesome name="facebook" />
            </FacebookButton>
            <TwitterButton
              className="btn btn-link blind-link"
              url={absoluteArticleLink}
              title="Share on Twitter"
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
        <h4>Share Article</h4>
        <FormControl type="text" defaultValue={absoluteArticleLink} readOnly />
      </Popover>
    );
  }
}
