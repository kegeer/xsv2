import React from 'react';
import { connect } from 'react-redux';
import { authSelector } from 'store/selectors/shared/auth';

const IsOwner = ({
  ownerId,
  auth,
  children
}) => (ownerId && auth.user === ownerId ? children : null);

const mapState = state => ({
  auth: authSelector(state)
});

export default connect(mapState)(IsOwner);
