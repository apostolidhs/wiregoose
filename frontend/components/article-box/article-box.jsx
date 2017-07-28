import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import CSSModules from 'react-css-modules';

import styles from './article-box.less';
import { ellipsis } from '../text-utilities/text-utilities.js';
import ArticleBoxProps from './entry-prop-type.js';
import { createArticleLink } from './link-generator.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Entry extends React.Component {
  static propTypes = {
    entry: PropTypes.shape(ArticleBoxProps)
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
    return (
      <article className={className + ' panel panel-default'} styleName="article">
        <Link to={createArticleLink(entry)} styleName="image">
          <img src={entry.image} alt="" />
        </Link>
        <div className="panel-body">
          <header styleName="header">
            <Link to={createArticleLink(entry)} className="blind-link">
              <h3>
                {ellipsis(entry.title, 100)}
              </h3>
            </Link>
          </header>
          <div>
            <Link
              className="btn btn-link-muted w-p-0"
              to="article"
              role="button"
              title="Provider"
            >
              {entry.provider}
            </Link>
            <TimeAgo
              className="text-muted"
              styleName="dot-separator"
              date={entry.published}
              minPeriod={1}
            />
          </div>
          <section styleName="summary">
            {ellipsis(entry.description, 280)}
          </section>
          <footer styleName="footer">
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
