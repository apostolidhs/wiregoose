import React from 'react';
import PropTypes from 'prop-types';
import validateURL from 'react-proptypes-url-validator';

import entryPropType from '../article-box/entry-prop-type.js';

export default class Article extends React.Component {

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

  render() {
    const { article, isLoading } = this.props;

    return (
      <div className="article-body light sans-serif loaded">
         <div className="article-container container font-size5 content-width3">
          <article className="article-reader-content line-height4">
            <header>

            </header>
            { !isLoading && article &&
              <section dangerouslySetInnerHTML={{__html: article.content}}></section>
            }

          </article>
        </div>
      </div>
    );
  }

}
