import mapValues from 'lodash/mapValues';
import uniqBy from 'lodash/uniqBy';
import keys from 'lodash/keys';
import map from 'lodash/map';
import capitalize from 'lodash/capitalize';
import noop from 'lodash/noop';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Panel from 'react-bootstrap/lib/Panel';
import classnames from 'classnames';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import {CATEGORIES} from '../../../config-public.js';
import Loader from '../loader/loader.js';
import * as WiregooseApi from '../services/wiregoose-api.js';
import BrowserLanguageDetection from '../utilities/browser-language-detection.js';
import timeout from '../utilities/timeout.js';
import tr from '../localization/localization.js';
import ArticlePlaceholderImage from '../article-box/article-placeholder-image.js';
import CategoryImages from '../category/images.js';
import styles from './content-selector.less';
import {getInterest, syncInterests} from '../user/interests.js';
import interestProviderHOC from '../user/interest-provider-hoc';

@CSSModules(styles, {
  allowMultiple: true,
})
class CategoryItem extends React.Component {
  render() {
    const {
      interest,
      hasInterest,
      toggleInterest,
      onCategoryClick,
      enableInterests
    } = this.props;
    const {type, value, lang} = interest;

    const className = classnames('link', {
      'unselected-interest': enableInterests && !hasInterest,
      'selected-interest': enableInterests && hasInterest
    });

    return (
      <a
        href="#"
        styleName={className}
        className="btn btn-default"
        title={tr[value]}
        onClick={evt => {
          evt.preventDefault();
          if (enableInterests) {
            toggleInterest();
          }
          onCategoryClick(value);
        }} >
        <CategoryImages name={value} /> {tr[value]}
      </a>
    );
  }
}

@CSSModules(styles, {
  allowMultiple: true,
})
class ProviderItem extends React.Component {
  render() {
    const {
      interest,
      hasInterest,
      toggleInterest,
      onProviderClick,
      enableInterests
    } = this.props;
    const {type, value, lang} = interest;

    const className = classnames('link', {
      'unselected-interest': enableInterests && !hasInterest,
      'selected-interest': enableInterests && hasInterest
    });

    return (
      <a
        href="#"
        title={capitalize(value)}
        styleName={className}
        className="btn btn-default"
        onClick={evt => {
          evt.preventDefault();
          if (enableInterests) {
            toggleInterest();
          }
          onProviderClick(value);
        }} >
        {capitalize(value)}
      </a>
    );
  }
}

@CSSModules(styles, {
  allowMultiple: true,
})
class RegistrationItem extends React.Component {
  render() {
    const {
      interest,
      category,
      provider,
      hasInterest,
      toggleInterest,
      onCategoryByProviderClick,
      enableInterests
    } = this.props;
    const {type, value, lang} = interest;

    const className = classnames('link', {
      'unselected-interest': enableInterests && !hasInterest,
      'selected-interest': enableInterests && hasInterest
    });

    return (
      <a
        href="#"
        title={tr[category]}
        styleName={className}
        className="btn btn-default"
        onClick={evt => {
          evt.preventDefault();
          if (enableInterests) {
            toggleInterest();
          }
          const link = [provider, category, lang, value].join('-');
          onCategoryByProviderClick(link);
        }} >
        <CategoryImages name={category} /> {tr[category]}
      </a>
    );
  }
}

const InterestCategoryItem = interestProviderHOC(CategoryItem);
const InterestProviderItem = interestProviderHOC(ProviderItem);
const InterestRegistrationItem = interestProviderHOC(RegistrationItem);

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ContentSelector extends React.Component {

  static propTypes = {
    onCategoryClick: PropTypes.func,
    onProviderClick: PropTypes.func,
    onCategoryByProviderClick: PropTypes.func,
    enableInterests: PropTypes.bool
  }

  static defaultProps = {
    onCategoryClick: noop,
    onProviderClick: noop,
    onCategoryByProviderClick: noop,
  }

  state = {}

  componentDidMount() {
    if (this.props.enableInterests) {
      this.refs.interestsFetches.promise = timeout(() => syncInterests(), 200);
    }

    const lang = BrowserLanguageDetection();
    this.refs.registrationFetches.promise = timeout(() => {}, 200)
      .then(() => WiregooseApi.rssFeed.registrationFetches(lang, {cache: true}))
      .then(resp => timeout(() => resp, 0))
      .then(resp => {
        const categoriesPerProviders = mapValues(
          resp.data.data, regs => uniqBy(regs, reg => reg.category)
        );
        const providers = keys(categoriesPerProviders);
        this.setState({providers, categoriesPerProviders});
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.providers !== nextState.providers
      || this.state.categoriesPerProviders !== nextState.categoriesPerProviders;
  }

  getStyleName(type, value, lang) {
    const isInterested = getInterest(type, value, lang);
    return classnames('link', {
      'unselected-interest': !isInterested,
      'selected-interest': isInterested
    });
  }

  render() {
    const {
      onCategoryClick,
      onProviderClick,
      onCategoryByProviderClick,
      enableInterests
    } = this.props;

    const lang = BrowserLanguageDetection();

    return (
      <div className="content-selector" >
        <Loader ref="interestsFetches">
          <Panel>

            <h3 data-sticky-head={tr.categories}>{tr.categories}</h3>
            <Row>
              {map(CATEGORIES, cat =>
                <Col key={cat} className={'w-mb-14'} xs={6} sm={4} md={3} lg={2} >
                  <InterestCategoryItem
                    interest={{type: 'category', value: cat, lang}}
                    onCategoryClick={onCategoryClick}
                    enableInterests={enableInterests}
                  />
                </Col>
              )}
            </Row>

            <h3 data-sticky-head={tr.providers}>{tr.providers}</h3>
            <Loader ref="registrationFetches">
              <Row>
                {map(this.state.providers, p =>
                  <Col key={p} className={'w-mb-14'} xs={6} sm={4} md={3} lg={3} >
                    <InterestProviderItem
                      interest={{type: 'provider', value: p, lang}}
                      onProviderClick={onProviderClick}
                      enableInterests={enableInterests}
                    />
                  </Col>
                )}
              </Row>
            </Loader>

            <h3 data-sticky-head={tr.categoriesPerProvider} >{tr.categoriesPerProvider}</h3>
            <Loader ref="registrationFetches">
              {map(this.state.categoriesPerProviders, (cats, provider) =>
              <div key={provider}>
                <a href="#" title={capitalize(provider)} className="blind-link" onClick={evt => {
                    evt.preventDefault();
                    onProviderClick(provider);
                  }} >
                  <h4>{capitalize(provider)}</h4>
                </a>
                <Row>
                  {map(cats, ({category, total, _id}, idx) =>
                    <Col key={idx} className={'w-mb-14'} xs={6} sm={4} md={3} lg={2} >
                      <InterestRegistrationItem
                        interest={{type: 'registration', value: _id, lang}}
                        onCategoryByProviderClick={onCategoryByProviderClick}
                        enableInterests={enableInterests}
                        category={category}
                        provider={provider}
                      />
                    </Col>
                  )}
                </Row>
                </div>)}
            </Loader>

          </Panel>
        </Loader>
      </div>
    );
  }

}
