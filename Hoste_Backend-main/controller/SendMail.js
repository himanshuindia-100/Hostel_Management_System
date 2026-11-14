const nodemailer = require("nodemailer");

// Uses credentials from the backend .env file. Never commit mail credentials.
const sendMail = async (to, subject, text, html = "") => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be configured to send email.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Hostel Admin" <${EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
};

module.exports = sendMail;
