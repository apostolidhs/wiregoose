import React from 'react';
import PropTypes from 'prop-types';

export default class SelectInlineRender extends React.Component {
  static propTypes = {
		option: PropTypes.object
	}

	handleMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	}

	handleMouseEnter = (event) => {
		this.props.onFocus(this.props.option, event);
	}

	handleMouseMove = (event) => {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	}

  render() {
		const { option } = this.props;
		return (
			<div className={this.props.className}
				title={option.category}
				onMouseDown={this.handleMouseDown}
				onMouseEnter={this.handleMouseEnter}
				onMouseMove={this.handleMouseMove}
			>
				<strong>{option.provider.name}</strong>
				<span className="w-ml-7">{option.category}</span>
			</div>
		)
  }
}
