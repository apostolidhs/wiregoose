import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
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
    const filters = _.mapValues(filterObj, 'value');
    this.retrieveAll(filters);
  }

  onSortChange = (name, sort) => {
    const params = { sortBy: name, asc: sort === 'asc' };
    this.retrieveAll( params);
  }

  onRecordSaved = record => WiregooseApi.crud.update(modelName, record._id, record)

  onCreationPanelClicked = () => this.setState({
    isCreationPanelOpen: !this.state.isCreationPanelOpen
  })

  onCreateRecord = record =>
    WiregooseApi.crud.create(modelName, record)
      .then(() => this.retrieveAll())

  retrieveAll = (params = {}) => {
    const defaultParams = _.defaults(params, this.state.params);
    return WiregooseApi.crud.retrieveAll(modelName, defaultParams)
      .then(resp => {
        this.setState({
          total: resp.data.data.total,
          records: resp.data.data.content
        })
      });
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
      'category',
      'link',
      'lang',
      'provider',
      '_id',
    ];

    return (
      <div>
        <h3>Rss Registration</h3>
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
              {_.map(cols, col => (
                <TableHeaderColumn dataField={col} key={col} filter={{ type: 'TextFilter' }} dataSort>
                  {toUppercasesWords(col)}
                </TableHeaderColumn>
              ))}
            </BootstrapTable>
          </Col>
        </Row>
      </div>
    );
  }
}
