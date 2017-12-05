import React from 'react';
import FontAwesome from 'react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const displayRolesMap = {
  'USER': (
    <OverlayTrigger placement="top" overlay={<Tooltip>User</Tooltip>}>
      <FontAwesome name='user' />
    </OverlayTrigger>
  ),
  'ADMIN': (
    <OverlayTrigger placement="top" overlay={<Tooltip>Admin</Tooltip>}>
      <FontAwesome name='key' />
    </OverlayTrigger>
  )
};

const displayRoleInvalid = (
  <OverlayTrigger placement="top" overlay={<Tooltip>Invalid</Tooltip>}>
    <FontAwesome name='exclamation-triangle' />
  </OverlayTrigger>
);

export function displayRole(role) {
  return displayRolesMap[role] || displayRoleInvalid;
}
