import React from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FontAwesome from 'react-fontawesome';
import { FacebookButton, TwitterButton } from 'react-social';

import { FACEBOOK_APP_ID } from '../../../config-public.js';
import tr from '../localization/localization.js';
import Bookmark from '../bookmarks/button.jsx';

export default class SocialShare extends React.Component {

  static propTypes = {
    entryId: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    overlayPlacement: PropTypes.string,
    selfContainer: PropTypes.bool
  }
  static defaultProps = {
    selfContainer: false,
    overlayPlacement: 'top'
  }

  focusOnShareArticlePopover = (rootEl) => {
    const inputEl = rootEl.getElementsByTagName('input')[0];
    inputEl.focus();
    inputEl.select();
  }

  renderShareLinkPopover = () => {
    const { link } = this.props;
    return (
      <Popover id="popover-copy-article-link">
        <h4>{tr.articleLink}</h4>
        <FormControl type="text" defaultValue={link} readOnly />
      </Popover>
    );
  }

  render() {
    const {
      entryId,
      link,
      selfContainer,
      overlayPlacement,
      ...rest
    } = this.props;

    return (
      <div {...rest} >
        <Bookmark className="pull-left" entryId={entryId} />
        <OverlayTrigger
          onEntered={this.focusOnShareArticlePopover}
          trigger="click"
          placement={overlayPlacement}
          overlay={this.renderShareLinkPopover()}
          container={selfContainer ? this : undefined}
          rootClose
        >
          <Button className="btn btn-link blind-link" title={tr.shareLink} >
            <FontAwesome name="link" />
          </Button>
        </OverlayTrigger>
        <FacebookButton
          className="btn btn-link blind-link"
          url={link}
          appId={FACEBOOK_APP_ID}
          title={tr.shareOnFacebook}
        >
          <FontAwesome name="facebook" />
        </FacebookButton>
        <TwitterButton
          className="btn btn-link blind-link"
          url={link}
          title={tr.shareOnTwitter}
        >
          <FontAwesome name="twitter" />
        </TwitterButton>
      </div>
    );
  }

}
