import { Transporter, createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { Mailer, SendMailPayload } from '../mailer.service';

export class InMemoryMailer implements Mailer {
  private transporter: Transporter;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
    });

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: 'hbs',
          layoutsDir: './src/infrastructure/mailer/templates',
          defaultLayout: 'template',
          partialsDir: './src/infrastructure/mailer/templates/',
        },
        viewPath: './src/infrastructure/mailer/templates',
        extName: '.hbs',
      }),
    );
  }

  public async sendMail({ template, to, subject, from, payload }: SendMailPayload): Promise<void> {
    await this.transporter.sendMail({
      // @ts-ignore
      template,
      to,
      subject,
      from: from ?? process.env.SERVICE_MAIL,
      context: payload,
    });
  }
}
