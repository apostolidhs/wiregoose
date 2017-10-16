import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import FontAwesome from 'react-fontawesome';

import CategoryImage from '../category/images.jsx';
import styles from './article-box.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ArticlePlaceholderImage extends React.Component {
  static propTypes = {
    category: PropTypes.string,
    provider: PropTypes.string
  }

  render() {
    const {
      category,
      provider
    } = this.props;

    return (
      <div styleName="mock-image" >
        <div styleName="mock-image-category">
          <CategoryImage name={category} />
        </div>
        <div styleName="mock-image-provider">
          {_.upperFirst(provider)}
        </div>
      </div>
    );
  }

}
