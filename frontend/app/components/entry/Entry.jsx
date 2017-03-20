import React, { Component } from 'react';
import validateURL from 'react-proptypes-url-validator';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
// import TimeAgoEnglishStrings from 'react-timeago/lib/language-strings/en';
// import TimeAgoBuildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import CSSModules from 'react-css-modules';
import styles from './entry.less';
import EclipsesText from '../eclipses-text/EclipsesText.jsx';

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
    this.timeAgoFormatter = (value, unit, suffix) => {
      let normalizedUnit = unit;
      if (unit === 'second') {
        return 'now';
      } else if (unit === 'minute') {
        normalizedUnit = 'mins';
      }

      return `${value} ${normalizedUnit} ${suffix}`;
    };
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
                <EclipsesText text={entry.title} size={115} />
              </h3>
              {/*styleName="provider"*/}
              <div styleName="info">
                <a
                  className="btn btn-link-muted"
                  href="/"
                  role="button"
                  title="Author"
                >
                  {entry.provider}
                </a>
                {/*<span styleName="provider">{entry.provider}</span>*/}
                <TimeAgo
                  className="text-muted"
                  styleName="time"
                  date={entry.published}
                  minPeriod={1}
                  formatter={this.timeAgoFormatter}
                />
              </div>
            </section>
          </header>
          <section className="body">
            {
              (() => {
                if (entry.author) {
                  return (
                    <p styleName="author">
                      <a
                        styleName="author-btn"
                        className="btn btn-link"
                        href="/"
                        role="button"
                        title="Author"
                      >
                        <span>@</span>
                        {entry.author}
                      </a>
                    </p>
                  );
                }
              })()
            }
            <p
              styleName="body-content"
              style={{ paddingTop: entry.author || '7px' }}
            >
              <EclipsesText text={entry.description} size={300} />
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
