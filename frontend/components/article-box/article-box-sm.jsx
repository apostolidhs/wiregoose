import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import FontAwesome from 'react-fontawesome';
import Media from 'react-bootstrap/lib/Media';
import Panel from 'react-bootstrap/lib/Panel';
import Image from 'react-bootstrap/lib/Image';

import CategoryImage from '../category/images.jsx';
import styles from './article-box.less';
import entryPropType from './entry-prop-type.js';
import ImageLoader from './article-image.jsx';
import { createLink, ellipsis } from '../utilities/text-utilities.js';
import {toArticleBox} from '../utilities/images-source.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ArticleBoxSm extends React.Component {
  static propTypes = {
    entry: PropTypes.shape(entryPropType)
  }

  render() {
    const {
      _id,
      title,
      image,
      category
    } = this.props.entry;

    const link = createLink(title, _id);

    return (
      <a className="blind-link" href={link} title={title}>
        <Panel styleName="article-box-sm-panel" >
          <Media>
            <Media.Left align="middle" >
              <ImageLoader src={toArticleBox(image)} title={title} showOnlyPlaceholder={!image} width={42} height={42} circle>
                <CategoryImage name={category} />
              </ImageLoader>
            </Media.Left>
            <Media.Body className="vertical-align-middle" >
              <p className="w-m-0 safe-wrap">
                {ellipsis(title, 60)}
              </p>
            </Media.Body>
            <Media.Right align="middle" >
              <FontAwesome name="chevron-right" />
            </Media.Right>
          </Media>
        </Panel>
      </a>
    );
  }
}
