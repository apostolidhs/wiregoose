import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import FontAwesome from 'react-fontawesome';
import Media from 'react-bootstrap/lib/Media';
import Panel from 'react-bootstrap/lib/Panel';
import Image from 'react-bootstrap/lib/Image';
import { Link } from 'react-router';

import tr from '../localization/localization.js';
import FromNow from '../utilities/from-now.js';
import CategoryImage from '../category/images.js';
import ArticlePlaceholderImage from './article-placeholder-image.js';
import ImageLoader from './article-image.js';
import styles from './article-box.less';
import entryPropType from './entry-prop-type.js';
import { createLink, ellipsis } from '../utilities/text-utilities.js';
import {toArticleBox} from '../utilities/images-source.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ArticleBoxMd extends React.Component {
  static propTypes = {
    entry: PropTypes.shape(entryPropType)
  }

  render() {
    const {
      _id,
      title,
      image,
      category,
      provider,
      published
    } = this.props.entry;

    const link = createLink(title, _id);

    return (

      <div className="panel panel-default">
        <div className="thumbnail" styleName="article-box-md-panel">
          <a className="blind-link" href={link} title={title}>
            <ImageLoader src={toArticleBox(image)} title={title} showOnlyPlaceholder={!image}>
              <ArticlePlaceholderImage category={category} provider={provider} />
            </ImageLoader>
          </a>
          <div className="caption">
            <div styleName="dot-separator dot-separator-md">
              <Link
                className="btn btn-link-muted w-p-0"
                to={`/provider/${provider}`}
                role="button"
                title={tr.trFa('provider')}
                aria-label={tr.trFa('provider')}
              >
                {provider}
              </Link>
              <FromNow
                styleName="published"
                className="text-muted"
                date={published}
              />
            </div>
            <a className="blind-link" href={link} title={title}>
              <p className="safe-wrap">{ellipsis(title, 80)}</p>
            </a>
          </div>
        </div>
        </div>
    );
  }
}
