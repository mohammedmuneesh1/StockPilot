import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE } from './template';



const {
  SMTP_HOST,
  SMTP_PASS,
  SMTP_USER,
  SMTP_PORT,
  SENDER_EMAIL,
  
} = process.env;


export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
//   secure: false, // true only for 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});


export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"Signalist" <signalist@jsmastery.pro>`,
        to: email,
        subject: `Welcome to Signalist - your stock market toolkit is ready!`,
        text: 'Thanks for joining Signalist',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}


