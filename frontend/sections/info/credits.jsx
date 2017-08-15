import React from 'react';
import FontAwesome from 'react-fontawesome';

import tr from '../../components/localization/localization.js';
import { publish } from '../../components/events/events.js';
import Info from './info.jsx';
import headerImage from '../../assets/img/option-menu-creators-bg.png';
import headerFooterImage from '../../assets/img/option-menu-creators-bg-footer.png';

export default class About extends React.Component {

  componentDidMount() {
    publish('page-ready', {
      title: tr.infoCreatorsTitle,
      description: tr.infoCreatorsDesc,
      keywords: tr.infoCreatorsTitle
    });
  }

  render() {
    return (
      <Info headerImg={headerImage} headerFooterImg={headerFooterImage} >
        <h1>{tr.infoCreatorsTitle}</h1>

        <p styleName="credit-contact" className="text-center">
          <a styleName="credit-contact-item" href="mailto:giannhs.apostolidhs@gmail.com" target="_blank" title="Email Me" >
            <FontAwesome name="envelope" />
          </a>
          <a styleName="credit-contact-item" href="https://www.linkedin.com/in/giannisapostolidis" target="_blank" title="Linkedin" >
            <FontAwesome name="linkedin-square" />
          </a>
        </p>

        <blockquote className="text-center">
          <p className="lead" styleName="p-lead" dangerouslySetInnerHTML={{ __html: tr.infoCreatorsDesc}}></p>
        </blockquote>
      </Info>
    );
  }
}
