import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';

const DynamicLoading = ({ isLoading, pastDelay, error }) => {
  if (isLoading && pastDelay) {
    return <Components.Loading/>;
  } else if (error && !isLoading) {
    // eslint-disable-next-line no-console
    console.log(error);
    return (
      <div className="text-warning large well">
          <p>Error!</p>
          <div className="small error">
            <code>{JSON.stringify(error)}</code>
          </div>
      </div>
    );
  } else {
    return null;
  }
}

registerComponent('DynamicLoading', DynamicLoading);

export default DynamicLoading;