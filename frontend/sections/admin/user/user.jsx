import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import ListView from '../../../components/list-view/list-view.jsx';
import Form from '../../../components/rss-provider/form.jsx';
import * as DateUtilities from '../../../components/utilities/dates.js';
import ResponseTransformation from '../../../components/user/response-transformation.js';
import {displayRole} from '../../../components/user/roles.jsx';

export default class User extends ListView {
  static columns = [
    {
      id: 'email',
      width: 220
    },
    {
      id: 'created',
      dataFormat: (cell, { created }) => DateUtilities.toText(created),
      width: 120
    },
    {
      id: 'totalLogins',
      colName: 'Logins',
      width: 70
    },
    {
      id: 'lastLogin',
      colName: 'Last',
      dataFormat: (cell, { created }) => DateUtilities.toText(created),
      width: 120
    },
    {
      id: 'validationExpiresAt',
      colName: 'Valid',
      dataFormat: (cell, {validationExpiresAt}) =>
        (<FontAwesome name={validationExpiresAt ? 'times' : 'checked'} />),
      width: 60
    },
    {
      id: 'role',
      dataFormat: (cell, {role}) => displayRole(role),
      width: 60
    },
    {
      id: '_id',
      columnTitle: true,
      width: 80
    },
  ];

  constructor() {
    super({
      modelName: 'user',
      columns: User.columns,
      transformation: r => ResponseTransformation(r),
      title: 'Users',
      form: Form
    });
  }
}
