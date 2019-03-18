import Users from '../modules/index.js';
import { runCallbacks, runCallbacksAsync, Utils, debug, debugGroup, debugGroupEnd } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet
import clone from 'lodash/clone';

// TODO: the following should use async/await, but async/await doesn't seem to work with Accounts.onCreateUser
function onCreateUserCallback(options, user) {
  const schema = Users.simpleSchema()._schema;

  delete options.password; // we don't need to store the password digest
  delete options.username; // username is already in user object

  options = runCallbacks('users.new.validate.before', options);

  // validate options since they can't be trusted
  Users.simpleSchema().validate(options);

  // check that the current user has permission to insert each option field
  _.keys(options).forEach(fieldName => {
    var field = schema[fieldName];
    if (!field || !Users.canCreateField(user, field)) {
      throw new Error(Utils.encodeIntlError({ id: 'app.disallowed_property_detected', value: fieldName }));
    }
  });

  // extend user with options
  user = Object.assign(user, options);

  // run validation callbacks
  user = runCallbacks('users.new.validate', user);

  // run onInsert step
  _.keys(schema).forEach(fieldName => {
    if (!user[fieldName] && schema[fieldName].onInsert) {
      const autoValue = schema[fieldName].onInsert(user, options);
      if (autoValue) {
        user[fieldName] = autoValue;
      }
    }
  });

  if (user.username && user.services != 'password') {
    let existingUsername = Meteor.users.findOne({ 'username': user.username });
    if (existingUsername) {
      delete user.username;
    }
  }

  if (user.services) {
    const service = _.keys(user.services)[0];

    let email = user.services[service].email;
    if (!email) {
      if (user.emails) {
        email = user.emails.address;
      }
    }
    if (!email) {
      email = options.email;
    }
    if (!email) {
      // if email is not set, there is no way to link it with other accounts

      user = runCallbacks('users.new.sync', user);
      runCallbacksAsync('users.new.async', user);

         // check if all required fields have been filled in. If so, run profile completion callbacks
      if (Users.hasCompletedProfile(user)) {
        runCallbacksAsync('users.profileCompleted.async', user);
      }
      return user;
    }

       // see if any existing user has this email address, otherwise create new
    let existingUser = Meteor.users.findOne({ 'emails.address': email });
    if (!existingUser) {
          // check for email also in other services
      let existingTwitterUser = Meteor.users.findOne({ 'services.twitter.email': email });
      let existingGoogleUser = Meteor.users.findOne({ 'services.google.email': email });
      let existingFacebookUser = Meteor.users.findOne({ 'services.facebook.email': email });
      let doesntExist = !existingGoogleUser && !existingTwitterUser && !existingFacebookUser;
      if (doesntExist) {
        user = runCallbacks('users.new.sync', user);
        runCallbacksAsync('users.new.async', user);

      // check if all required fields have been filled in. If so, run profile completion callbacks
        if (Users.hasCompletedProfile(user)) {
          runCallbacksAsync('users.profileCompleted.async', user);
        }
        return user;
      } else {
        existingUser = existingGoogleUser || existingTwitterUser || existingFacebookUser;
        if (existingUser) {
          if (user.emails) {
            existingUser.emails = user.emails;
          }
        }
      }
    }

    if (!existingUser.services) {
      existingUser.services = { resume: { loginTokens: [] } };
    }

    existingUser.services[service] = user.services[service];
    if (service === 'password') {
      existingUser.username = user.username;
    }

    Meteor.users.remove({ _id: existingUser._id }); // remove existing record

    existingUser = runCallbacks('users.new.sync', existingUser);
    runCallbacksAsync('users.new.async', existingUser);

  // check if all required fields have been filled in. If so, run profile completion callbacks
    if (Users.hasCompletedProfile(existingUser)) {
      runCallbacksAsync('users.profileCompleted.async', existingUser);
    }

    return existingUser;                  // record will be re-inserted
  } else {

    user = runCallbacks('users.new.sync', user);
    runCallbacksAsync('users.new.async', user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
    if (Users.hasCompletedProfile(user)) {
      runCallbacksAsync('users.profileCompleted.async', user);
    }
    return user;
  }

}

Meteor.startup(() => {
  if (typeof Accounts !== 'undefined') {
    Accounts.onCreateUser(onCreateUserCallback);
  }
});
