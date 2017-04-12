import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn, Collapse } from 'react-bootstrap-table';
import { Row, Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { retrieveAll, update, remove } from './actions';
import FormGenerator from '../form-generator/FormGenerator.jsx';
import { toUppercasesWords } from '../text-utilities';

function mapStateToProps(state, ownProps) {
  const collection = state.crud[ownProps.model.name];
  return {
    records: collection ? collection.records : [],
    total: collection && collection.total,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    retrieveAll: () => dispatch(retrieveAll(ownProps.model)),
    onSizePerPageList: () => dispatch(retrieveAll(ownProps.model)),
    onPageChange: () => dispatch(retrieveAll(ownProps.model)),
    onDeleteRow: () => dispatch(retrieveAll(ownProps.model)),
    onSearchChange: () => dispatch(retrieveAll(ownProps.model)),
    //onSortChange: () => dispatch(retrieveAll(ownProps.model)),
    onRecordSaved: (record) => {
      return dispatch(update(ownProps.model, record._id, record));
    },
    onRecordDeleted: (record) => {
      return dispatch(remove(ownProps.model, record._id));
    },
    onSortChange: (record) => {
      return dispatch(update(ownProps.model, record._id, record));
    },
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CrudGenerator extends React.Component {

  static propTypes = {
    model: React.PropTypes.shape({
      name: React.PropTypes.string,
    }).isRequired,
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
        <FormGenerator
          model={this.props.model}
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
      model,
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

    return (
      <div>
        <h3>{toUppercasesWords(model.name)}</h3>
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
              {_.map(model.schema, (props, key) => (
                <TableHeaderColumn dataField={key} key={key} dataSort>
                  {toUppercasesWords(key)}
                </TableHeaderColumn>
              ))}
            </BootstrapTable>
          </Col>
        </Row>
      </div>
    );
  }
}
