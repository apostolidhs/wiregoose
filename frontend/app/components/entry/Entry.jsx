import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './entry.less';

import validateURL from 'react-proptypes-url-validator';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import TimeAgoEnglishStrings from 'react-timeago/lib/language-strings/en';
import TimeAgoBuildFormatter from 'react-timeago/lib/formatters/buildFormatter';

@CSSModules(styles, { allowMultiple: true })
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
      category: React.PropTypes.string,
    }),
  }

  static defaultProps = {
    entry: {
      title: undefined,
      image: undefined,
      description: undefined,
      published: undefined,
      link: undefined,
      author: undefined,
      provider: undefined,
      category: undefined,
    },
  }

  constructor() {
    super();
    this.state = {};
    this.timeAgoFormatter = TimeAgoBuildFormatter(TimeAgoEnglishStrings);
  }

  render() {
    const entry = this.props.entry;
    return (
      <article className="panel panel-default">
        <div className="panel-body">
          <header className="head">
            <section styleName="image">
              <img src={entry.image} alt="" />
            </section>
            <section className="content">
              <h3 className="title">
                {entry.title}
              </h3>
              <div className="info">
                <TimeAgo
                  date={entry.published}
                  minPeriod={1}
                  formatter={this.timeAgoFormatter}
                />
                <span className="provider">{entry.provider}</span>
              </div>
            </section>
          </header>
          <section className="body">
            <p className="author">
              {entry.author}
            </p>
            <p className="content">
              {entry.description}
            </p>
          </section>
          <footer className="footer">
            <a
              className="social-share btn btn-default"
              href="/"
              role="button"
              title="Link"
            >
              <FontAwesome name="link" />
            </a>
            <a
              className="social-share btn btn-default"
              href="/"
              role="button"
              title="Facebook"
            >
              <FontAwesome name="facebook" />
            </a>
            <a
              className="social-share btn btn-default"
              href="/"
              role="button"
              title="Twitter"
            >
              <FontAwesome name="twitter" />
            </a>
          </footer>
        </div>
      </article>
    );
  }
}
