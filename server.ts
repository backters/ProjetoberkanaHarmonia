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

// Setup Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const NOTIFY_ADMIN_EMAIL = 'fabianaberkana@gmail.com';

async function dispatchEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const fromAddress = process.env.RESEND_FROM || 'Fabiana Berkana <onboarding@resend.dev>';

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
      });
      console.log('Resend email response:', response);
      return { success: true, resendResponse: response };
    } catch (resendErr) {
      console.error('Error sending via Resend SDK:', resendErr);
    }
  }

  // Graceful fallback to Nodemailer transporter
  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return { success: true, mailInfo: info };
  } catch (err: any) {
    console.warn('Transporter error:', err.message);
    return { success: false, error: err.message };
  }
}

// 4. POST /api/send-report - Send diagnostic report email
app.post('/api/send-report', async (req: Request, res: Response) => {
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

    // 1. Template for Fabiana Berkana (Admin Notification)
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

    // Send silently to Fabiana Berkana ALWAYS
    await dispatchEmail({
      to: NOTIFY_ADMIN_EMAIL,
      subject: `✦ [Novo Diagnóstico] ${clientName || 'Consulente'} · Média ${avgNum.toFixed(1)} (${frequencyName})`,
      html: adminHtml,
    });

    // 2. If client provided an email at the beginning, send their personal copy as well
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

    // Save lead record in database
    const scoreMap: Record<string, number> = {};
    formattedScores.forEach((s: any) => {
      scoreMap[s.name] = s.score;
    });

    leadsDatabase.unshift({
      id: `lead_${Date.now()}`,
      name: clientName,
      email: clientEmail,
      scores: scoreMap,
      overallAverage: avgNum,
      harmonyIndex: Math.round(((avgNum || 5) / 10) * 100),
      leverageAreaName: frequencyName || '',
      createdAt: new Date().toISOString(),
    });
    saveLeadsToFile();

    res.json({
      success: true,
      message: 'Diagnóstico processado com sucesso.',
    });
  } catch (err: any) {
    console.error('Error in send-report:', err);
    res.status(500).json({ success: false, message: err.message });
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
