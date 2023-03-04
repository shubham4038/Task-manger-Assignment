const sgMail = require('@sendgrid/mail');

const API_KEY = process.env.EMAIL_API_KEY;

sgMail.setApiKey(API_KEY);

const sendEmail = (to, subject, text, html) => {
    const message = {
      to: to,
      from: 'reactjs4038@gmail.com',
      subject: subject,
      text: text,
      html: html
    };
    
    return sgMail.send(message);
  };
  
module.exports = sendEmail;
