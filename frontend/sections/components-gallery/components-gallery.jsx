import _ from 'lodash';
import React from 'react';
import CSSModules from 'react-css-modules';

import ArticleBox from '../../components/article-box/article-box.jsx';
import Article from '../../components/article/article.jsx';
import styles from './components-gallery.less';

import entrySample from './entry-sample.js';
import articleSample from './article-sample.js';

@CSSModules(styles)
export default class ComponentsGallery extends React.Component {

  render() {
    const entryData = entrySample();
    const entryDataNoAuthor = _.omit(entrySample(), 'author');
    return (
      <div className="w-m">
        {/* <Article article={articleSample()} /> */}
        <ArticleBox entry={entryDataNoAuthor} style={{ width: '1200px' }} />
        {/* <ArticleBox entry={entryData} style={{ width: '320px' }} />
        <ArticleBox entry={entryDataNoAuthor} style={{ width: '480px' }} />
        <ArticleBox entry={entryDataNoAuthor} style={{ width: '768px' }} />
        <ArticleBox entry={entryDataNoAuthor} style={{ width: '992px' }} />
        <ArticleBox entry={entryDataNoAuthor} style={{ width: '1200px' }} /> */}
      </div>
    );
  }
}
