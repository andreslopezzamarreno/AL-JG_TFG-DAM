import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MailDataRequired } from '@sendgrid/mail';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'https://api.sendgrid.com/v3/mail/send';

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, content: string) {
    const emailData: MailDataRequired = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject,
        },
      ],
      from: {
        email: environment.senderEmail,
      },
      content: [
        {
          type: 'text/plain',
          value: content,
        },
      ],
    };

    return this.http.post(this.apiUrl, emailData, {
      headers: {
        Authorization: `Bearer ${environment.sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
