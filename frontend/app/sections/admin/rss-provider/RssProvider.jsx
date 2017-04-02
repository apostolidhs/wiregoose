import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn, Collapse }
  from 'react-bootstrap-table';
import { Row, Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { retrieveAll, update, remove }
  from '../../../components/crud-generator/actions';
import Form from '../../../components/rss-provider/Form.jsx';
import { toUppercasesWords }
  from '../../../components/text-utilities';

const modelName = 'rssProvider';

function mapStateToProps(state) {
  const collection = state.crud[modelName];
  return {
    records: collection ? collection.records : [],
    total: collection && collection.total,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    retrieveAll: () => dispatch(retrieveAll(modelName)),
    onSizePerPageList: () => dispatch(retrieveAll(modelName)),
    onPageChange: () => dispatch(retrieveAll(modelName)),
    onDeleteRow: () => dispatch(retrieveAll(modelName)),
    onSearchChange: () => dispatch(retrieveAll(modelName)),
    onSortChange: () => dispatch(retrieveAll(modelName)),
    onRecordSaved: (record) => {
      return dispatch(update(modelName, record._id, record));
    },
    onRecordDeleted: (record) => {
      return dispatch(remove(modelName, record._id));
    },
    // onRecordSaved: (record) => {
    //   return dispatch(update(modelName, record._id, record));
    // },
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class RssProvider extends React.Component {

  static propTypes = {
    retrieveAll: React.PropTypes.func.isRequired,

    total: React.PropTypes.number,
    records: React.PropTypes.arrayOf(
      React.PropTypes.shape(),
    ),

    onSizePerPageList: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func.isRequired,
    onDeleteRow: React.PropTypes.func.isRequired,
    onSearchChange: React.PropTypes.func.isRequired,
    onSortChange: React.PropTypes.func.isRequired,
    onRecordSaved: React.PropTypes.func.isRequired,
    onRecordDeleted: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    records: [],
    total: undefined,
  };

  componentDidMount() {
    this.props.retrieveAll();
  }

  expandComponent = (row) => {
    return (
      <div>
        <Form
          record={row}
          onSave={this.props.onRecordSaved}
          onDelete={this.props.onRecordDeleted}
          isNew={false}
        />
      </div>
    );
  }

  render() {
    const {
      records,
      total,
      onSizePerPageList,
      onPageChange,
      onDeleteRow,
      onSearchChange,
      onSortChange,
    } = this.props;

    const selectRow = {
      mode: 'checkbox',
      cliclToSelct: true,
      clickToExpand: true,
    };

    // function onRecordSaved() {

    // }

    // function onRecordDeleted() {

    // }

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
          <Col sm={12}>
            {/*<Button type="button" onClick={this.toggleCreationPanel}>
              <FontAwesome name="plus" /> Create
            </Button>
            <Collapse in={this.state.open}>
              <div>
                <FormGenerator
                  model={this.props.model}
                  onSave={this.props.onRecordSaved}
                  isNew={true}
                />
              </div>
            </Collapse>*/}
          </Col>
          <Col sm={12}>
            <BootstrapTable
              striped
              hover
              search
              data={records}
              keyField="_id"
              selectRow={selectRow}
              deleteRow
              remote
              pagination
              fetchInfo={{ dataTotalSize: total }}
              expandComponent={this.expandComponent}
              expandableRow={expandableRow}
              options={{
                sizePerPage: 10,
                onPageChange,
                sizePerPageList: [5, 10],
                page: 1,
                onSizePerPageList,
                onDeleteRow,
                onSearchChange,
                onSortChange,
              }}
            >
              {_.map(cols, col => (
                <TableHeaderColumn dataField={col} key={col} dataSort>
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
