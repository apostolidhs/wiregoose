import React from 'react';
import FormGenerator from '../form-generator/FormGenerator.jsx';

export default class ModelView extends React.Component {

  render() {
    console.log(arguments);
    return (
      <div>
        {/*<FormGenerator
          model={this.props.model}
          record={row}
          onSave={this.props.onRecordSaved}
          onDelete={this.props.onRecordDeleted}
          isNew={false}
        />*/}
      </div>
    );
  }

}
