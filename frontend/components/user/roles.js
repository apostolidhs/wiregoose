import React from 'react';
import FontAwesome from 'react-fontawesome';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

const displayRolesMap = {
  'USER': (
    <OverlayTrigger placement="top" overlay={<Tooltip id="roles-user">User</Tooltip>}>
      <FontAwesome name='user' />
    </OverlayTrigger>
  ),
  'ADMIN': (
    <OverlayTrigger placement="top" overlay={<Tooltip id="roles-admin">Admin</Tooltip>}>
      <FontAwesome name='key' />
    </OverlayTrigger>
  )
};

const displayRoleInvalid = (
  <OverlayTrigger placement="top" overlay={<Tooltip id="roles-invalid">Invalid</Tooltip>}>
    <FontAwesome name='exclamation-triangle' />
  </OverlayTrigger>
);

export function displayRole(role) {
  return displayRolesMap[role] || displayRoleInvalid;
}
