import sgMail, { MailDataRequired, MailService } from '@sendgrid/mail';

import { mailConfig } from '../../config/env';

sgMail.setApiKey(mailConfig.apiKey);

//TODO: will add template option
// interface IEmailInput {
//   from?: string; // Must be a valid email
//   to: string[]; // Must be an array of valid emails
//   subject: string;
//   text: string;
//   cc?: string[];
//   bcc?: string[];
// }

// The intersection enables the type accept additional properties
//  which should represent the template variables
// in the format v:name: string
type IEmailWithTemplateInput = {
  from: string; // Must be a valid email
  to: string[]; // Must be an array of valid emails
  subject: string;
  html: string; // the template name
  cc?: string[];
  bcc?: string[];
} & { [props: string]: string };

class EmailService {
  _mailService: MailService;

  constructor() {
    this._mailService = sgMail;
  }

  async sendEmail(input: MailDataRequired) {
    // const recipients = input.to.join(', ');

    return this._mailService
      .send(input /*, to: recipients*/)
      .then(data => console.log(data))
      .catch(err => console.log(err.response.body));
  }

  async sendEmailWithTemplate(input: IEmailWithTemplateInput) {
    const recipients = input.to.join(', ');

    return this._mailService.send({ ...input, to: recipients });
  }
}

export default new EmailService();
