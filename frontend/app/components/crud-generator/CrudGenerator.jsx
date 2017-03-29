import React from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Col } from 'react-bootstrap';
import { retrieveAll } from './actions';
import { toUppercasesWords } from '../text-utilities';

function mapStateToProps(state, ownProps) {
  return {
    records: state.crud[ownProps.model.name],
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    retrieveAll: () => dispatch(retrieveAll(ownProps.model)),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CrudGenerator extends React.Component {

  static propTypes = {
    model: React.PropTypes.shape({
      name: React.PropTypes.string,
    }).isRequired,
    retrieveAll: React.PropTypes.func.isRequired,
    records: React.PropTypes.shape({
      total: React.PropTypes.number,
      data: React.PropTypes.array,
    }),
  }

  static defaultProps = {
    records: undefined,
  };

  componentDidMount() {
    this.props.retrieveAll();
  }

  render() {
    const { model } = this.props;
    return (
      <div>
        <h3>{toUppercasesWords(model.name)}</h3>
        <Row>
          <Col sm={12}>
            <BootstrapTable
              data={this.props.data}
              remote={true}
              pagination={true}
              fetchInfo={{ dataTotalSize: this.props.totalDataSize }}
              options={{
                sizePerPage: this.props.sizePerPage,
                onPageChange: this.props.onPageChange,
                sizePerPageList: [5, 10],
                page: this.props.currentPage,
                onSizePerPageList: this.props.onSizePerPageList
              }}
            >
              <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
              <TableHeaderColumn dataField="link">Link</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </div>
    );
  }

}
