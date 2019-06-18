import VulcanEmail from 'meteor/vulcan:email';
import Users from 'meteor/vulcan:users';
import { getSetting, registerSetting, Utils } from 'meteor/vulcan:lib';

registerSetting('defaultEmail');

// const _is_admin = () => Users.isAdminById(this.userId);
const _is_admin = () => getSetting('enableDevelopmentEmails', false);

Meteor.methods({
  "email.test": function (emailName) {

    // console.log(`######## email.test ${emailName}`);
    const email = VulcanEmail.emails[emailName];

    // console.log(`######## email.test`, VulcanEmail.emails[emailName]);

    if(_is_admin()){

      console.log("// testing email [" + emailName + "]", email); // eslint-disable-line
      let html, properties;

      // if email has a custom way of generating its HTML, use it
      if (typeof email.getTestHTML !== "undefined") {

        html = email.getTestHTML.bind(email)();

        // console.log(`######## email.test: html`, html);
      } else {

        // console.log(`######## email.test: email`, email);

        // else get test object (sample post, comment, user, etc.)
        const testObject = email.getTestObject();

        console.log(`######## email.test: email.template`, email.template);

        // get test object's email properties
        properties = email.getProperties(testObject);

        console.log(`######## email.test: properties`, VulcanEmail.getTemplate(email.template));

        // then apply email template to properties, and wrap it with buildTemplate
        html = VulcanEmail.buildTemplate(VulcanEmail.getTemplate(email.template)(properties));

        console.log(`######## email.test: html2`, html);
}

      // get subject
      const subject = "[Test] " + email.subject.bind(email)(properties);

      VulcanEmail.send (getSetting('defaultEmail'), subject, html)

      return subject;

    } else {
      throw new Error(Utils.encodeIntlError({id: "app.noPermission"}));
    }
  }
});
