import React from 'react';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';
import { Panel } from 'react-bootstrap';

  import * as Auth from '../../components/authorization/auth.js';

import styles from './user.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Profile extends React.Component {

  render() {
    return (
      <Panel>
        <div className="text-center">
          <FontAwesome styleName="profile-icon" name="user-circle" />
          <h4>
            {Auth.getSession().user.email}
          </h4>
        </div>
      </Panel>
    );
  }

}
