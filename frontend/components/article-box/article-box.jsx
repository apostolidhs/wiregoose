import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';

import ArticlePlaceholderImage from './article-placeholder-image.jsx';
import FromNow from '../utilities/from-now.jsx';
import styles from './article-box.less';
import SocialShare from './social-share.jsx';
import ArticleBoxProps from './entry-prop-type.js';
import { createLink, createAbsoluteLink, ellipsis } from '../utilities/text-utilities.js';
import {toArticleBox} from '../utilities/images-source.js';
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
  articleStyleName = undefined;

  static propTypes = {
    entry: PropTypes.shape(ArticleBoxProps),
    showMockImage: PropTypes.bool,
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

  componentWillMount() {
    const { entry, showMockImage } = this.props;
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

    const showMockImageStyleName = showMockImage ? 'article-show-mock-image' : '';
    this.articleStyleName = `article ${this.articleSizeStyleName} ${showMockImageStyleName}`;
    this.style = undefined;

    if (!this.hasDescription) {
      this.style = {
        backgroundImage: `url(${toArticleBox(entry.image)})`
      };
    }
  }

  render() {
    const {
      entry,
      hideCategory,
      hideProvider,
      showMockImage,
      className= '',
      ...passDownProps
    } = this.props;

    return (
      <article
        className={className + ' panel panel-default'}
        styleName={this.articleStyleName}
        style={this.style}
      >
        { ((this.hasDescription && this.hasImage) || showMockImage) && (
          <Link to={this.articleLink} styleName="image">
            {(() => {
              if (showMockImage) {
                return (
                  <ArticlePlaceholderImage
                    category={entry.category}
                    provider={entry.provider}
                  />
                );
              } else {
                return (<img src={toArticleBox(entry.image)} alt="" />);
              }
            })()}
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
            <section styleName="summary" className="safe-wrap">
              {ellipsis(entry.description, this.isArticleFull ? 190 : 120)}
            </section>
          )}
          <footer styleName="footer" className="text-right">
            <SocialShare link={this.absoluteArticleLink}  selfContainer={true} />
          </footer>
        </div>
      </article>
    );
  }
}
