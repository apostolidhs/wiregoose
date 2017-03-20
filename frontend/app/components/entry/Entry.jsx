import React, { Component } from 'react';
import validateURL from 'react-proptypes-url-validator';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import TimeAgoEnglishStrings from 'react-timeago/lib/language-strings/en';
import TimeAgoBuildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import CSSModules from 'react-css-modules';
import styles from './entry.less';

@CSSModules(styles)
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
    className: React.PropTypes.string,
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
    className: '',
  }

  constructor() {
    super();
    this.state = {};
    this.timeAgoFormatter = TimeAgoBuildFormatter(TimeAgoEnglishStrings);
  }

  render() {
    const entry = this.props.entry;
    return (
      <article className={`panel panel-default ${this.props.className}`}>
        <div className="panel-body">
          <header className="head clearfix">
            <section styleName="image" className="pull-left">
              <img src={entry.image} alt="" />
            </section>
            <section styleName="head-content" className="pull-left">
              <h3 styleName="title">
                {entry.title}
              </h3>
              <div styleName="info">
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
            <p className="body-content">
              {entry.description}
            </p>
          </section>
          <footer className="footer">
            <a
              className="btn btn-default"
              styleName="social-share"
              href="/"
              role="button"
              title="Link"
            >
              <FontAwesome name="link" />
            </a>
            <a
              className="w-ml-7 btn btn-default"
              styleName="social-share"
              href="/"
              role="button"
              title="Facebook"
            >
              <FontAwesome name="facebook" />
            </a>
            <a
              className="w-ml-7 btn btn-default"
              styleName="social-share"
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
