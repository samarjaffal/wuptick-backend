const { client } = require('../config/email');

module.exports = {
    sendEmail: async (email) => {
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
