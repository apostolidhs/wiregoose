import React from 'react';

import tr from '../../components/localization/localization.js';
import Info from './info.jsx';
import headerImage from '../../assets/img/option-menu-about-bg.png';

export default class About extends React.Component {
  render() {
    return (
      <Info headerImg={headerImage} >
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
