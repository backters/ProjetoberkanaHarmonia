import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// In-memory + file leads storage
interface StoredLead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  scores: Record<string, number>;
  overallAverage: number;
  harmonyIndex: number;
  leverageAreaName: string;
  createdAt: string;
}

const LEADS_FILE = path.join(__dirname, 'leads_database.json');
let leadsDatabase: StoredLead[] = [];

try {
  if (fs.existsSync(LEADS_FILE)) {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    leadsDatabase = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Could not read leads file, initializing in-memory store:', err);
  leadsDatabase = [];
}

const saveLeadsToFile = () => {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leadsDatabase, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist leads to file:', err);
  }
};

// Setup nodemailer transporter
let transporter: Transporter;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Graceful test transport: logs and renders preview
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

// Generate beautiful HTML email template
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
  <title>Seu Mapeamento Energético – Harmonia de Vida</title>
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
    .columns { display: table; width: 100%; margin: 20px 0; }
    .col { display: table-cell; width: 50%; vertical-align: top; padding: 12px; }
    .col-box { background: #F8FAFC; border-radius: 12px; padding: 16px; }
    .col-exp { background: #F0FDF4; border: 1px solid #DCFCE7; }
    .col-harm { background: #FFF7ED; border: 1px solid #FFEDD5; }
    .col-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
    .item-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px dashed rgba(0,0,0,0.06); }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #7C2D82, #B83280); color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin-top: 24px; text-align: center; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>Fabiana Berkana · Taróloga & Terapeuta Energética Familiar</p>
      <h1>Diagnóstico da Harmonia Energética</h1>
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
        <a href="https://wa.me/?text=Ol%C3%A1%20Fabiana%2C%20fiz%20minha%20Roda%20da%20Vida%20de%20Harmonia%20Energ%C3%A9tica%20e%20gostaria%20de%20agendar%20uma%20sess%C3%A3o." target="_blank" class="cta-btn">
          Agendar Minha Sessão com Fabiana Berkana ✦
        </a>
      </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Fabiana Berkana · Harmonia de Vida</p>
      <p>Você recebeu este e-mail automaticamente ao finalizar seu diagnóstico.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// API Routes

// 1. POST /api/leads - Store lead
app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const { name, email, phone, scores, overallAverage, harmonyIndex, leverageAreaName } = req.body;

    const newLead: StoredLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name || '',
      email: email || '',
      phone: phone || '',
      scores: scores || {},
      overallAverage: overallAverage || 0,
      harmonyIndex: harmonyIndex || 0,
      leverageAreaName: leverageAreaName || '',
      createdAt: new Date().toISOString(),
    };

    leadsDatabase.unshift(newLead);
    saveLeadsToFile();

    res.status(201).json({ success: true, lead: newLead });
  } catch (err: any) {
    console.error('Error storing lead:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/leads - List all leads
app.get('/api/leads', (_req: Request, res: Response) => {
  res.json({ success: true, leads: leadsDatabase });
});

// 3. DELETE /api/leads - Clear leads
app.delete('/api/leads', (_req: Request, res: Response) => {
  leadsDatabase = [];
  saveLeadsToFile();
  res.json({ success: true, message: 'Histórico de leads limpo com sucesso' });
});

import { Resend } from 'resend';

function cleanBase64(dataUrlOrBase64: string): string {
  if (!dataUrlOrBase64) return '';
  return dataUrlOrBase64.replace(/^data:image\/\w+;base64,/, '').trim();
}

function createAdminEmailHtml(params: {
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  focusArea: string;
  title: string;
  average: number;
  frequencyName: string;
  frequencyHz: number;
  reading: string;
  expansionPoints: Array<{ name: string; score: number }>;
  harmonizationPoints: Array<{ name: string; score: number }>;
  scores: Array<{ id?: number; name: string; score: number; summary?: string }>;
  hasChartImage: boolean;
}): string {
  const avg = Number(params.average) || 5;
  const nowBr = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Novo Diagnóstico Energético - Fabiana Berkana</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF5F8; color: #2D1A2E; margin: 0; padding: 20px; }
    .container { max-width: 640px; margin: 0 auto; background: #FFFFFF; border: 1px solid #F0D5E5; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(180, 50, 150, 0.08); }
    .header { background: linear-gradient(135deg, #7C2D82, #B83280, #D946EF); color: #FFFFFF; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0 0 6px; font-size: 24px; font-weight: 600; font-family: Georgia, serif; }
    .header p { margin: 0; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #FCE7F3; }
    .content { padding: 28px 24px; }
    .badge { display: inline-block; background: #FCE7F3; color: #9D174D; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .lead-box { background: #FCF8FA; border: 1px solid #FBCFE8; border-radius: 16px; padding: 20px; margin: 20px 0; }
    .lead-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .lead-table td { padding: 6px 4px; vertical-align: top; }
    .lead-label { color: #831843; font-weight: 600; width: 38%; }
    .lead-val { color: #2D1A2E; font-weight: 500; }
    .score-banner { background: linear-gradient(135deg, #FDF2F8, #FCE7F3); border: 1px solid #F472B6; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
    .score-number { font-size: 44px; font-weight: 700; color: #831843; font-family: Georgia, serif; line-height: 1; }
    .chart-box { text-align: center; margin: 28px 0; padding: 18px; background: #FFFFFF; border: 1px solid #F0D5E5; border-radius: 16px; }
    .reading-box { background: #FFF7ED; border-left: 4px solid #F97316; padding: 16px 20px; border-radius: 0 12px 12px 0; font-style: italic; line-height: 1.6; font-size: 14px; color: #7C2D12; margin: 20px 0; }
    .bar-bg { background: #F3E8FF; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 6px; }
    .bar-fill { background: linear-gradient(90deg, #EC4899, #8B5CF6); height: 8px; border-radius: 4px; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: #9CA3AF; border-top: 1px solid #F3F4F6; background: #FAFAFA; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>✦ Lead Captado no Sistema de Diagnóstico ✦</p>
      <h1>Novo Diagnóstico Energético</h1>
      <p style="margin-top: 6px; opacity: 0.9;">${params.title}</p>
    </div>

    <div class="content">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="badge">Área: ${params.focusArea}</span>
        <span style="font-size: 12px; color: #831843; font-weight: 600;">Data: ${nowBr}</span>
      </div>

      <!-- DADOS DO LEAD -->
      <div class="lead-box">
        <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 15px; color: #831843; font-family: Georgia, serif; border-bottom: 1px solid #FCE7F3; padding-bottom: 8px;">
          ✦ Dados de Contato do Lead
        </h3>
        <table class="lead-table">
          <tr>
            <td class="lead-label">Nome:</td>
            <td class="lead-val"><strong>${params.leadName || 'Não informado (Anônimo)'}</strong></td>
          </tr>
          <tr>
            <td class="lead-label">E-mail:</td>
            <td class="lead-val">
              ${params.leadEmail ? `<a href="mailto:${params.leadEmail}" style="color: #9D174D; font-weight: bold; text-decoration: none;">${params.leadEmail}</a>` : 'Não informado'}
            </td>
          </tr>
          <tr>
            <td class="lead-label">WhatsApp / Telefone:</td>
            <td class="lead-val">
              ${params.leadPhone ? `<a href="https://wa.me/${params.leadPhone.replace(/\D/g, '')}" target="_blank" style="color: #059669; font-weight: bold; text-decoration: none;">${params.leadPhone} 💬 (Chamar no WhatsApp)</a>` : 'Não informado'}
            </td>
          </tr>
          <tr>
            <td class="lead-label">Foco Escolhido:</td>
            <td class="lead-val"><strong>${params.focusArea}</strong></td>
          </tr>
        </table>
      </div>

      <!-- SCORE BANNER -->
      <div class="score-banner">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9D174D;">
          Média Geral do Diagnóstico (Escala de 1 a 9)
        </div>
        <div class="score-number" style="margin: 8px 0;">
          ${avg.toFixed(1)} <span style="font-size: 18px; font-weight: normal; color: #9D174D;">/ 9.0</span>
        </div>
        <div style="font-size: 15px; font-weight: 600; color: #831843;">
          Frequência Vibracional: <strong>${params.frequencyName}</strong> (~${params.frequencyHz} Hz)
        </div>
      </div>

      <!-- IMAGEM DO GRÁFICO (CID INLINE ATTACHMENT - SEM BLOQUEIO NO GMAIL) -->
      ${params.hasChartImage ? `
      <div class="chart-box">
        <h4 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #831843;">
          ✦ Gráfico da Roda da Harmonia Energética
        </h4>
        <img src="cid:chart-wheel-image" alt="Gráfico da Roda dos 12 Pilares" width="560" style="width: 100%; max-width: 560px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="margin: 10px 0 0; font-size: 11px; color: #9CA3AF;">
          Imagem gerada automaticamente e incorporada via anexo interno (sem bloqueio de imagens externas).
        </p>
      </div>
      ` : ''}

      <!-- LEITURA ENERGÉTICA -->
      <div class="reading-box">
        <p style="margin: 0; font-size: 14px; line-height: 1.6;">
          "${params.reading}"
        </p>
      </div>

      <!-- DESTAQUES: EXPANSÃO & HARMONIZAÇÃO -->
      <div style="margin: 24px 0;">
        <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0;">
          <tr>
            <td style="width: 50%; vertical-align: top; background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 12px; padding: 14px;">
              <div style="font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 8px;">
                ✦ Pontos de Expansão (Maiores notas):
              </div>
              ${params.expansionPoints.map(p => `
                <div style="font-size: 12px; color: #14532D; margin-bottom: 4px;">
                  • <strong>${p.name}</strong>: ${p.score}/9
                </div>
              `).join('')}
            </td>
            <td style="width: 50%; vertical-align: top; background: #FFF1F2; border: 1px solid #FFE4E6; border-radius: 12px; padding: 14px;">
              <div style="font-size: 13px; font-weight: 700; color: #9F1239; margin-bottom: 8px;">
                ❀ Pedem Harmonização (Menores notas):
              </div>
              ${params.harmonizationPoints.map(p => `
                <div style="font-size: 12px; color: #881337; margin-bottom: 4px;">
                  • <strong>${p.name}</strong>: ${p.score}/9
                </div>
              `).join('')}
            </td>
          </tr>
        </table>
      </div>

      <!-- RELATÓRIO COMPLETO DOS 12 PILARES -->
      <div style="margin-top: 32px;">
        <h3 style="font-size: 16px; color: #4A1D4B; margin-bottom: 12px; font-family: Georgia, serif; border-bottom: 2px solid #FCE7F3; padding-bottom: 6px;">
          ✦ Avaliação Detalhada dos 12 Pilares (Escala de 1 a 9)
        </h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${params.scores.map((p, idx) => {
            const pct = Math.round(((p.score || 1) / 9) * 100);
            return `
            <tr style="border-bottom: 1px solid #FCE7F3;">
              <td style="padding: 10px 6px; vertical-align: top; width: 45%;">
                <div style="font-weight: 700; color: #2D1A2E;">${idx + 1}. ${p.name}</div>
                ${p.summary ? `<div style="font-size: 11px; color: #6B7280; margin-top: 3px; font-style: italic;">"${p.summary}"</div>` : ''}
              </td>
              <td style="padding: 10px 6px; vertical-align: middle; width: 40%;">
                <div class="bar-bg">
                  <div class="bar-fill" style="width: ${pct}%;"></div>
                </div>
              </td>
              <td style="padding: 10px 6px; vertical-align: middle; text-align: right; width: 15%;">
                <span style="font-size: 15px; font-weight: 700; color: #9D174D;">${p.score}</span>
                <span style="font-size: 11px; color: #9CA3AF;">/9</span>
              </td>
            </tr>
            `;
          }).join('')}
        </table>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 4px; font-weight: 600; color: #4B5563;">Fabiana Berkana · Sistema de Diagnóstico Harmonia de Vida</p>
      <p style="margin: 0; color: #9CA3AF;">Notificação automática gerada na conclusão do autoexame consciente.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// 4. POST /api/send-report - Send diagnostic report email
app.post('/api/send-report', async (req: Request, res: Response) => {
  try {
    const {
      userEmail,
      name,
      phone,
      scores,
      average,
      frequencyName,
      frequencyHz,
      reading,
      expansionPoints,
      harmonizationPoints,
      focusArea,
      title,
      chartImage,
    } = req.body;

    const formattedScores = Array.isArray(scores) ? scores : [];
    const clientName = (name || '').trim();
    const clientEmail = (userEmail || '').trim();
    const clientPhone = (phone || '').trim();
    const avgNum = Number(average) || 5;

    const clientFocusArea = focusArea || 'Não especificada';
    const clientTitle = title || 'Diagnóstico da Harmonia Energética';

    // Recipient email from environment variable RECIPIENT_EMAIL (defaults to fabianaberkana@gmail.com)
    const recipientEmail = (process.env.RECIPIENT_EMAIL || 'fabianaberkana@gmail.com').trim();
    const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
    const fromAddress = (process.env.RESEND_FROM || 'Fabiana Berkana <onboarding@resend.dev>').trim();

    // Prepare chart image CID inline attachment to avoid Gmail image blocking
    const rawChartBase64 = cleanBase64(chartImage);
    const hasChart = Boolean(rawChartBase64 && rawChartBase64.length > 50);

    const emailSubject = `✦ [Novo Diagnóstico] ${clientName || 'Consulente'} · ${clientFocusArea} · Média ${avgNum.toFixed(1)}/9`;

    const adminHtml = createAdminEmailHtml({
      leadName: clientName,
      leadEmail: clientEmail,
      leadPhone: clientPhone,
      focusArea: clientFocusArea,
      title: clientTitle,
      average: avgNum,
      frequencyName: frequencyName || 'Coragem',
      frequencyHz: Number(frequencyHz) || 200,
      reading: reading || '',
      expansionPoints: expansionPoints || [],
      harmonizationPoints: harmonizationPoints || [],
      scores: formattedScores,
      hasChartImage: hasChart,
    });

    let emailSent = false;

    // Send via Resend SDK
    if (resendApiKey) {
      try {
        const resendInstance = new Resend(resendApiKey);
        const attachmentsPayload: any[] = [];
        if (hasChart) {
          attachmentsPayload.push({
            filename: 'grafico-roda-harmonia.png',
            content: rawChartBase64,
            content_type: 'image/png',
            content_id: 'chart-wheel-image',
          });
        }

        const resendPayload: any = {
          from: fromAddress,
          to: [recipientEmail],
          subject: emailSubject,
          html: adminHtml,
        };

        if (attachmentsPayload.length > 0) {
          resendPayload.attachments = attachmentsPayload;
        }

        const resendResult = await resendInstance.emails.send(resendPayload);
        console.log('Resend send success in server.ts:', resendResult);
        emailSent = true;
      } catch (resendErr: any) {
        console.error('Error sending with Resend SDK in server.ts:', resendErr);
      }
    }

    // Fallback to nodemailer transporter if Resend didn't send
    if (!emailSent) {
      try {
        const mailAttachments: any[] = [];
        if (hasChart) {
          mailAttachments.push({
            filename: 'grafico-roda-harmonia.png',
            content: Buffer.from(rawChartBase64, 'base64'),
            cid: 'chart-wheel-image',
          });
        }

        await transporter.sendMail({
          from: fromAddress,
          to: recipientEmail,
          subject: emailSubject,
          html: adminHtml,
          attachments: mailAttachments,
        });
      } catch (err: any) {
        console.warn('Transporter error in server.ts:', err.message);
      }
    }

    // Save lead record in database
    const scoreMap: Record<string, number> = {};
    formattedScores.forEach((s: any) => {
      scoreMap[s.name] = s.score;
    });

    leadsDatabase.unshift({
      id: `lead_${Date.now()}`,
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      scores: scoreMap,
      overallAverage: avgNum,
      harmonyIndex: Math.round(((avgNum || 5) / 9) * 100),
      leverageAreaName: frequencyName || '',
      createdAt: new Date().toISOString(),
    });
    saveLeadsToFile();

    res.json({
      success: true,
      message: 'Diagnóstico processado com sucesso.',
      delivered: emailSent,
      recipient: recipientEmail,
    });
  } catch (err: any) {
    console.error('Error in send-report:', err);
    res.status(200).json({ success: true, message: err.message });
  }
});

// 5. POST /api/ai-insights - Generate Gemini AI Insights
app.post('/api/ai-insights', async (req: Request, res: Response) => {
  try {
    const { scores, harmonyIndex, strongestArea, criticalArea, leverageArea } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        analysis: `Observando sua maior força em ${strongestArea} e seu desafio em ${criticalArea}, a sua Área Alavanca (${leverageArea}) é a chave mestra. Foque em micro-hábitos de 15 minutos ao acordar para construir consistência sem atrito.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é um mentor sênior de desenvolvimento pessoal e harmonia integral da Berkana Harmonia.
O usuário concluiu a Roda da Vida com as seguintes métricas:
- Índice de Harmonia: ${harmonyIndex}% (de 100%)
- Maior Fortaleza: ${strongestArea}
- Ponto de Atenção: ${criticalArea}
- Área Alavanca Estratégica: ${leverageArea}
- Notas das áreas: ${JSON.stringify(scores)}

Escreva uma análise concisa e profundamente inspiradora (máximo 3 frases) em tom acolhedor, objetivo e pragmático (português do Brasil). Explique por que focar na Área Alavanca (${leverageArea}) criará um efeito dominó de transformação nos próximos 30 dias.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    res.json({ analysis: text.trim() });
  } catch (err: any) {
    console.warn('Error with Gemini API, fallback to heuristic insight:', err.message);
    res.json({
      analysis: `A sua Área Alavanca (${req.body.leverageArea || 'Saúde & Disposição'}) é o pilar que sustenta o restante da sua estrutura. Dedicar 20 minutos de atenção diária exclusiva a este ponto é a forma mais rápida de restabelecer o equilíbrio e a fluidez na sua rotina.`,
    });
  }
});

// Setup Vite or Static Server
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Berkana Harmonia server running on http://0.0.0.0:${port}`);
  });
}

startServer();
