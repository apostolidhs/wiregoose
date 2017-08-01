import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

export default class InternalServerError extends React.Component {

  render() {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="chain-broken" />
        </h1>
        <h1>
          Page Not Found
        </h1>
        <p>
          Sorry, we couldn't find the page you were looking for. You may have mistyped the address or the page may have moved.
        </p>
        <p>
          You could {''}
          <Link
            to="/"
            role="button"
            title="Explore News"
          >
            continue reading news
          </Link>
        </p>
      </div>
    );
  }

}
