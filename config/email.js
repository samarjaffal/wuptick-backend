const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const { config } = require('./index');

const options = {
    auth: {
        api_key: config.mailPassword, // generated ethereal password
    },
};

const client = nodemailer.createTransport(sgTransport(options));

module.exports = {
    client,
};
