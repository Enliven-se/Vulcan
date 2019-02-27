import React from 'react';
import Form from 'react-bootstrap/lib/Form';
import {Components, registerComponent} from 'meteor/vulcan:core';

const TextareaComponent = ({refFunction, inputProperties, itemProperties}) => {
  inputProperties.value = inputProperties.value || " ";

  return (
    <Components.FormItem {...inputProperties} {...itemProperties}>
      <Form.Control as="textarea" ref={refFunction} {...inputProperties}/>
    </Components.FormItem>
  );
}

registerComponent('FormComponentTextarea', TextareaComponent);
