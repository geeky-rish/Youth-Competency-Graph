require('dotenv').config();
const mailSender = require('./src/utils/mailSender');

(async () => {
    try {
        console.log('SMTP Host:', process.env.SMTP_HOST);
        console.log('SMTP User:', process.env.SMTP_USER);
        console.log('Sending test email to:', process.env.MAIL_USER);

        await mailSender(process.env.MAIL_USER, 'Test Subject', '<h1>Test Body</h1>');
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email failed:', error);
    }
})();
