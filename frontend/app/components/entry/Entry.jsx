import React from 'react';
import validateURL from 'react-proptypes-url-validator';
import FontAwesome from 'react-fontawesome';
import TimeAgo from 'react-timeago';
import SizeMe from 'react-sizeme';
// import TimeAgoEnglishStrings
// from 'react-timeago/lib/language-strings/en';
// import TimeAgoBuildFormatter
// from 'react-timeago/lib/formatters/buildFormatter';

import CSSModules from 'react-css-modules';
import styles from './entry.less';
import componentSize from '../responsible/component-size.js';
import textUtilities from '../text-utilities/';

@SizeMe({ refreshRate: 500 })
@CSSModules(styles, {
  allowMultiple: true,
})
export default class Entry extends React.Component {

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
    size: componentSize.propType,
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
    size: componentSize.defaultProps,
    className: '',
  }

  static timeAgoBuildFormatter(value, unit, suffix) {
    let normalizedUnit = unit;
    if (unit === 'second') {
      return 'now';
    } else if (unit === 'minute') {
      normalizedUnit = 'mins';
    }

    return `${value} ${normalizedUnit} ${suffix}`;
  }

  constructor() {
    super();
    this.state = {};
    this.imageSizeClassBuilder = componentSize.sizeFormatter({
      xxs: 'size-xxs',
    }, '');
    this.titleEllipsesSizeBuilder = componentSize.sizeFormatter({
      xxs: 60,
      xs: 65,
    }, 115);
  }

  render() {
    const {
      entry,
      size,
      ...passDownProps
    } = this.props;

    const titleEllipsesSize = this.titleEllipsesSizeBuilder(size.width);
    const imageSizeClassBuilder = this.imageSizeClassBuilder(size.width);

    passDownProps.className += ' panel panel-default';
    passDownProps.styleName = imageSizeClassBuilder;
    return (
      <article {...passDownProps}>
        <div className="panel-body">
          <header className="head clearfix">
            <section styleName="image" className="pull-left">
              <img src={entry.image} alt="" />
            </section>
            <section styleName="head-content" className="pull-left">
              <a
                href="/"
                styleName="title"
                className="blind-link"
                title="Open Article"
              >
                <h3>
                  {textUtilities.ellipsis(entry.title, titleEllipsesSize)}
                </h3>
              </a>
              <div styleName="info">
                <a
                  className="btn btn-link-muted w-p-0"
                  href="/"
                  role="button"
                  title="Provider"
                >
                  {entry.provider}
                </a>
                <TimeAgo
                  className="text-muted"
                  styleName="time"
                  date={entry.published}
                  minPeriod={1}
                  formatter={Entry.timeAgoBuildFormatter}
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
              {textUtilities.ellipsis(entry.description, 300)}
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
