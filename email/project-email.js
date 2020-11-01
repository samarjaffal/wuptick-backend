const Email = require('../helpers/email-helper');
const {
    newMemberTemplate,
} = require('../templates/email-templates/new-member-to-project');

const emailTemplates = {
    newMemberToProject: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'You have been added to a new Project',
        html: newMemberTemplate,
    },
};

module.exports = {
    newMemberToProject: (toEmail) => {
        emailTemplates.newMemberToProject.to = toEmail;
        Email.sendEmail(emailTemplates.newMemberToProject);
    },
};
