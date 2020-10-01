const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const sender = 'economicappsd@gmail.com';
const receiver = 'supertvin3377@gmail.com';
const fs = require('fs');

module.exports.send = function (message) {
    let password = fs.readFileSync('../mailpassword.txt', 'utf8');
    let transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: sender,
            pass: password
        }
    }));

    let mailOptions = {
        from: sender,
        to: receiver,
        subject: 'Lab6',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sanded');
        }
    })
};