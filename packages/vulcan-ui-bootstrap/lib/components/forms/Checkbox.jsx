import React from 'react';
import Form from 'react-bootstrap/lib/Form';
import {Components, registerComponent} from 'meteor/vulcan:core';

const CheckboxComponent = ({refFunction, path, inputProperties, itemProperties}) => {
  if (typeof inputProperties.value !== "boolean") {
    inputProperties.value = !!inputProperties.value;
  }

  return (
    <Components.FormItem {...inputProperties} {...itemProperties}>
      <Form.Check
        {...inputProperties}
        id={path}
        ref={refFunction}
        checked={!!inputProperties.value}/>
    </Components.FormItem>
  );
};

registerComponent('FormComponentCheckbox', CheckboxComponent);
