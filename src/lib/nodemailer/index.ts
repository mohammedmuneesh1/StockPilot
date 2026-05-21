import nodemailer from 'nodemailer';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './template';

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
        from: `"StockPilot" <${SENDER_EMAIL}>`,
        to: email,
        subject: `Welcome to StockPilot - your stock market toolkit is ready!`,
        text: 'Thanks for joining StockPilot',
        html: htmlTemplate,
    }
    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, 
      date,
      newsContent
         }: { 
            email: string;
            date: string; 
            newsContent: string 
            }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"StockPilot News" <${SENDER_EMAIL}>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from StockPilot`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};



