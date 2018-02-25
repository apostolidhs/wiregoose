import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import BootstrapImage from 'react-bootstrap/lib/Image';
import styles from './article-box.less';

const imagesCacheState = {};

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ArticleImage extends React.Component {

  static propTypes = {
    src: PropTypes.string,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    showOnlyPlaceholder: PropTypes.bool
  }

  state = {
    isLoading: false,
    loadSuccess: false
  }

  componentWillMount() {
    const {
      src,
      showOnlyPlaceholder
    } = this.props;

    if (showOnlyPlaceholder) {
      return;
    }

    const cachedImageState = imagesCacheState[src];
    if (cachedImageState !== undefined) {
      this.setState({
        isLoading: false,
        loadSuccess: cachedImageState
      });
      return;
    }

    this.setState({
      isLoading: true,
      loadSuccess: false
    });

    this.image = new Image();

    this.image.onload = () => {
      this.setState({
        isLoading: false,
        loadSuccess: true
      });
      imagesCacheState[src] = true;
    }

    this.image.onerror = () => {
      this.setState({
        isLoading: false,
        loadSuccess: false
      });
      imagesCacheState[src] = false;
    };

    this.image.src = src;
  }

  componentWillUnmount() {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
      this.image.src = '';
    }
  }

  render() {
    const {
      isLoading,
      loadSuccess
    } = this.state;

    const {
      src,
      showOnlyPlaceholder,
      children,
      title,
      ...props
    } = this.props;

    if (isLoading) {
      return <BootstrapImage styleName='is-image-loading' alt='Wiregoose' {...props}/>;
    }

    if (loadSuccess) {
      return <BootstrapImage src={src} alt={title} {...props}/>;
    }

    return children;
  }

}
