import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn }
  from 'react-bootstrap-table';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Form from '../../../components/rss-provider/form.jsx';
import { toUppercasesWords }
  from '../../../components/text-utilities/text-utilities.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

const modelName = 'rssRegistration';

export default class RssRegistration extends React.Component {
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

  onSizePerPageList = (count = 5) => this.retrieveAll({ count })

  onPageChange = (page = 1, count = 5) => this.retrieveAll({ page, count })

  onDeleteRow = ids => Promise.all(
      _.map(ids, id => WiregooseApi.crud.remove(modelName, id)),
    )
    .then(() => this.retrieveAll())

  onFilterChange = (filterObj) => {
    const stateParams = _.pick(this.state.params, [
      'count',
      'sortBy',
      'asc'
    ]);
    stateParams.page = 1;
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

  onRecordSaved = record => WiregooseApi.crud.update(modelName, record._id, record)

  onCreationPanelClicked = () => this.setState({
    isCreationPanelOpen: !this.state.isCreationPanelOpen
  })

  onCreateRecord = record =>
    WiregooseApi.crud.create(modelName, record)
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
    return WiregooseApi.crud.retrieveAll(modelName, defaultParams)
      .then(resp => {
        this.setState({
          total: resp.data.data.total,
          records: resp.data.data.content
        })
      });
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

    const cols = [
      {
        id: 'category'
      },
      {
        id: 'link',
        width: '400',
        dataFormat: (cell) => (<Link to={cell} target="_blank">{cell}</Link>)
      },
      {
        id: 'lang'
      },
      {
        id: 'provider',
        dataFormat: (cell) => (<Link to={`/admin/rssprovider?_id=${cell._id}`}>{cell.name}</Link>)
      },
      {
        id: '_id',
        columnTitle: true
      },
    ];

    return (
      <div>
        <h3>Rss Registrations</h3>
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
              {_.map(cols, col => {
                const filter = { type: 'TextFilter', defaultValue: this.state.params[col.id] || '' };
                return (
                  <TableHeaderColumn {...col} dataField={col.id} key={col.id} filter={filter} dataSort>
                    {toUppercasesWords(col.id)}
                  </TableHeaderColumn>
                );
              })}
            </BootstrapTable>
          </Col>
        </Row>
      </div>
    );
  }
}
