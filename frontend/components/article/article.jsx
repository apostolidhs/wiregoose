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
      createdAt: PropTypes.instanceOf(Date),
      lastHit: PropTypes.instanceOf(Date),
      hits: PropTypes.number
    })
  }

  render() {

  }

}
