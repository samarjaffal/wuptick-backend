const { client } = require('../config/email');

module.exports = {
    sendEmail: async () => {
        let email = {
            from: '"Wuptick Team" <dev.wuptick@gmail.com>', // sender address
            to: 'samarjaffalh@gmail.com', // list of receivers
            subject: 'You have been added to a new Project', // Subject line
            html: '<b>Hello world</b>', // html body
        };
        try {
            client.sendMail(email, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    },
};
