import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class InternalServerError extends React.Component {

  render() {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="chain-broken" />
        </h1>
        <h1>
          Something went wrong
        </h1>
        <p>
          We are experiencing an internal problem.
        </p>
        <p>
          Please try again later.
          <span className="text-muted"> That's all we know.</span>
        </p>
      </div>
    );
  }

}
