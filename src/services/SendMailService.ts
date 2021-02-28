import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

class SendMailService {
  transporter: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.transporter = transporter;
    });
  }

  async execute(
    to: string,
    subject: string,
    variables: {
      name: string;
      title: string;
      description: string;
      survey_user_id: string;
      link: string;
    },
    path: string
  ) {
    const templateFile = fs.readFileSync(path).toString("utf8");

    const mailTemplateParse = handlebars.compile(templateFile);
    const html = mailTemplateParse(variables);

    const message = await this.transporter.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreply@nps.com.br>",
    });

    console.log(`Message Sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

export default new SendMailService();
