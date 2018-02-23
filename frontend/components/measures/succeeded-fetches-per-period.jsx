import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import keyBy from 'lodash/keyBy';
import transform from 'lodash/transform';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import flow from 'lodash/fp/flow';
import omit from 'lodash/fp/omit';
import values from 'lodash/fp/values';
import sum from 'lodash/fp/sum';

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, Button, Collapse }
  from 'react-bootstrap';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import styles from './measures.less';
import Loader from '../loader/loader.jsx';
import * as WiregooseApi from '../services/wiregoose-api.js';
import * as Pallet from '../colors/pallet.js';
import ShadeColor from '../colors/shade.js'
import { SUPPORTED_LANGUAGES, CATEGORIES } from '../../../config-public.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class SucceededFetchesPerPeriod extends React.Component {

  state = {
    selectedLang: 'gr',
    selectedPeriod: 15,
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
    this.fetchMeasures();
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
      if (!isEmpty(chart)) {
        const charts = this.groupMeasuresByCategory(chart);
        const colors = Pallet.createSample(size(providers));
        const providerInfo = map(
          providers,
          (name, idx) => ({ name, color: ShadeColor(colors[idx].color, -0.2) })
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
    const chartsByCategory = keyBy(charts, 'name');
    return transform(CATEGORIES, (payload, category) => {
       const legends = map(providerInfo, provider => {
        const sum = sumBy(
          chartsByCategory[category].data,
          byProviders => byProviders[provider.name]
        );
        return {
          sum,
          id: provider.name,
          value: `${provider.name} ${sum || 0}`,
          type: 'circle', color: provider.color
        };
      });
      payload[category] = sortBy(legends, legend => -legend.sum);
    }, {});
  }

  groupMeasuresByCategory = (chart) => {
    return map(CATEGORIES, category => {
      const data = map(
        chart,
        (providersByCategory, period) => ({
          period: +period,
          ...providersByCategory[category]
        })
      );
      const sum = sumBy(
        data,
        providers => flow(omit('period'), values(), sum())(providers)
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
                  {map(SUPPORTED_LANGUAGES, supportedLanguage => (
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
                  {map(SucceededFetchesPerPeriod.periods, period => (
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
        <Row className="w-mt-7" styleName="provider-chart-container" >
          {(() => {
            if (isEmpty(this.state.charts)) {
              return (
                <Col xs={12}>
                  <p className="legent">No results.</p>
                </Col>
              );
            } else {
              return map(this.state.charts, chart => (
                <Col xs={12} key={chart.name} styleName="provider-chart" >
                  <h4>
                    {chart.name}, {' '}
                    <span className="text-muted">{chart.sum} entries</span>
                  </h4>
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
      <ResponsiveContainer height={250} >
        <LineChart
          data={chartData}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="period" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend verticalAlign="bottom" align="left" iconSize={12} payload={payload} />
          {map(providers, provider => (
            <Line key={provider.name} type="monotone" dataKey={provider.name} stroke={provider.color} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
