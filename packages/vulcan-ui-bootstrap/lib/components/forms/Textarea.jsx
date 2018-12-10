import React from 'react';
import { Textarea } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const TextareaComponent = ({refFunction, inputProperties, ...properties}) => {
  inputProperties.value = inputProperties.value || " ";
  return (
    <Textarea ref={refFunction} {...inputProperties} />
  )
}

registerComponent('FormComponentTextarea', TextareaComponent);
