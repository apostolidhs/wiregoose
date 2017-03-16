import React, { Component } from 'react';
import validateURL from 'react-proptypes-url-validator';

export default class Entry extends Component {
  static propTypes = {
    entry: React.PropTypes.shape({
      title: React.PropTypes.string,
      image: validateURL,
      description: React.PropTypes.string,
      published: React.PropTypes.instanceOf(Date),
      link: validateURL,
      author: React.PropTypes.string,
      provider: React.PropTypes.string,
    }),
  }

  static defaultProps = {
    entry: Entry.getDefaultValues(),
  }

  static getDefaultValues() {
    return {
      title: undefined,
      image: undefined,
      description: undefined,
      published: undefined,
      link: undefined,
      author: undefined,
      provider: undefined,
    };
  }

  state = {}

  render() {
    return (
      <div>
        <div className="head">
          <div className="image">
            <img src={this.props.entry.image} alt="" />
          </div>
          <div className="body">
            <div className="title">
              {this.props.entry.title}
            </div>
          </div>
        </div>
        <div className="body">
        sdfasdasd
        </div>
        <div className="footer">
        sdfokjopij
        </div>
      </div>
    );
  }
}
