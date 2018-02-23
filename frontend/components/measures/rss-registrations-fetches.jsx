import map from 'lodash/map';
import keys from 'lodash/keys';
import mapValues from 'lodash/mapValues';
import sortBy from 'lodash/sortBy';
import pick from 'lodash/pick';
import filter from 'lodash/filter';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import sumBy from 'lodash/sumBy';
import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Badge, Row, Col }
  from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import Select from 'react-select';

import { CATEGORIES } from '../../../config-public.js';
import styles from './measures.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class RssRegistrationFetches extends React.Component {

  static propTypes = {
    registrationsFetches: PropTypes.shape()
  };

  state = {
    activeRegistrations: undefined,
    providers: undefined,
    searchedProvider: undefined,
    searchedCategory: undefined
  }

  componentWillReceiveProps = ({ registrationsFetches }) => {
    const providers = map(keys(registrationsFetches), reg => ({ label: reg, value: reg }));
    const categories = map(CATEGORIES, cat => ({ label: cat, value: cat }));
    const activeRegistrations = mapValues(registrationsFetches, fetches => sortBy(fetches, f => -f.total));
    this.setState({
      providers,
      categories,
      activeRegistrations
    });
  }

  updateProviders = (searchedProvider) => {
    this.setState({searchedProvider}, this.updateActiveRegistrations);
  }

  updateCategories = (searchedCategory) => {
    this.setState({searchedCategory}, this.updateActiveRegistrations);
  }

  updateActiveRegistrations = () => {
    const { searchedProvider, searchedCategory } = this.state;
    const { registrationsFetches } = this.props;
    const activeProviders = searchedProvider ? pick(registrationsFetches, searchedProvider.value) : registrationsFetches;
    let activeCategories = searchedCategory
      ? mapValues(activeProviders, registrations => filter(registrations, registration => registration.category === searchedCategory.value))
      : activeProviders;
    activeCategories = pickBy(activeCategories, regs => !isEmpty(regs));
    this.setState({ activeRegistrations: activeCategories });
  }

  render() {
    return (
      <section>
        <div>
          <h3>Fetches per Provider</h3>
          <Row>
            <Col mdOffset={6} md={3} styleName="reg-fetches-filter" >
              <Select
                placeholder="Provider.."
                name="provider"
                options={this.state.providers}
                value={this.state.searchedProvider}
                onChange={this.updateProviders}
              />
            </Col>
            <Col md={3} styleName="reg-fetches-filter" >
              <Select
                placeholder="Category.."
                name="category"
                options={this.state.categories}
                value={this.state.searchedCategory}
                onChange={this.updateCategories}
              />
            </Col>
          </Row>
        </div>
        <ListGroup styleName="reg-fetches-list">
          {this.renderListItems()}
        </ListGroup>
      </section>
    );
  }

  renderListItems = () => {
    return flatten(
      map(this.state.activeRegistrations, (registrations, provider) => {

        const totalEntries = sumBy(registrations, 'total');
        const content = map(registrations, (registration) => (
          <ListGroupItem key={encodeURIComponent(registration.link)}>
            <span styleName="reg-fetches-content-title">{registration.category}</span>
            <Badge styleName="reg-fetches-content-badge">{registration.total}</Badge>
            <a href={registration.link} styleName="reg-fetches-content-link" target="_blank" >{registration.link}</a>
          </ListGroupItem>
        ));

        const header = [
          <ListGroupItem key={provider} bsStyle="success" >
            <span styleName="reg-fetches-title" >{provider}</span>
            <Badge styleName="reg-fetches-title-badge">{totalEntries}</Badge>
          </ListGroupItem>
        ];

        return header.concat(content);
      }));
  }

}
