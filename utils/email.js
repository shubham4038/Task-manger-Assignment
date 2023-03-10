//Sendgird to send email to user

require('dotenv').config({path : './config.env'});
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.EMAIL_API_KEY);

const sendEmail = (to, subject, text, html) => {
    const message = {
      to: to,
      from : process.env.EMAIL_FROM,
      subject: subject,
      text: text,
      html: html
    };
    return sgMail.send(message);
  };
  
module.exports = sendEmail;
