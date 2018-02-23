import mapValues from 'lodash/mapValues';
import uniqBy from 'lodash/uniqBy';
import keys from 'lodash/keys';
import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Panel, Row, Col, Button } from 'react-bootstrap';
import {CATEGORIES} from '../../../config-public.js';
import Loader from '../../components/loader/loader.jsx';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';
import BrowserLanguageDetection from '../../components/utilities/browser-language-detection.js';

import tr from '../localization/localization.js';
import ArticlePlaceholderImage from '../article-box/article-placeholder-image.jsx';
import CategoryImages from '../category/images.jsx';
import styles from './content-selector.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ContentSelector extends React.Component {

  static propTypes = {
    onCategoryClick: PropTypes.func.isRequired,
    onProviderClick: PropTypes.func.isRequired,
    onCategoryByProviderClick: PropTypes.func.isRequired
  }

  state = {}

  componentDidMount() {
    const lang = BrowserLanguageDetection();
    this.refs.registrationFetches.promise = WiregooseApi.rssFeed.registrationFetches(lang, {cache: true})
      .then(resp => {
        const categoriesPerProviders = mapValues(
          resp.data.data, regs => uniqBy(regs, reg => reg.category)
        );
        const providers = keys(categoriesPerProviders);
        this.setState({providers, categoriesPerProviders});
      });
  }

  render() {
    const {
      onCategoryClick,
      onProviderClick,
      onCategoryByProviderClick
    } = this.props;

    return (
      <div className="content-selector" >
        <Panel>

          <h3 data-sticky-head={tr.categories}>{tr.categories}</h3>
          <Row>
            {map(CATEGORIES, cat =>
              <Col key={cat} className={'w-mb-14'} xs={6} sm={4} md={3} lg={2} >
                <a
                  href="#"
                  styleName="link"
                  className="btn btn-default"
                  onClick={evt => {
                    evt.preventDefault();
                    onCategoryClick(cat);
                  }} >
                  <CategoryImages name={cat} /> {tr[cat]}
                </a>
              </Col>
            )}
          </Row>

          <h3 data-sticky-head={tr.providers}>{tr.providers}</h3>
          <Loader ref="registrationFetches">
            <Row>
              {map(this.state.providers, p =>
                <Col key={p} className={'w-mb-14'} xs={6} sm={4} md={3} lg={3} >
                  <a
                    href="#"
                    styleName="link"
                    className="btn btn-default"
                    onClick={evt => {
                      evt.preventDefault();
                      onProviderClick(p);
                    }} >
                    {capitalize(p)}
                  </a>
                </Col>
              )}
            </Row>
          </Loader>

          <h3 data-sticky-head={tr.categoriesPerProvider} >{tr.categoriesPerProvider}</h3>
          <Loader ref="registrationFetches">
            {map(this.state.categoriesPerProviders, (cats, provider) =>
            <div key={provider}>
              <a href="#" className="blind-link" onClick={evt => {
                  evt.preventDefault();
                  onProviderClick(provider);
                }} >
                <h4>{capitalize(provider)}</h4>
              </a>
              <Row>
                {map(cats, ({category, total, _id}, idx) =>
                  <Col key={idx} className={'w-mb-14'} xs={6} sm={4} md={3} lg={2} >
                    <a
                      href="#"
                      styleName="link"
                      className="btn btn-default"
                      onClick={evt => {
                        evt.preventDefault();
                        const lang = BrowserLanguageDetection();
                        const link = [provider, category, lang, _id].join('-');
                        onCategoryByProviderClick(link);
                      }} >
                      <CategoryImages name={category} /> {tr[category]}
                    </a>
                  </Col>
                )}
              </Row>
              </div>)}
          </Loader>

        </Panel>
      </div>
    );
  }

}
