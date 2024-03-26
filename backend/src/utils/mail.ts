const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

class MailService {
  connection;
  constructor() {
    this.connection = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "madhavdhungana36@getMaxListeners.com",
        pass: "dwdi dejm wgmy vsze",
      },
    });
  }
  sendMail = async (to: string, subject: string, content: string) => {
    try {
      let msg = {
        from: "Admin User",
        to: to,
        subject: subject,
        html: content,
      };

      let response = await this.connection.sendMail(msg);
      return true;
    } catch (exception) {
      console.log("Email Exception", exception);
    }
  };
}

const mailSvc = new MailService();
module.exports = mailSvc;
