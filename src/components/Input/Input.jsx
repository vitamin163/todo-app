import React from 'react';
import { FormControl } from 'react-bootstrap';

export default ({ input, type, placeholder, isInvalid, isValid }) => {
  return (
    <FormControl
      type={type}
      placeholder={placeholder}
      value={input.value}
      onChange={input.onChange}
      isInvalid={isInvalid}
      isValid={isValid}
    />
  );
};
