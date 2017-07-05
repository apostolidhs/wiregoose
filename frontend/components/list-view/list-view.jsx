import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn }
  from 'react-bootstrap-table';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Form from '../rss-provider/form.jsx';
import Loader from '../loader/loader.jsx';
import { toUppercasesWords }
  from '../text-utilities/text-utilities.js';
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
    isCreationPanelOpen: false
  };

  constructor({ modelName, columns, title }) {
    super();
    this.modelName = modelName;
    this.columns = columns;
    this.title = title;
  }


  onSizePerPageList = (count = 5) => this.retrieveAll({ count })

  onPageChange = (page = 1, count = 5) => this.retrieveAll({ page, count })

  onDeleteRow = ids => Promise.all(
      _.map(ids, id => this.refs.load.promise = WiregooseApi.crud.remove(this.modelName, id)),
    )
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

  onRecordSaved = record => this.refs.load.promise = WiregooseApi.crud.update(this.modelName, record._id, record)

  onCreationPanelClicked = () => this.setState({
    isCreationPanelOpen: !this.state.isCreationPanelOpen
  })

  onCreateRecord = record =>
    this.refs.load.promise = WiregooseApi.crud.create(this.modelName, record)
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
        this.setState({
          total: resp.data.data.total,
          records: resp.data.data.content
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
    this.retrieveAll();
  }

  expandComponent = (row) => {
    return (
      <div>
        <Form
          record={row}
          onSave={this.props.onRecordSaved}
          onDelete={record => this.props.onDeleteRow([record._id])}
          isNew={false}
        />
      </div>
    );
  }

  isEffectedRow = record =>
    record._id === this.props.lastEffectedId && 'success'

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
        <h3>{this.title}</h3>
        <Row>
          <Col sm={12}>
            <Button className="clearfix pull-right" type="button" onClick={this.onCreationPanelClicked}>
              <FontAwesome name="plus" /> Create
            </Button>
          </Col>
          <Col sm={12}>
            <Collapse in={isCreationPanelOpen} className="w-mb-7 w-mt-7">
              <div>
                <Form onSave={this.onCreateRecord} isNew />
              </div>
            </Collapse>
          </Col>
          <Col sm={12}>
            <Loader ref="load">
              <BootstrapTable
                ref="table"
                striped
                hover
                data={records}
                keyField="_id"
                selectRow={selectRow}
                deleteRow
                remote
                pagination
                fetchInfo={{ dataTotalSize: total }}
                expandComponent={this.expandComponent}
                expandableRow={expandableRow}
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
                }}
              >
                {_.map(this.columns, col => {
                  const filter = { type: 'TextFilter', defaultValue: this.state.params[col.id] || '' };
                  return (
                    <TableHeaderColumn {...col} dataField={col.id} key={col.id} filter={filter} dataSort>
                      {toUppercasesWords(col.id)}
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
