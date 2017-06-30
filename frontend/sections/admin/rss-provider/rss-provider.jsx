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

const modelName = 'rssProvider';

// function mapStateToProps(state) {
//   const collection = state.crud[modelName] || {};
//   return collection;
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     retrieveAll: () => dispatch(retrieveAll(modelName)),
//     onSizePerPageList: (count = 5) =>
//       dispatch(retrieveAll(modelName, { count })),
//     onPageChange: (page = 1, count = 5) =>
//       dispatch(retrieveAll(modelName, { page, count })),
//     onDeleteRow: ids => Promise.all(
//         _.map(ids, id => dispatch(remove(modelName, id))),
//       )
//       .then((action) => {
//         if (action.type === 'CRUD_OPERATION_CREATE_SUCCESS') {
//           return dispatch(retrieveAll(modelName));
//         } else if (action.type === 'CRUD_OPERATION_FAIL') {
//           if (_.get(action, 'error.response.status') === 401) {
//             return dispatch(retrieveAll(modelName))
//               .then();
//           }
//         }
//       }),
//     onFilterChange: (filterObj) => {
//       const filters = _.mapValues(filterObj, 'value');
//       dispatch(retrieveAll(modelName, filters));
//     },
//     onSortChange: (name, sort) => {
//       const params = { sortBy: name, asc: sort === 'asc' };
//       dispatch(retrieveAll(modelName, params));
//     },
//     onRecordSaved: record => dispatch(update(modelName, record._id, record)),
//     onCreationPanelClicked: () => dispatch(toggleCreationPanel(modelName)),
//     onCreateRecord: record =>
//       dispatch(create(modelName, record))
//         .then(action => action.type === 'CRUD_OPERATION_CREATE_SUCCESS')
//         .then(success => success && dispatch(retrieveAll(modelName))),
//   };
// }

export default class RssProvider extends React.Component {

  // static propTypes = {
  //   retrieveAll: PropTypes.func.isRequired,

  //   total: PropTypes.number.isRequired,
  //   records: PropTypes.arrayOf(
  //     PropTypes.shape(),
  //   ).isRequired,
  //   params: PropTypes.shape({
  //     count: PropTypes.number,
  //     page: PropTypes.number,
  //     sortBy: PropTypes.string,
  //     asc: PropTypes.bool,
  //   }).isRequired,
  //   lastEffectedId: PropTypes.string.isRequired,

  //   onSizePerPageList: PropTypes.func.isRequired,
  //   onPageChange: PropTypes.func.isRequired,
  //   onDeleteRow: PropTypes.func.isRequired,
  //   onFilterChange: PropTypes.func.isRequired,
  //   onSortChange: PropTypes.func.isRequired,
  //   onRecordSaved: PropTypes.func.isRequired,
  //   onCreationPanelClicked: PropTypes.func.isRequired,
  //   isCreationPanelOpen: PropTypes.bool.isRequired,
  //   onCreateRecord: PropTypes.func.isRequired,
  // }

  state = {
    params: {
      page: 1,
      count: 10,
      sortBy: undefined,
      asc: undefined
    },
    total: 0,
    records: []
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

  onCreationPanelClicked = () => toggleCreationPanel(modelName)

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
      isCreationPanelOpen,
    } = this.props;

    const {
      records,
      total,
      params
    } = this.state;

    const selectRow = {
      mode: 'checkbox',
      cliclToSelct: true,
      clickToExpand: true,
    };

    function expandableRow() {
      return true;
    }

    const cols = [
      'name',
      'link',
      '_id',
    ];

    return (
      <div>
        <h3>Rss Provider</h3>
        <Row>
          <div>
            <Button type="button" onClick={this.onCreationPanelClicked}>
              <FontAwesome name="plus" /> Create
            </Button>
            <Collapse in={isCreationPanelOpen}>
              <div>
                <Form onSave={this.onCreateRecord} isNew />
              </div>
            </Collapse>
          </div>
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
