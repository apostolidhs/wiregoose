import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, Button, Collapse }
  from 'react-bootstrap';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import FontAwesome from 'react-fontawesome';

import Loader from '../loader/loader.jsx';
import * as WiregooseApi from '../services/wiregoose-api.js';
import * as Pallet from '../colors/pallet.js';
import ShadeColor from '../colors/shade.js'

export default class SucceededFetchesPerPeriod extends React.Component {

  state = {
    categories: [],
    supportedLanguages: [],
    selectedLang: 'en',
    selectedPeriod: 30,
    entriesPerCategory: undefined,
    providers: undefined,
    charts: undefined
  }

  static periods = [
    {
      name: '7 days',
      value: 7
    },
    {
      name: '15 days',
      value: 15
    },
    {
      name: '1 month',
      value: 30
    },
    {
      name: '3 months',
      value: 30 * 3
    },
    {
      name: '6 months',
      value: 30 * 6
    },
    {
      name: '1 year',
      value: 30 * 12
    }
  ]

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    const getStatic = (name) =>
      WiregooseApi.statics[name]()
        .then(resp => this.setState({ [name]: resp.data.data }));

    const prms = Promise.all(
      ['categories', 'supportedLanguages'].map(getStatic)
    ).then(() => this.fetchMeasures());
    this.refs.load.promise = prms;
  }

  fetchMeasures = (e) => {
    e && e.preventDefault();
    const { selectedLang, selectedPeriod } = this.state;
    this.setState({
      charts: undefined,
      providers: undefined,
      payload: undefined
    });
    this.refs.load.promise = WiregooseApi.getSucceededFetchesPerPeriod(
      selectedPeriod,
      selectedLang
    ).then(resp => {
      const { chart, providers } = resp.data.data;
      if (!_.isEmpty(chart)) {
        const charts = this.groupMeasuresByCategory(chart);
        const colors = Pallet.createSample(_.size(providers));
        const providerInfo = _.map(
          providers,
          (name, idx) => ({ name, color: ShadeColor(colors[idx].color, 0.5) })
        );
        const payload = this.calculateChartLegendPayload(charts, providerInfo);
        this.setState({
          charts,
          payload,
          providers: providerInfo
        });
      }
    });
  }

  calculateChartLegendPayload = (charts, providerInfo) => {
    const chartsByCategory = _.keyBy(charts, 'name');
    return _.transform(this.state.categories, (payload, category) => {
      payload[category] = _.map(providerInfo, provider => {
        const sum = _.sumBy(
          chartsByCategory[category].data,
          byProviders => byProviders[provider.name]
        );
        return {
          id: provider.name,
          value: `${provider.name} ${sum || 0}`,
          type: 'circle', color: provider.color
        };
      });
    }, {});
  }

  groupMeasuresByCategory = (chart) => {
    return _.map(this.state.categories, category => {
      const data = _.map(
        chart,
        (providersByCategory, period) => ({
          period: +period,
          ...providersByCategory[category]
        })
      );
      const sum = _.sumBy(
        data,
        providers => _(providers)
                      .omit('period')
                      .values()
                      .sum()
      );
      return {
        data,
        sum,
        name: category
      };
    });
  }

  render() {
    return (
      <Loader ref="load">
        <Row>
          <Col xs={12}>
            <Form inline className="text-right">
              <FormGroup controlId="formIdLang">
                <ControlLabel>Lang</ControlLabel>
                {' '}
                <FormControl
                  componentClass="select"
                  placeholder="lang"
                  name="selectedLang"
                  value={this.state.selectedLang}
                  onChange={this.handleInputChange}
                  required>
                  {_.map(this.state.supportedLanguages, supportedLanguage => (
                    <option key={supportedLanguage} value={supportedLanguage}>{supportedLanguage}</option>
                  ))}
                </FormControl>
              </FormGroup>
              {' '}
              <FormGroup controlId="formIdPeriod" className="w-ml-7">
                <ControlLabel>Period</ControlLabel>
                {' '}
                <FormControl
                  componentClass="select"
                  placeholder="period"
                  name="selectedPeriod"
                  value={this.state.selectedPeriod}
                  onChange={this.handleInputChange}
                  required>
                  {_.map(SucceededFetchesPerPeriod.periods, period => (
                    <option key={period.name} value={period.value}>{period.name}</option>
                  ))}
                </FormControl>
              </FormGroup>
              {' '}
              <Button type="submit" bsStyle="primary" className="w-ml-7" onClick={this.fetchMeasures}>
                <FontAwesome name="search" /> Search
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          {(() => {
            if (_.isEmpty(this.state.charts)) {
              return (
                <Col md={6}>
                  <p className="legent">No results.</p>
                </Col>
              );
            } else {
              return _.map(this.state.charts, chart => (
                <Col md={6} key={chart.name}>
                  <h4>{chart.name}, <span className="text-muted">{chart.sum} entries</span></h4>
                  {this.renderChart(chart.data, this.state.providers, this.state.payload[chart.name])}
                </Col>
              ));
            }
          })()}
        </Row>
      </Loader>
    );
  }

  renderChart = (chartData, providers, payload) => {
  	return (
    	<LineChart width={400} height={300} data={chartData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}} >
       <XAxis dataKey="period" />
       <YAxis />
       <CartesianGrid strokeDasharray="3 3" />
       <Tooltip />
       <Legend align="right" layout="vertical" verticalAlign="middle" iconSize={12} payload={payload} />
        {_.map(providers, provider => (
          <Line key={provider.name} type="monotone" dataKey={provider.name} stroke={provider.color} />
        ))}
      </LineChart>
    );
  }
}
