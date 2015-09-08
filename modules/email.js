var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();

module.exports = {
    send: function( receiver, subject, text ){
        console.log( "[email] Send a mail to: " + receiver );
        transporter.sendMail({
            from: 'non-reply@nma.dorm',
            to: receiver,
            subject: subject,
            text: text
        });
    }
};
