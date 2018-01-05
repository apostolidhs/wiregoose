import React from 'react';

import tr from '../../components/localization/localization.js';
import { publish } from '../../components/events/events.jsx';
import Info from './info.jsx';
import headerImage from '../../assets/img/option-menu-about-bg.png';
import headerFooterImage from '../../assets/img/option-menu-about-bg-footer.png';

export default class About extends React.Component {

  componentDidMount() {
    publish('page-ready', {
      title: tr.infoAboutTitle,
      description: tr.infoAboutWiregoose,
      keywords: tr.infoAboutTitle
    });
  }

  render() {
    return (
      <Info headerImg={headerImage} headerFooterImg={headerFooterImage} >
        <h1>{tr.infoAboutTitle}</h1>
        <h2>{tr.infoAboutWiregoose}</h2>
        <p>{tr.infoAboutWiregooseDesc}</p>
        <h2>{tr.infoAboutWorking}</h2>
        <h3>{tr.infoAboutWorkingRss}</h3>
        <p>{tr.infoAboutWorkingRssDesc}</p>
        <p>{tr.infoAboutWorkingRssDescWiregoose}</p>
        <h3>{tr.infoAboutCrawler}</h3>
        <p dangerouslySetInnerHTML={{ __html: tr.infoAboutCrawlerDesc}}></p>
        <p dangerouslySetInnerHTML={{ __html: tr.infoAboutCrawlerDescMozilla}}></p>
      </Info>
    );
  }
}
