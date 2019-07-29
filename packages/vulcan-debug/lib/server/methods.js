import VulcanEmail from 'meteor/vulcan:email';
import Users from 'meteor/vulcan:users';
import { getSetting, registerSetting, Utils } from 'meteor/vulcan:lib';

registerSetting('defaultEmail');

// const _is_admin = () => Users.isAdminById(this.userId);
const _is_admin = () => getSetting('enableDevelopmentEmails', false);

Meteor.methods({
  "email.test": function (emailName) {

    if (_is_admin()) {

      // console.log("// testing email [" + emailName + "]", email); // eslint-disable-line
      const email = VulcanEmail.buildAndSend({ to: getSetting('defaultEmail'), emailName });

    } else {
      const error = Utils.encodeIntlError({ id: "app.noPermission" });
      console.log(`######## email.test: error`, error);
      throw new Error(error);
    }
  }
});
