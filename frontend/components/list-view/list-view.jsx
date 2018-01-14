import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn }
  from 'react-bootstrap-table';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import * as Notifications from '../notifications/notifications.jsx';
import Loader from '../loader/loader.jsx';
import { toUppercasesWords }
  from '../utilities/text-utilities.js';
import * as WiregooseApi from '../services/wiregoose-api.js';

export default class ListView extends React.Component {
  state = {
    params: {
      page: 1,
      count: 10,
      sortBy: undefined,
      asc: undefined
    },
    total: 0,
    records: [],
    isCreationPanelOpen: false,
    lastEffectedId: undefined
  };

  constructor({ modelName, columns, title, form, defaultSort = {}, mutable = true, transformation = _.identity }) {
    super();
    this.modelName = modelName;
    this.columns = columns;
    this.title = title;
    this.form = form;
    this.transformation = transformation;
    this.mutable = mutable;
    this.defaultSort = defaultSort;
  }

  onSizePerPageList = (count = 5) => this.retrieveAll({ count })

  onPageChange = (page = 1, count = 5) => this.retrieveAll({ page, count })

  onDeleteRow = ids => Promise.all(
      _.map(ids, id => this.refs.load.promise = WiregooseApi.crud.remove(this.modelName, id)),
    )
    .then(() => Notifications.create.info('Record(s) deleted successfully'))
    .then(() => this.retrieveAll())

  onFilterChange = (filterObj) => {
    const stateParams = _.pick(this.state.params, [
      'page',
      'count',
      'sortBy',
      'asc'
    ]);
    const filters = _.mapValues(filterObj, 'value');
    const params = {
      ...filters,
      ...stateParams
    }
    this.addQuery(params);
    this.setState({ params }, () => this.retrieveAll());
  }

  onSortChange = (name, sort) => {
    const params = { sortBy: name, asc: sort === 'asc' };
    this.retrieveAll(params);
  }

  onRecordSaved = record =>
    this.refs.load.promise = WiregooseApi.crud.update(this.modelName, record._id, record)
      .then(() => Notifications.create.info('Record saved successfully'))
      .then(() => this.setState({lastEffectedId: record._id}))

  onCreationPanelClicked = () => this.setState({
    isCreationPanelOpen: !this.state.isCreationPanelOpen
  })

  onCreateRecord = record =>
    this.refs.load.promise = WiregooseApi.crud.create(this.modelName, record)
      .then(() => Notifications.create.success('Record created successfully'))
      .then(() => this.setState({lastEffectedId: record._id}))
      .then(() => this.retrieveAll())

  addQuery = (query) => {
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    location.query = query;
    browserHistory.push(location);
  };

  retrieveAll = (params = {}) => {
    const defaultParams = _.defaults(params, this.state.params);
    this.setState({ params: defaultParams });
    this.addQuery(defaultParams);
    const prms = WiregooseApi.crud.retrieveAll(this.modelName, defaultParams)
      .then(resp => {
        const data = resp.data.data;
        const records = _.map(
          data.content,
          this.transformation
        );
        this.setState({
          records,
          total: data.total
        })
      });
    this.refs.load.promise = prms;
    return prms;
  }

  componentWillMount() {
    const location = browserHistory.getCurrentLocation();
    const params = _.defaults(location.query, this.state.params);
    params.page = +params.page;
    params.count = +params.count;
    this.setState({ params });
  }

  componentDidMount() {
    let params;
    if (this.defaultSort.defaultSortName) {
      params = {
        sortBy: this.defaultSort.defaultSortName,
        asc: this.defaultSort.defaultSortOrder === 'asc'
      };
    }
    this.retrieveAll(params);
  }

  expandComponent = (row) => {
    return (
      <div>
        <this.form
          record={row}
          onSave={this.onRecordSaved}
          onDelete={record => this.onDeleteRow([record._id])}
          isNew={false}
        />
      </div>
    );
  }

  isEffectedRow = record =>
    record._id === this.lastEffectedId && 'success'

  afterTable = () => undefined

  render() {
    const {
      records,
      total,
      params,
      isCreationPanelOpen
    } = this.state;

    const selectRow = {
      mode: 'checkbox',
      cliclToSelct: true,
      clickToExpand: true
    };

    function expandableRow() {
      return true;
    }

    return (
      <div>
        {this.afterTable()}
        <h3>{this.title}</h3>
        <Row>
          <Col sm={12}>
            {this.mutable &&
              <Button
                bsStyle="primary"
                className="clearfix pull-right"
                bsSize="small"
                type="button"
                onClick={this.onCreationPanelClicked}>
                {(() => {
                  if (isCreationPanelOpen) {
                    return <span><FontAwesome name="minus" /> Collapse Creation</span>
                  } else {
                    return <span><FontAwesome name="plus" /> Create</span>
                  }
                })()}
              </Button>
            }
            <span className="pull-left w-mt-7 w-mr-7">
              Total: {total}
            </span>
          </Col>
          {
            this.mutable && <Col sm={12}>
              <Collapse in={isCreationPanelOpen} className="w-mb-7 w-mt-7">
                <div>
                  <this.form onSave={this.onCreateRecord} isNew />
                </div>
              </Collapse>
            </Col>
          }
          <Col sm={12}>
            <Loader ref="load">
              <BootstrapTable
                ref="table"
                striped
                hover
                data={records}
                keyField="_id"
                selectRow={this.mutable ? selectRow : {}}
                deleteRow={this.mutable}
                remote
                pagination
                fetchInfo={{ dataTotalSize: total }}
                expandComponent={this.expandComponent}
                expandableRow={expandableRow}
                expandColumnOptions={{
                  expandColumnVisible: true,
                  expandColumnComponent: ({ isExpanded }) =>
                    <FontAwesome name={`chevron-${isExpanded ? 'up' : 'down'}`} className="text-muted"/>
                }}
                trClassName={this.isEffectedRow}
                options={{
                  sizePerPage: params.count,
                  onPageChange: this.onPageChange,
                  sizePerPageList: [5, 10],
                  page: params.page,
                  onSizePerPageList: this.onSizePerPageList,
                  onDeleteRow: this.onDeleteRow,
                  onFilterChange: this.onFilterChange,
                  onSortChange: this.onSortChange,
                  ...this.defaultSort
                }}
              >
                {_.map(this.columns, col => {
                  const filter = col.disableFilter
                    ? undefined
                    : { type: 'TextFilter', defaultValue: this.state.params[col.id] || '' };
                  return (
                    <TableHeaderColumn dataField={col.id} key={col.id} filter={filter} dataSort {...col}>
                      {col.colName || toUppercasesWords(col.id)}
                    </TableHeaderColumn>
                  );
                })}
              </BootstrapTable>
            </Loader>
          </Col>
        </Row>

      </div>
    );
  }
}
