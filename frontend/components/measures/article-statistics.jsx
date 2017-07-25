import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem, Badge }
  from 'react-bootstrap';
import ReactJson from 'react-json-view';

export default class SucceededFetchesPerPeriod extends React.Component {

  static propTypes = {
    statistics: PropTypes.shape().isRequired
  };

  render() {
    const stats = this.props.statistics;

    return (
      <div>
        { !_.isEmpty(stats.failed) && (
          <section>
            <h4>Failed Articles</h4>
            <ListGroup>
              {_.map(stats.failed, item => (
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

        { !_.isEmpty(stats.topViewed) && (
          <section>
            <h4>Most viewed Articles</h4>
            <ListGroup>
              {_.map(stats.topViewed, item => (
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
