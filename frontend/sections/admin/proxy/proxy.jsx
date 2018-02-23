import sumBy from 'lodash/sumBy';
import each from 'lodash/each';
import now from 'lodash/now';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Panel from 'react-bootstrap/lib/Panel';
import Alert from 'react-bootstrap/lib/Alert';
import FontAwesome from 'react-fontawesome';

import Loader from '../../../components/loader/loader.jsx';
import {toText, TIME_1_DAY, TIME_1_HOUR} from '../../../components/utilities/dates.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

export default class Dashboard extends React.Component {
  state = {
    files: undefined,
    totalSize: undefined,
    hasOverDate: false
  };

  componentDidMount() {
    this.retrieveCacheInfo();
  }

  retrieveCacheInfo = () => {
    this.refs.cacheInfoLoader.promise = WiregooseApi.getProxyCacheInfo()
      .then(resp => {
        const {files} = resp.data.data;
        const totalSize = sumBy(files, 'size');
        let hasOverDate = false;
        each(files, file => {
          if ((file.created.getTime() + (TIME_1_DAY + TIME_1_HOUR)) < now()) {
            file.overDate = true;
            hasOverDate = true;
          }
        });
        const sortedFiles = sortBy(files, f => -f.size);
        this.setState({ files: sortedFiles, totalSize, hasOverDate });
      });
  }

  render() {
    const {files, totalSize, hasOverDate} = this.state;
    return (
      <Loader ref="cacheInfoLoader">
        <Row>
          <Col xs={12}>
            <Panel>
              <h3>Cached Files</h3>
              {hasOverDate &&
                <Alert bsStyle="warning">
                  There are files that have not invalidated properly
                </Alert>
              }
              <b>Total</b>: {files && files.length} {' '}
              <b className="w-ml-7">Size</b>: {totalSize}
              <Table className="w-mt-14" responsive hover striped>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Created</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    map(files, file => (
                      <tr key={file.name} className={file.overDate && 'danger'}>
                        <td>{file.size}</td>
                        <td>{toText(file.created, true)}</td>
                        <td>
                          <small>{file.name}</small>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </Panel>
          </Col>
        </Row>
      </Loader>
    );
  }
}
