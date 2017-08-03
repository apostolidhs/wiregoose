import React from 'react';
import FontAwesome from 'react-fontawesome';

import Info from './info.jsx';
import headerImage from '../../assets/img/option-menu-creators-bg.png';

export default class About extends React.Component {
  render() {
    return (
      <Info headerImg={headerImage} >
        <h1>Creators</h1>

        <p styleName="credit-contact" className="text-center">
          <a styleName="credit-contact-item" href="mailto:giannhs.apostolidhs@gmail.com" target="_blank" title="Email Me" >
            <FontAwesome name="envelope" />
          </a>
          <a styleName="credit-contact-item" href="https://www.linkedin.com/in/giannisapostolidis" target="_blank" title="Linkedin" >
            <FontAwesome name="linkedin-square" />
          </a>
        </p>

        <blockquote className="text-center">
          <p className="lead">
            Inspired, Designed, Developed by <em>John Apostolidis</em>
          </p>
        </blockquote>
      </Info>
    );
  }
}
