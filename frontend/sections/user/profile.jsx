import React from 'react';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';
import Panel from 'react-bootstrap/lib/Panel';

import * as Auth from '../../components/authorization/auth.js';
import UserAvatar from '../../components/user/avatar.jsx';
import styles from './user.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Profile extends React.Component {

  render() {
    return (
      <Panel>
        <div className="text-center">
          <UserAvatar type="PROFILE" isUser />
          <h4>
            {Auth.getSession().user.email}
          </h4>
        </div>
        {this.renderLoginInfo()}
      </Panel>
    );
  }

  renderLoginInfo() {
    if (Auth.hasFacebookAccount()) {
      return <span>Login via Facebook</span>;
    } else {
      return <span>Login via Wiregoose</span>;
    }
  }

}
