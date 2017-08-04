import React from 'react';

import tr from '../../components/localization/localization.js';
import { publish } from '../../components/events/events.js';
import Loader from '../../components/loader/loader.jsx';
import Info from './info.jsx';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';

import headerImage from '../../assets/img/option-menu-providers-bg.png';

export default class About extends React.Component {

  state = {
    providers: undefined
  }

  componentDidMount() {
    this.refs.providersLoad.promise = WiregooseApi.crud.retrieveAll('rssProvider')
      .then(resp => this.setState({ providers: resp.data.data.content }));
  }

  componentDidMount() {
    publish('page-ready', {
      title: tr.infoCreatorsTitle,
      description: tr.infoCreatorsDesc,
      keywords: tr.infoCreatorsTitle
    });
  }

  render() {
    return (
      <Info headerImg={headerImage} >
        <h1>{tr.infoProviderTitle}</h1>
        <Loader ref="providersLoad">
          <div className="clearfix" styleName="providers" >
            {_.map(this.state.providers, p => (
              <a key={p._id} styleName="providers-item" href={p.link} target="_blank" >
                {p.name}
              </a>
            ))}
          </div>
        </Loader>
      </Info>
    );
  }
}
