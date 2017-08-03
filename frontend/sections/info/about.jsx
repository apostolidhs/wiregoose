import React from 'react';

import Info from './info.jsx';
import headerImage from '../../assets/img/option-menu-about-bg.png';

export default class About extends React.Component {
  render() {
    return (
      <Info headerImg={headerImage} >
        <h1>About</h1>
        <h2>What is Wiregoose</h2>
        <p>Wiregoose is an online news transmitter, bringing news in your screen from all over the world, adapted in your country in allmost real time.</p>
        <h2>How is it working</h2>
        <h3>Rss feeds</h3>
        <p>RSS (Rich Site Summary) is a format for delivering regularly changing web content. Many news-related sites, weblogs and other online publishers syndicate their content as an RSS Feed to whoever wants it.</p>
        <p>Wiregoose is connected with the media by their RSS feeds. We respect the resource by marking the provider name in each entry.</p>
        <h3>Article extractor</h3>
        <p>
          In order to optimize the article reading experience, Wiregoose is using a <b>custom article extractor</b>.
          We extract only the article’s content, removing all the unnecessary content, like ads, side menus, etc.
          We optimizing the readability of the article and we offer it to you.
        </p>
        <p>
          Internally, we use the <a href="https://github.com/mozilla/readability" target="_blank">Mozilla Firefox Reader View</a>.
        </p>
      </Info>
    );
  }
}
