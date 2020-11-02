const Email = require('../helpers/email-helper');
const { config } = require('../config/index');
const {
    newMemberTemplate,
} = require('../templates/email-templates/new-member-to-project');

const emailTemplates = {
    newMemberToProject: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'You have been added to a new Project',
        html: '~Hello World~',
    },
};

module.exports = {
    newMemberToProject: (toEmail, projectId) => {
        let url;
        url = `${config.frontURL}/project/${projectId}`;
        emailTemplates.newMemberToProject.to = toEmail;
        emailTemplates.newMemberToProject.html = newMemberTemplate(url);
        Email.sendEmail(emailTemplates.newMemberToProject);
    },
};
