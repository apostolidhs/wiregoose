import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Badge from 'react-bootstrap/lib/Badge';
import ReactJson from 'react-json-view';
import CSSModules from 'react-css-modules';

import styles from './measures.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class SucceededFetchesPerPeriod extends React.Component {

  static propTypes = {
    statistics: PropTypes.shape().isRequired
  };

  render() {
    const stats = this.props.statistics;

    return (
      <div>
        { !isEmpty(stats.failed) && (
          <section className="w-mt-7">
            <h4>Failed Articles</h4>
            <ListGroup styleName="scroll-list">
              {map(stats.failed, item => (
                <ListGroupItem key={item._id}>
                  <Link to={{
                    pathname: '/admin/articleentries',
                    query: {
                      _id: item._id
                    }
                  }} >{item.link}</Link>
                  <ReactJson src={item.error} collapsed={true} theme="monokai" />
                </ListGroupItem>
              ))}
            </ListGroup>
          </section>
        )}

        { !isEmpty(stats.topViewed) && (
          <section className="w-mt-7">
            <h4>Most viewed Articles</h4>
            <ListGroup styleName="scroll-list">
              {map(stats.topViewed, item => (
                <ListGroupItem className="w-text-overflow" key={item._id}>
                  <Link to={{
                    pathname: '/admin/articleentries',
                    query: {
                      _id: item._id
                    }
                  }} >{item.link}</Link>
                  <Badge>{item.hits}</Badge>
                </ListGroupItem>
              ))}
            </ListGroup>
          </section>
        )}
      </div>
    );
  }

}
