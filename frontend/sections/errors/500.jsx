import React from 'react';
import FontAwesome from 'react-fontawesome';

import tr from '../../components/localization/localization.js';

export default class InternalServerError extends React.Component {

  render() {
    return (
      <div className="text-center">
        <h1>
          <FontAwesome name="chain-broken" />
        </h1>
        <h1>{tr.errors500Title}</h1>
        <p>{tr.errors500Desc}</p>
        <p>
          {tr.errors500Prompt}
          <span className="text-muted"> {tr.errors500PromptFooter}</span>
        </p>
      </div>
    );
  }

}
