import {Components, registerComponent} from 'meteor/vulcan:lib';
import withMessages from '../containers/withMessages.js';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'meteor/vulcan:i18n';

class Flash extends PureComponent {

  constructor() {
    super();
    this.dismissFlash = this
      .dismissFlash
      .bind(this);
  }

  componentDidMount() {
    this.props.markAsSeen && this
      .props
      .markAsSeen(this.props.message._id);
  }

  dismissFlash(e) {
    if (this.props.clear) {
      e.preventDefault();
      this
        .props
        .clear(this.props.message._id);
    }
  }

  getProperties = (errorObject = this.props.message.content) => {
    switch (typeof errorObject) {
        case 'undefined':
        console.log("FLASH", this.props.message);
        // try backwards compatibility
        if (this.props.message && this.props.message.properties && this.props.message.properties.errorMessage) {
          return this.getProperties(this.props.message.properties.errorMessage);
        }
        return { message: "Unknown error", type: 'error' }

        case 'string' :
        // if error is a string, use it as message
        return {message: errorObject, type: 'error'}

        default:
        // else return full error object after internationalizing message
        const {id, message, properties} = errorObject;
        const translatedMessage = this
          .context
          .intl
          .formatMessage({
            id,
            defaultMessage: message
          }, properties);
        return {
          ...errorObject,
          message: translatedMessage
        };
    }
  }

  render() {

    const {
      message,
      type = 'danger'
    } = this.getProperties();
    const flashType = type === 'error'
      ? 'danger'
      : type; // if flashType is "error", use "danger" instead

    return (
      <Components.Alert
        className="flash-message"
        variant={flashType}
        onDismiss={this.dismissFlash}>
        <span dangerouslySetInnerHTML={{
          __html: message
        }}/>
      </Components.Alert>
    )
  }
}

Flash.propTypes = {
  message: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired])
}

Flash.contextTypes = {
  intl: intlShape
};

registerComponent('Flash', Flash);

const FlashMessages = ({messages, clear, markAsSeen}) => {
  return (
    <div className="flash-messages">
      {messages
        .filter(message => message.show)
        .map(message => <Components.Flash
          key={message._id}
          message={message}
          clear={clear}
          markAsSeen={markAsSeen}/>)}
    </div>
  );
}

FlashMessages.displayName = 'FlashMessages';

registerComponent('FlashMessages', FlashMessages, withMessages);

export default withMessages(FlashMessages);
