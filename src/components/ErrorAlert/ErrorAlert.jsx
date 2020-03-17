import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const mapStateToProps = state => {
  const props = {
    ui: state.ui,
  };
  return props;
};

const actionCreators = {
  closeErrorAlert: actions.closeErrorAlert,
};

const ErrorAlert = props => {
  const { children, closeErrorAlert, processName } = props;
  const closeErrorHandler = process => () => {
    closeErrorAlert(process);
  };
  return (
    <Alert
      variant="danger"
      onClose={closeErrorHandler(processName)}
      dismissible
    >
      {children}
    </Alert>
  );
};

export default connect(mapStateToProps, actionCreators)(ErrorAlert);
