import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import CSSModules from 'react-css-modules';

import styles from './article-box.less';
import { ellipsis } from '../text-utilities/text-utilities.js';
import ArticleBoxProps from './entry-prop-type.js';
import { createLink } from '../text-utilities/text-utilities.js';

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
    const articleLink = createLink(entry)
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
                {ellipsis(entry.title, 100)}
              </h3>
            </Link>
          </header>
          <div>
            { !this.props.hideProvider &&
              <Link
                className="btn btn-link-muted w-p-0"
                styleName="dot-separator"
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
            {ellipsis(entry.description, 280)}
          </section>
          <footer styleName="footer" className="text-right">
            <a
              className="btn btn-link blind-link"
              href="/"
              role="button"
              title="Link"
            >
              <FontAwesome name="link" />
            </a>
            <a
              className="btn btn-link blind-link"
              href="/"
              role="button"
              title="Facebook"
            >
              <FontAwesome name="facebook" />
            </a>
            <a
              className="btn btn-link blind-link"
              href="/"
              role="button"
              title="Twitter"
            >
              <FontAwesome name="twitter" />
            </a>
          </footer>
        </div>
      </article>
    );
  }
}
