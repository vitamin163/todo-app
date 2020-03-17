import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  ui: state.ui,
});

const ButtonRemove = ({ onClick, ui: { removeState } }) => {
  const disabled = removeState === 'request';
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      &times;
    </Button>
  );
};

export default connect(mapStateToProps)(ButtonRemove);
