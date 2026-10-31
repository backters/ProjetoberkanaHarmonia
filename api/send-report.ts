import type { Request, Response } from 'express';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const NOTIFY_ADMIN_EMAIL = 'fabianaberkana@gmail.com';

function createEmailTemplate(params: {
  recipientName?: string;
  average: number;
  frequencyName: string;
  frequencyHz: number;
  reading: string;
  expansionPoints: Array<{ name: string; score: number }>;
  harmonizationPoints: Array<{ name: string; score: number }>;
  scores: Array<{ name: string; score: number }>;
}): string {
  const name = params.recipientName ? params.recipientName : 'Querida alma';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Seu Mapeamento Energético – Método Berkana de Harmonia de Vida</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF5F8; color: #2D1A2E; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #F0D5E5; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(180, 50, 150, 0.08); }
    .header { background: linear-gradient(135deg, #7C2D82, #B83280, #D946EF); color: #FFFFFF; padding: 36px 24px; text-align: center; }
    .header h1 { margin: 0 0 6px; font-size: 26px; font-weight: 500; font-family: Georgia, serif; }
    .header p { margin: 0; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: #FCE7F3; }
    .content { padding: 32px 24px; }
    .score-card { background: #FDF4F9; border: 1px solid #FBCFE8; border-radius: 16px; padding: 24px; text-align: center; margin: 20px 0; }
    .score-avg { font-size: 48px; font-weight: 700; color: #9D174D; margin: 0; font-family: Georgia, serif; }
    .score-freq { font-size: 16px; font-weight: 600; color: #831843; margin-top: 6px; }
    .reading-box { background: #FFFFFF; border-left: 3px solid #BE185D; padding: 16px 20px; margin: 24px 0; border-radius: 0 12px 12px 0; background: #FDF2F8; font-style: italic; line-height: 1.6; font-size: 14px; color: #4A1D4B; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #7C2D82, #B83280); color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin-top: 24px; text-align: center; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>Fabiana Berkana · Taróloga & Terapeuta Energética Familiar</p>
      <h1>Diagnóstico da Harmonia Energética (Método Berkana)</h1>
    </div>

    <div class="content">
      <p style="font-size: 16px; line-height: 1.5; margin-top: 0;">
        Olá, <strong>${name}</strong>!
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #5B215E;">
        Seu mapeamento energético foi concluído com sucesso. Cada pilar da sua vida reflete o estado atual da sua vibração (escala de 1 a 9) e revela caminhos claros para restauração e expansão:
      </p>

      <div class="score-card">
        <div style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9D174D;">Média Geral da Roda (1 a 9)</div>
        <div class="score-avg">${params.average.toFixed(1)} / 9</div>
        <div class="score-freq">Frequência: <strong>${params.frequencyName}</strong> (~${params.frequencyHz} Hz)</div>
      </div>

      <div class="reading-box">
        "${params.reading}"
      </div>

      <div style="margin: 24px 0;">
        <h3 style="font-size: 16px; color: #4A1D4B; margin-bottom: 12px;">✦ Seus 12 Pilares Avaliados:</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${params.scores.map((p) => `
            <tr style="border-bottom: 1px solid #F3E8FF;">
              <td style="padding: 8px 4px; color: #2D1A2E;">${p.name}</td>
              <td style="padding: 8px 4px; text-align: right; font-weight: 700; color: #9D174D;">${p.score}/9</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <p style="font-size: 14px; color: #5B215E; margin-bottom: 14px;">
          Deseja agendar uma sessão individual com Fabiana Berkana para harmonizar seus pilares?
        </p>
        <a href="https://wa.me/?text=Ol%C3%A1%20Fabiana%2C%20fiz%20minha%20Roda%20da%20Vida%20pelo%20M%C3%A9todo%20Berkana%20de%20Harmonia%20de%20Vida%20e%20gostaria%20de%20agendar%20uma%20sess%C3%A3o." target="_blank" class="cta-btn">
          Agendar Minha Sessão com Fabiana Berkana ✦
        </a>
      </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Fabiana Berkana · Método Berkana de Harmonia de Vida</p>
      <p>Você recebeu este e-mail automaticamente ao finalizar seu diagnóstico.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

async function dispatchEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const fromAddress = process.env.RESEND_FROM || 'Fabiana Berkana <onboarding@resend.dev>';
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const response = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
      });
      return { success: true, response };
    } catch (err: any) {
      console.error('Error in Resend:', err);
    }
  }

  // Nodemailer fallback if SMTP configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return { success: true, info };
    } catch (err: any) {
      console.warn('Nodemailer error:', err);
    }
  }

  return { success: false, message: 'No email transport configured' };
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userEmail,
      name,
      scores,
      average,
      frequencyName,
      frequencyHz,
      reading,
      expansionPoints,
      harmonizationPoints,
    } = req.body;

    const formattedScores = Array.isArray(scores) ? scores : [];
    const clientName = (name || '').trim();
    const clientEmail = (userEmail || '').trim();
    const avgNum = Number(average) || 5;

    const clientFocusArea = req.body.focusArea || 'Não especificada';
    const clientTitle = req.body.title || 'Diagnóstico da Harmonia Energética (Método Berkana)';

    // 1. Template for Fabiana Berkana (Admin)
    const adminHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Novo Diagnóstico - Método Berkana</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF5F8; color: #2D1A2E; margin: 0; padding: 20px; }
    .box { max-width: 580px; margin: 0 auto; background: #FFF; border: 1px solid #F0D5E5; border-radius: 16px; padding: 28px; }
    h2 { color: #831843; margin-top: 0; font-family: Georgia, serif; }
    .lead-info { background: #FDF2F8; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 14px; }
    .score-badge { display: inline-block; background: #831843; color: #FFF; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
    td, th { padding: 8px; border-bottom: 1px solid #FCE7F3; text-align: left; }
    th { color: #831843; }
  </style>
</head>
<body>
  <div class="box">
    <h2>✦ Novo Diagnóstico: ${clientTitle}</h2>
    <div class="lead-info">
      <p><strong>Área Escolhida para o Diagnóstico:</strong> <span style="color:#831843; font-weight:bold;">${clientFocusArea}</span></p>
      <p><strong>Nome informado:</strong> ${clientName || 'Não informado (Anônimo)'}</p>
      <p><strong>E-mail informado:</strong> ${clientEmail || 'Não informado pelo consulente'}</p>
      <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
      <p><strong>Média Geral (escala de 1 a 9):</strong> <span class="score-badge">${avgNum.toFixed(1)} / 9</span></p>
      <p><strong>Frequência Sintonizada:</strong> ${frequencyName} (~${frequencyHz} Hz)</p>
    </div>

    <h3 style="color: #4A1D4B; margin-top: 20px;">✦ Pontos de Expansão (Maiores notas):</h3>
    <p style="font-size: 13px; color: #166534;">
      ${(expansionPoints || []).map((p: any) => `<strong>${p.name}</strong> (${p.score}/9)`).join(' · ')}
    </p>

    <h3 style="color: #4A1D4B; margin-top: 16px;">❀ Pedem Harmonização (Menores notas):</h3>
    <p style="font-size: 13px; color: #9A3412;">
      ${(harmonizationPoints || []).map((p: any) => `<strong>${p.name}</strong> (${p.score}/9)`).join(' · ')}
    </p>

    <h3 style="color: #4A1D4B; margin-top: 20px;">Notas dos 12 Pilares (1 a 9):</h3>
    <table>
      <thead>
        <tr><th>Pilar</th><th style="text-align: right;">Nota</th></tr>
      </thead>
      <tbody>
        ${formattedScores.map((p: any) => `
          <tr>
            <td>${p.name}</td>
            <td style="text-align: right; font-weight: bold; color: #831843;">${p.score}/9</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `.trim();

    await dispatchEmail({
      to: NOTIFY_ADMIN_EMAIL,
      subject: `✦ [Novo Diagnóstico] ${clientName || 'Consulente'} · Média ${avgNum.toFixed(1)} (${frequencyName})`,
      html: adminHtml,
    });

    if (clientEmail) {
      const clientHtml = createEmailTemplate({
        recipientName: clientName,
        average: avgNum,
        frequencyName: frequencyName || 'Coragem',
        frequencyHz: Number(frequencyHz) || 200,
        reading: reading || '',
        expansionPoints: expansionPoints || [],
        harmonizationPoints: harmonizationPoints || [],
        scores: formattedScores,
      });

      await dispatchEmail({
        to: clientEmail,
        subject: `✦ Seu Mapeamento Energético – Método Berkana (Frequência: ${frequencyName || 'Harmonia'})`,
        html: clientHtml,
      });
    }

    return res.status(200).json({ success: true, message: 'Diagnóstico processado com sucesso.' });
  } catch (err: any) {
    console.error('Error handling report:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
