import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn }
  from 'react-bootstrap-table';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { retrieveAll, update, remove, create, toggleCreationPanel }
  from '../../../components/crud-generator/actions';
import { session } from '../../../actions/session.js';
import Form from '../../../components/rss-provider/Form.jsx';
import { toUppercasesWords }
  from '../../../components/text-utilities';

const modelName = 'rssProvider';

function mapStateToProps(state) {
  const collection = state.crud[modelName] || {};
  return collection;
}

function mapDispatchToProps(dispatch) {
  return {
    retrieveAll: () => dispatch(retrieveAll(modelName)),
    onSizePerPageList: (count = 5) =>
      dispatch(retrieveAll(modelName, { count })),
    onPageChange: (page = 1, count = 5) =>
      dispatch(retrieveAll(modelName, { page, count })),
    onDeleteRow: ids => Promise.all(
        _.map(ids, id => dispatch(remove(modelName, id))),
      )
      .then((action) => {
        if (action.type === 'CRUD_OPERATION_CREATE_SUCCESS') {
          return dispatch(retrieveAll(modelName));
        } else if (action.type === 'CRUD_OPERATION_FAIL') {
          if (_.get(action, 'error.response.status') === 401) {
            return dispatch(retrieveAll(modelName))
              .then();
          }
        }
        // session
        // console.log('onDeleteRow', a, b);
        // dispatch(retrieveAll(modelName));
      }),
    onFilterChange: (filterObj) => {
      const filters = _.mapValues(filterObj, 'value');
      dispatch(retrieveAll(modelName, filters));
    },
    onSortChange: (name, sort) => {
      const params = { sortBy: name, asc: sort === 'asc' };
      dispatch(retrieveAll(modelName, params));
    },
    onRecordSaved: record => dispatch(update(modelName, record._id, record)),
    onCreationPanelClicked: () => dispatch(toggleCreationPanel(modelName)),
    onCreateRecord: record =>
      dispatch(create(modelName, record))
        .then(action => action.type === 'CRUD_OPERATION_CREATE_SUCCESS')
        .then(success => success && dispatch(retrieveAll(modelName))),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class RssProvider extends React.Component {

  static propTypes = {
    retrieveAll: React.PropTypes.func.isRequired,

    total: React.PropTypes.number.isRequired,
    records: React.PropTypes.arrayOf(
      React.PropTypes.shape(),
    ).isRequired,
    params: React.PropTypes.shape({
      count: React.PropTypes.number,
      page: React.PropTypes.number,
      sortBy: React.PropTypes.string,
      asc: React.PropTypes.bool,
    }).isRequired,
    lastEffectedId: React.PropTypes.string.isRequired,

    onSizePerPageList: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func.isRequired,
    onDeleteRow: React.PropTypes.func.isRequired,
    onFilterChange: React.PropTypes.func.isRequired,
    onSortChange: React.PropTypes.func.isRequired,
    onRecordSaved: React.PropTypes.func.isRequired,
    onCreationPanelClicked: React.PropTypes.func.isRequired,
    isCreationPanelOpen: React.PropTypes.bool.isRequired,
    onCreateRecord: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.retrieveAll();
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
      params,
      records,
      total,
      onSizePerPageList,
      onPageChange,
      onDeleteRow,
      onFilterChange,
      onSortChange,
      onCreationPanelClicked,
      isCreationPanelOpen,
      onCreateRecord,
    } = this.props;

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
            <Button type="button" onClick={onCreationPanelClicked}>
              <FontAwesome name="plus" /> Create
            </Button>
            <Collapse in={isCreationPanelOpen}>
              <div>
                <Form onSave={onCreateRecord} isNew />
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
                onPageChange,
                sizePerPageList: [5, 10],
                page: params.page,
                onSizePerPageList,
                onDeleteRow,
                onFilterChange,
                onSortChange,
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
