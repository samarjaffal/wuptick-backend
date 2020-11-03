const Email = require('../helpers/email-helper');
const { config } = require('../config/index');
const { createEmailToken } = require('../shared/tokens');

const emailTemplates = {
    sendInvitationToRegister: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'Confirm Email',
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
};
