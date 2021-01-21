require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT || 3000,
    secret: process.env.S_KEY,
    rfToken: process.env.RT_KEY,
    emailSecret: process.env.EMAIL_SECRET,
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUser: process.env.MAIL_USERNAME,
    mailPassword: process.env.MAIL_PASSWORD,
    frontURL: process.env.FRONT_APP_URL,
    appURL: process.env.APP_URL,
    appDBCredentials: process.env.APP_DB_CREDENTIALS,
    appEnv: process.env.APP_ENV,
    port: process.env.PORT,
    cloudinaryName: process.env.CLOUDINARY_NAME,
    clodinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDDINARY_API_SECRET,
};

module.exports = { config };
