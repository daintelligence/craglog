import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  private get apiKey() { return this.config.get<string>('RESEND_API_KEY'); }
  private get frontendUrl() { return this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000'; }
  private get from() { return 'CragLog <noreply@craglog.cloud>'; }

  private async send(to: string, subject: string, html: string) {
    const key = this.apiKey;
    if (!key) {
      this.logger.warn(`[DEV] Email to ${to} — ${subject}`);
      return;
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: this.from, to, subject, html }),
    });
    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Resend error ${res.status}: ${body}`);
    }
  }

  async sendPasswordReset(to: string, name: string, token: string) {
    const url = `${this.frontendUrl}/reset-password?token=${token}`;
    await this.send(to, 'Reset your CragLog password', `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#856440">CragLog</h2>
        <p>Hi ${name},</p>
        <p>Click below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <p style="margin:24px 0">
          <a href="${url}" style="background:#856440;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
            Reset password
          </a>
        </p>
        <p style="color:#999;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `);
  }

  async sendInvite(to: string, inviterName: string, token: string, note?: string) {
    const url = `${this.frontendUrl}/register?invite=${token}`;
    await this.send(to, `${inviterName} invited you to CragLog`, `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#856440">CragLog</h2>
        <p><strong>${inviterName}</strong> has invited you to join CragLog — the UK climbing logbook.</p>
        ${note ? `<p style="background:#f5f0eb;padding:12px;border-radius:8px;font-style:italic">"${note}"</p>` : ''}
        <p style="margin:24px 0">
          <a href="${url}" style="background:#856440;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
            Accept invitation
          </a>
        </p>
        <p style="color:#999;font-size:13px">This invite expires in 30 days. If you weren't expecting this, you can ignore it.</p>
      </div>
    `);
  }
}
