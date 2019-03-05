import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const Default = ({refFunction, inputProperties}) => {
  inputProperties.value = inputProperties.value || " ";
  return (
    <Input {...inputProperties} ref={refFunction} type="text" />
  )
}

  registerComponent('FormComponentDefault', Default);
  registerComponent('FormComponentText', Default);
