import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const CheckboxComponent = ({refFunction, inputProperties}) => {
  if(typeof inputProperties.value !== "boolean"){
    inputProperties.value = !!inputProperties.value;
  }
  return (
    <Checkbox {...inputProperties} ref={refFunction} />
  )
}

registerComponent('FormComponentCheckbox', CheckboxComponent);
