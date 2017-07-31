import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';

import styles from './tag.less';
import { createLink } from '../text-utilities/text-utilities.js';

@CSSModules(styles, {
  allowMultiple: true
})
export default class Tag extends React.Component {

  static propTypes = {
    registration: PropTypes.shape({
      category: PropTypes.string,
      provider: PropTypes.string,
      lang: PropTypes.string,
      _id: PropTypes.string
    }),
  }

  render() {
    const { category, provider, lang, _id } = this.props.registration;
    const linkName = [category, provider, lang].join(' ');
    const registrationLink = createLink(linkName, _id);

    return (
      <Link
        to={`/registration/${registrationLink}`}
        className="btn btn-default"
        styleName="tag"
        role="button"
        title={`${provider} ${category}`} >
        <p>{ provider }</p>
        <small className="text-muted">{ category }</small>
      </Link>
    );
  }

}
