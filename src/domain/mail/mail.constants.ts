export const BATCH_MAIL_QUEUE = 'BATCH_MAIL_QUEUE';

export const SEND_BATCH_MAIL = 'SEND_BATCH_MAIL';

export type MailSchedule = 'none' | 'hourly' | 'weekly' | 'monthly';

export type MailServiceProvider =
  | '1und1'
  | 'AOL'
  | 'DebugMail.io'
  | 'DynectEmail'
  | 'FastMail'
  | 'GandiMail'
  | 'Gmail'
  | 'Godaddy'
  | 'GodaddyAsia'
  | 'GodaddyEurope'
  | 'hot.ee'
  | 'Hotmail'
  | 'iCloud'
  | 'mail.ee'
  | 'Mail.ru'
  | 'Mailgun'
  | 'Mailjet'
  | 'Mandrill'
  | 'Naver'
  | 'Postmark'
  | 'QQ'
  | 'QQex'
  | 'SendCloud'
  | 'SendGrid'
  | 'SES'
  | 'Sparkpost'
  | 'Yahoo'
  | 'Yandex'
  | 'Zoho';

export type MailContext = {
  receipient: string;
  subject: string;
  message: string;
};
