import throttle from 'lodash/throttle';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import {Button as BSButton, OverlayTrigger, Tooltip} from 'react-bootstrap';

import tr from '../localization/localization.js';
import {isAuthenticated, launchAuthModal} from '../authorization/auth.js';
import {EventHOC} from '../events/events.jsx';
import {hasBookmark, setBookmark, isMaximumBookmarksReached} from  './bookmarks.js';

class Button extends React.Component {

  static propTypes = {
    entryId: PropTypes.string.isRequired
  }

  state = {
    isBookmarked: false
  }

  constructor() {
    super();
    this.toggleBookmark = throttle(this.toggleBookmark.bind(this), 1000);
  }

  componentWillMount() {
    const {entryId} = this.props;
    const isBookmarked = isAuthenticated() && hasBookmark(entryId);
    this.setState({isBookmarked});
  }

  toggleBookmark() {
    const {entryId} = this.props;

    const updateBookmark = () => {
      if (!isAuthenticated()) {
        return;
      }
      const isBookmarked = !hasBookmark(entryId);
      this.setState({isBookmarked});
      setBookmark(entryId, isBookmarked)
        .finally(() => this.setState({isBookmarked: hasBookmark(entryId)}));
    }

    if (!isAuthenticated()) {
      const prompt = this.renderLoginPrompt();
      return launchAuthModal({type: 'LOGIN', prompt})
        .then(() => updateBookmark());
    }

    updateBookmark();
  }

  renderLoginPrompt() {
    return (
      <h3>{tr.bookmarkLoginPrompt}</h3>
    );
  }

  renderButton(isDisabled = false) {
    const {className} = this.props;
    const {isBookmarked} = this.state;
    const name = isBookmarked ? 'bookmark' : 'bookmark-o';
    const cmpClassName = classnames(className, 'btn btn-link blind-link');

    return (
      <BSButton
        className={`btn btn-link blind-link ${className}`}
        title={tr.trFc('bookmark')}
        onClick={this.toggleBookmark}
        disabled={isDisabled}
      >
        <FontAwesome name={name} />
      </BSButton>
    );
  }

  render() {
    const {entryId, className} = this.props;
    const {isBookmarked} = this.state;

    const isDisabled = isAuthenticated()
                        && isMaximumBookmarksReached()
                        && !isBookmarked;

    const button = this.renderButton(isDisabled);

    if (!isDisabled) {
      return button;
    }

    return (
      <OverlayTrigger placement="top" overlay={
        <Tooltip id="bookmark-button">{tr.bookmarkMaxLengthDisabled}</Tooltip>
      }>
        <div className={`tooltip-button-disabled ${className}`}>{button}</div>
      </OverlayTrigger>
    );
  }

}

export default EventHOC(Button, ['bookmarks']);
