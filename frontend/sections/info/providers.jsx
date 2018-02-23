import map from 'lodash/map';
import upperCase from 'lodash/upperCase';
import React from 'react';

import tr from '../../components/localization/localization.js';
import { publish } from '../../components/events/events.jsx';
import Loader from '../../components/loader/loader.jsx';
import Info from './info.jsx';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';

import headerImage from '../../assets/img/option-menu-providers-bg.png';
import headerFooterImage from '../../assets/img/option-menu-providers-bg-footer.png';

export default class About extends React.Component {

  state = {
    providers: undefined
  }

  componentDidMount() {
    this.refs.providersLoad.promise = WiregooseApi.crud.retrieveAll('rssProvider')
      .then(resp => this.setState({ providers: resp.data.data.content }))
      .then(() => publish('page-ready', {
        title: tr.infoCreatorsTitle,
        description: tr.infoCreatorsDesc,
        keywords: tr.infoCreatorsTitle
      }));
  }

  render() {
    return (
      <Info headerImg={headerImage} headerFooterImg={headerFooterImage} >
        <h1>{tr.infoProviderTitle}</h1>
        <Loader ref="providersLoad">
          <div className="clearfix" styleName="providers" >
            {map(this.state.providers, p => (
              <a key={p._id} styleName="providers-item" href={p.link} target="_blank" >
                {upperCase(p.name)}
              </a>
            ))}
          </div>
        </Loader>
      </Info>
    );
  }
}
