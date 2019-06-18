import { Components, registerComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import VulcanEmail from 'meteor/vulcan:email';

class Email extends PureComponent {

  constructor() {
    super();
    this.sendTest = this.sendTest.bind(this);
    this.state = {
      loading: false
    }
  }

  sendTest() {
    this.setState({loading: true});

    // TODO fix this
    try {
      Meteor.call("email.test", this.props.name, (error, result) => {
        this.setState({ loading: false });
        if (error) {
          console.error(error.message);
        } else {
          console.log(`Test email sent (“${result}”).`);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {

    const { email, name } = this.props;

    return (
      <tr>
        <td>{name}</td>
        <td><a href={'/email/template/'+email.template} target="_blank">{email.template}</a></td>
        <td>{typeof email.subject === 'function' ? email.subject({}) : email.subject}</td>
        <td><a href={email.path.replace(':_id?', '').replace(':documentId?', '')} target="_blank">{email.path}</a></td>
        <td>
          <div className={this.state.loading ? 'test-email loading' : 'test-email'}>
            <Components.Button disabled={this.state.loading} onClick={this.sendTest} variant="primary">Send Test</Components.Button>
            {this.state.loading ? <Components.Loading color="white"/> : null}
          </div>
        </td>
      </tr>
    )
  }
}

Email.propTypes = {
  email: PropTypes.object,
  name: PropTypes.string
};

const Emails = (/* props*/) => {

  const emails = VulcanEmail.emails;

  return (
    <div className="emails">
      <h1>Emails</h1>

      <div className="emails-wrapper">

        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Template</td>
              <td>Subject</td>
              <td>HTML Preview</td>
              <td>Send Test</td>
            </tr>
          </thead>
          <tbody>
            {_.map(emails, (email, key) => <Email key={key} email={email} name={key}/>)}
          </tbody>
        </table>

      </div>

    </div>
  )
};

registerComponent('Emails', Emails);

export default Emails;