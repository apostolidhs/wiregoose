import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './loader.less';
import mongooseIcon from '../../assets/img/logo-170-nologo.png';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Loader extends React.Component {

  hasMount = false;
  toggleLoading = undefined;

  state = {
    isLoading: false
  }

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
  }

  static defaultProps = {
    title: ''
  }

  componentWillMount(){
    this.hasMount = true;
  }

  componentWillUnmount(){
    this.hasMount = false;
  }

  // todo change this
  set isLoading(loading) {
    if (loading) {
      this.setState({ isLoading: true });
    } else {
      this.setState({ isLoading: false });
    }
  }

  set promise(prms) {
    this.toggleLoading = _.debounce((isLoading = false) => {
      if (this.hasMount) {
        this.setState({ isLoading });
      }
    }, 200);

    this.toggleLoading(true);
    prms.then((v) => {
      this.toggleLoading(false);
      return v;
    })
    .catch((e) => {
      this.toggleLoading(false);
      throw e;
    });
  }

  render() {
    const {
      children,
      title,
      ...props
    } = this.props;

    return (
      <div styleName="wrapper" {...props}>
        {children}
        {this.state.isLoading &&
          <div styleName="loader">
            <div styleName="loader backdrop"></div>
            <div styleName="loader message-wrapper">
              <div className="text-center">
                <img className="w-is-logo-loading" src={mongooseIcon} styleName="logo-loading" />
                <h4 className="w-text-loading" data-text={title}>
                  {title}
                </h4>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
