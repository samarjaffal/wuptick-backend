const Email = require('../helpers/email-helper');
const { config } = require('../config/index');
const { createEmailToken } = require('../shared/tokens');

const emailTemplates = {
    sendInvitationToRegister: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'You have been added to a new Project',
        html: '~Hello World~',
    },

    confirmRegistrationEmail: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'Confirm your registration',
        html: '~Hello World~',
    },
};

module.exports = {
    sendInvitationToRegister: (data) => {
        let url, token;
        token = createEmailToken(data);
        console.log(data, 'data');
        url = `${config.frontURL}/register?token=${token}`;
        emailTemplates.sendInvitationToRegister.to = data.email;
        emailTemplates.sendInvitationToRegister.html = `Please click this url to register: <a href="${url}">Register</a>`;
        Email.sendEmail(emailTemplates.sendInvitationToRegister);
    },

    confirmRegistrationEmail: (data) => {
        let url, token;
        token = createEmailToken(data);
        console.log(data, 'data');
        url = `${config.appURL}/confirmation/${token}`;
        emailTemplates.confirmRegistrationEmail.to = data.email;
        emailTemplates.confirmRegistrationEmail.html = `Please click this url to confirm your email <a href="${url}">Confirm</a>`;
        Email.sendEmail(emailTemplates.confirmRegistrationEmail);
    },
};
