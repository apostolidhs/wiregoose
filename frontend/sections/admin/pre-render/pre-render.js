import React from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import ListView from '../../../components/list-view/list-view.js';
import Form from '../../../components/pre-render/form.js';
import ResponseTransformation
  from '../../../components/pre-render/response-transformation.js';
import * as DateUtilities
  from '../../../components/utilities/dates.js';

export default class PreRender extends ListView {
  static columns = [
    {
      id: 'link',
      dataFormat: cell => (
        <div>
          <div>{cell}</div>
          <div className=''>{decodeURIComponent(cell)}</div>
        </div>
      )
    },
    {
      id: 'createdAt',
      dataFormat: (cell, { createdAt }) => {
        return (
          <span>
            {DateUtilities.toText(createdAt, true)}
          </span>
        )
      },
      width: '180px'
    },
    {
      id: 'hits',
      width: '80px'
    },
    {
      id: '_id',
      columnTitle: true,
      width: '70px'
    }
  ];

  constructor() {
    super({
      modelName: 'preRender',
      transformation: r => ResponseTransformation(r),
      columns: PreRender.columns,
      title: 'Pre Render',
      form: Form,
      defaultSort: {
        defaultSortName: 'createdAt',
        defaultSortOrder: 'desc'
      }
    });
  }
}
