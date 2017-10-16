import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import FontAwesome from 'react-fontawesome';
import { Media, Panel, Image } from 'react-bootstrap';

import CategoryImage from '../category/images.jsx';
import styles from './article-box.less';
import entryPropType from './entry-prop-type.js';
import { createLink, ellipsis } from '../utilities/text-utilities.js';

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
              {
                image
                  ? <Image width={42} height={42} src={image} circle />
                  : <CategoryImage name={category} />
              }
            </Media.Left>
            <Media.Body className="vertical-align-middle" >
              <p className="w-m-0" >
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
