import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const actionCreators = { logout: actions.logout };
class Logout extends React.Component {
  componentDidMount() {
    const { logout } = this.props;
    logout();
  }

  render() {
    return <Redirect to="/" />;
  }
}
export default connect(null, actionCreators)(Logout);
