const mailer = require('nodemailer');

const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASS
    }
});

module.exports = function(email, subject, text) {
    return new Promise((resolve, reject) => {
        let mail = {
            from: process.env.APP_NAME + ' <' + process.env.GOOGLE_EMAIL + '>',
            to: email,
            subject: subject,
            text: text
        };

        console.log(text);

        transporter.sendMail(mail)
            .then(info => resolve('Email sent: ' + info.response))
            .catch(err => reject(err));
    });
}