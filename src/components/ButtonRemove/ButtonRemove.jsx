import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  ui: state.ui,
});

const ButtonRemove = ({ onClick, ui: { removeStatus } }) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      type="button"
      disabled={removeStatus}
    >
      &times;
    </Button>
  );
};

export default connect(mapStateToProps)(ButtonRemove);
