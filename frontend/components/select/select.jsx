import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

export default class Select extends React.Component {

  static propTypes = {
    value: PropTypes.any,
    render: PropTypes.func,
    loadOptions: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    singleValue: PropTypes.string
  }

  loadOnOpen = () => {
    this.refs.select.loadOptions('');
  }

  render() {

    const {
      value,
      render,
      loadOptions,
      onChange,
      valueKey,
      labelKey,
      singleValue,
      ...passDownProps
    } = this.props;

    return (
      <ReactSelect.Async
        ref="select"
        value={singleValue ? { [singleValue]: value } : value}
        optionComponent={render}
        loadOptions={loadOptions}
        onChange={onChange}
        onOpen={this.loadOnOpen}
        autoload={false}
        scrollMenuIntoView={false}
        valueKey={singleValue || valueKey}
        labelKey={singleValue || labelKey}
        {...passDownProps}
      />
    );
  }
}
