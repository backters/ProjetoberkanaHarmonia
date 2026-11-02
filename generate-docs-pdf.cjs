const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(__dirname, 'Docs', 'documentacao-tecnica-harmonia-de-vida.pdf');

// Paleta de Cores do Design System
const COLORS = {
  primary: '#7C2D82',       // Ametista Principal
  primaryDark: '#581C5C',   // Ametista Escuro
  secondary: '#B83280',     // Magenta
  accentPink: '#D946EF',    // Rosa Cósmico
  accentGold: '#D4AF37',    // Dourado Sagrado
  accentGreen: '#10B981',   // Verde Esmeralda
  bgLight: '#FAF5F8',       // Fundo celestial suave
  cardBg: '#FFFFFF',        // Fundo branco card
  border: '#F0D5E5',        // Borda suave
  textDark: '#2D1A2E',      // Texto principal escuro
  textMuted: '#6B516C',     // Texto secundário
  textLight: '#9D829E',     // Texto atenuado
  tableHeader: '#F7EDF5',   // Cabeçalho de tabela
  tableAlt: '#FCF8FB',      // Linha alternada
};

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
  info: {
    Title: 'Documentação Técnica - Diagnóstico da Harmonia Energética',
    Author: 'Fabiana Berkana & Engenharia de Software',
    Subject: 'Especificação Técnica, Design System, URLs e Replicação',
    Keywords: 'Método Berkana, Diagnóstico Energético, Resend, Vercel, Tailwind, React',
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helper para desenhar cabeçalho de página padrão
function drawPageHeader(title) {
  doc.save();
  doc.rect(50, 30, doc.page.width - 100, 1).fill(COLORS.border);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.textMuted);
  doc.text(title.toUpperCase(), 50, 18, { align: 'left' });
  doc.font('Helvetica').fontSize(8).fillColor(COLORS.accentGold);
  doc.text('MÉTODO FABIANA BERKANA', 50, 18, { align: 'right' });
  doc.restore();
}

// Helper para títulos de seção
function drawSectionTitle(number, title) {
  doc.moveDown(1.2);
  const y = doc.y;
  
  // Barra decorativa colorida à esquerda
  doc.save();
  doc.roundedRect(50, y, 4, 22, 2).fill(COLORS.primary);
  doc.restore();

  doc.font('Helvetica-Bold').fontSize(14).fillColor(COLORS.primary);
  doc.text(`${number}. ${title}`, 62, y + 3);
  doc.moveDown(0.6);
}

// Helper para subtítulo
function drawSubTitle(title) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.secondary);
  doc.text(title, { indent: 10 });
  doc.moveDown(0.3);
}

// Helper para texto de parágrafo justificado
function drawParagraph(text) {
  doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.textDark).lineGap(2.5);
  doc.text(text, { align: 'justify' });
  doc.moveDown(0.4);
}

// Helper para caixas de destaque (callouts)
function drawCallout(title, text, borderColor = COLORS.primary, bgColor = COLORS.tableAlt) {
  doc.moveDown(0.4);
  const width = doc.page.width - 100;
  const startY = doc.y;
  
  // Calcula altura necessária
  const titleHeight = title ? 16 : 0;
  doc.font('Helvetica').fontSize(9);
  const textHeight = doc.heightOfString(text, { width: width - 24, lineGap: 2 });
  const boxHeight = titleHeight + textHeight + 18;

  // Verifica quebra de página
  if (startY + boxHeight > doc.page.height - 60) {
    doc.addPage();
  }
  
  const curY = doc.y;
  doc.save();
  doc.roundedRect(50, curY, width, boxHeight, 8).fill(bgColor);
  doc.roundedRect(50, curY, width, boxHeight, 8).stroke(borderColor);
  doc.roundedRect(50, curY, 4, boxHeight, 2).fill(borderColor);
  doc.restore();

  let textY = curY + 8;
  if (title) {
    doc.font('Helvetica-Bold').fontSize(10).fillColor(borderColor);
    doc.text(title, 62, textY);
    textY += 14;
  }
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.textDark).lineGap(2);
  doc.text(text, 62, textY, { width: width - 24, align: 'justify' });

  doc.y = curY + boxHeight + 8;
}

// ==========================================
// PÁGINA 1: CAPA OFICIAL
// ==========================================
// Fundo estilizado com gradiente de contorno
doc.save();
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FAF5F9');
doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1.5).stroke(COLORS.border);
doc.rect(36, 36, doc.page.width - 72, doc.page.height - 72).lineWidth(0.5).stroke(COLORS.accentGold);

// Mandala decorativa concêntrica no topo da capa
const cx = doc.page.width / 2;
const cy = 160;
doc.strokeColor(COLORS.border).lineWidth(0.6);
[25, 45, 65, 85].forEach(r => doc.circle(cx, cy, r).stroke());
for (let i = 0; i < 12; i++) {
  const angle = (i * Math.PI) / 6;
  doc.ellipse(cx, cy, 18, 70, angle).stroke();
}
doc.restore();

// Título e Subtítulos
doc.y = 270;
doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.secondary);
doc.text('DOCUMENTAÇÃO TÉCNICA OFICIAL & ENGENHARIA DE PROJETO', { align: 'center', characterSpacing: 1.5 });

doc.moveDown(0.8);
doc.font('Times-Bold').fontSize(26).fillColor(COLORS.primaryDark);
doc.text('Diagnóstico da Harmonia Energética', { align: 'center' });

doc.moveDown(0.4);
doc.font('Times-Italic').fontSize(14).fillColor(COLORS.accentGold);
doc.text('Método Berkana — Autoexame Consciente & Funil de Conversão', { align: 'center' });

doc.moveDown(1.5);
doc.font('Helvetica').fontSize(10).fillColor(COLORS.textMuted);
doc.text('Especificação Arquitetural, Design System, APIs e Guia de Replicação', { align: 'center' });

// Bloco de Cartão com Metadados Oficiais
const metaY = 410;
const metaWidth = doc.page.width - 140;
doc.save();
doc.roundedRect(70, metaY, metaWidth, 230, 10).fill(COLORS.cardBg);
doc.roundedRect(70, metaY, metaWidth, 230, 10).stroke(COLORS.border);

doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.primary);
doc.text('METADADOS DO PROJETO & IMPLANTAÇÃO', 90, metaY + 16);
doc.rect(90, metaY + 32, metaWidth - 40, 1).fill(COLORS.border);

const metaItems = [
  { label: 'Especialista:', val: 'Fabiana Berkana' },
  { label: 'WhatsApp de Conversão:', val: '+55 (11) 93005-7499' },
  { label: 'E-mail de Leads:', val: 'fabianaberkana@gmail.com' },
  { label: 'Repositório GitHub:', val: 'https://github.com/backters/ProjetoberkanaHarmonia.git' },
  { label: 'Deploy de Produção:', val: 'https://projetoberkanaharmonia.vercel.app' },
  { label: 'Stack Principal:', val: 'React 19 + TypeScript + Tailwind CSS v4 + Vite + Resend' },
  { label: 'Ambiente Serverless:', val: 'Vercel Serverless Functions (Node.js)' },
  { label: 'Data de Homologação:', val: 'Novembro de 2026 — Versão Final Homologada' },
];

let itemY = metaY + 44;
metaItems.forEach(item => {
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.textDark);
  doc.text(item.label, 90, itemY, { width: 150 });
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.secondary);
  doc.text(item.val, 240, itemY, { width: metaWidth - 170 });
  itemY += 21;
});
doc.restore();

doc.y = 690;
doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.textLight);
doc.text('CONFIDENCIAL & DOCUMENTO DE ENGENHARIA DE SOFTWARE', { align: 'center', characterSpacing: 1 });

// ==========================================
// PÁGINA 2: SUMÁRIO & RESUMO ARQUITETURAL
// ==========================================
doc.addPage();
drawPageHeader('SUMÁRIO & VISÃO EXECUTIVA');

doc.y = 55;
drawSectionTitle('0', 'SUMÁRIO GERAL DO DOCUMENTO');

const sumario = [
  '1. Visão Geral da Arquitetura & Fluxo Funcional',
  '2. Histórico e Passo a Passo da Implementação Técnica Realizada',
  '    2.1. Os 12 Pilares Universais e Calibração de Escala (1 a 9)',
  '    2.2. Regras de Concordância Gramatical Dinâmica ("de Relacionamento")',
  '    2.3. Funil de Qualificação Consciente & Integração WhatsApp',
  '    2.4. Automação de E-mail Resend com Solução de Bloqueio Gmail (CID Inline)',
  '3. Design System & Especificação de Interface',
  '    3.1. Paleta de Cores (OKLCH, HEX e Função Semântica)',
  '    3.2. Variações Temáticas por Área de Foco (data-theme)',
  '    3.3. Tipografia (Cormorant Garamond & Karla)',
  '    3.4. Componentes Chave: Mandala SVG, Gráfico Radar e Régua Hawkins',
  '4. Configuração de Deploy, Vercel & Variáveis de Ambiente',
  '5. Prompt Turnkey de Replicação Completa (Engenharia Reversa para IA)',
  '6. Comandos Operacionais & Manutenção',
];

sumario.forEach(line => {
  doc.font(line.startsWith('    ') ? 'Helvetica' : 'Helvetica-Bold')
     .fontSize(line.startsWith('    ') ? 9 : 9.5)
     .fillColor(line.startsWith('    ') ? COLORS.textMuted : COLORS.primaryDark);
  doc.text(line, { indent: line.startsWith('    ') ? 20 : 10 });
  doc.moveDown(0.25);
});

doc.moveDown(0.8);
drawSectionTitle('1', 'VISÃO GERAL DA ARQUITETURA & FLUXO FUNCIONAL');

drawParagraph(
  'O Diagnóstico da Harmonia Energética é uma aplicação web full-stack que opera em duas camadas convergentes: ' +
  '(a) uma interface rica e intuitiva para autoavaliação conscious por parte do cliente final; e ' +
  '(b) um motor serverless de automação que processa a telemetria, gera insights correlacionados à escala vibracional de David Hawkins ' +
  'e despacha silenciosamente a ficha completa do lead com snapshot gráfico incorporado para a especialista.'
);

drawCallout(
  'DIAGRAMA DE FLUXO DE DADOS & CONVERSÃO',
  '1. Lead seleciona foco de vida (Pessoal, Profissional, Relacionamento, Familiar ou Outro)\n' +
  '   ↳ O título atualiza dinamicamente respeitando as normas gramaticais de concordância.\n' +
  '2. Preenchimento intuitivo dos 12 pilares na escala calibrada de 1 a 9.\n' +
  '3. Renderização imediata do Gráfico Radar (Mandala Polar) e mapeamento em Hz (Hawkins).\n' +
  '4. Gatilho de conscientização: copy persuasiva sobre a diferença entre percepção superficial e diagnóstico profundo.\n' +
  '5. Disparo Duplo Simultâneo:\n' +
  '   • Front-end: Deep-link personalizado para o WhatsApp da especialista (+55 11 93005-7499).\n' +
  '   • Back-end: Captura do Canvas PNG e envio silencioso via Resend API para fabianaberkana@gmail.com com anexo inline (CID).'
);

// ==========================================
// PÁGINA 3: PASSO A PASSO DA IMPLEMENTAÇÃO
// ==========================================
doc.addPage();
drawPageHeader('PASSO A PASSO TÉCNICO');

doc.y = 55;
drawSectionTitle('2', 'HISTÓRICO E DETALHAMENTO DA IMPLEMENTAÇÃO TÉCNICA');

drawSubTitle('2.1. Os 12 Pilares Universais e Calibração de Escala (1 a 9)');
drawParagraph(
  'Para que a aplicação atuasse com precisão e versatilidade em qualquer esfera da vida que a consulente desejasse examinar ' +
  '(carreira, vida afetiva, transição familiar ou sentimento individual), as perguntas de cada pilar foram neutralizadas ' +
  'para funcionarem de forma coringa e energética, sem perder o acolhimento espiritual característico do Método Berkana:'
);

const pilares = [
  { id: 1, name: 'Plenitude e Felicidade', desc: 'O quanto você se sente realizada, alegre e em paz com a área que está analisando?' },
  { id: 2, name: 'Equilíbrio Emocional', desc: 'Como você lida com os desafios e momentos de pressão nesta área, sem perder a centralidade?' },
  { id: 3, name: 'Desenvolvimento Intelectual', desc: 'O quanto você investe em aprendizado, clareza mental e evolução em relação a este tema?' },
  { id: 4, name: 'Contribuição Social', desc: 'Qual é a sensação de pertencimento, valor e impacto positivo percebido nesta área da sua vida?' },
  { id: 5, name: 'Saúde e Disposição', desc: 'Como está a sua vitalidade, energia física e leveza ao lidar com esta questão?' },
  { id: 6, name: 'Vida Social', desc: 'De que forma as suas trocas e o apoio das pessoas ao redor influenciam positivamente esta área?' },
  { id: 7, name: 'Espiritualidade', desc: 'O quanto você sente que este aspecto está alinhado ao seu propósito maior e verdade interior?' },
  { id: 8, name: 'Relacionamento Familiar', desc: 'Como está a harmonia, a base e a fluidez das relações que sustentam este aspecto da sua vida?' },
  { id: 9, name: 'Relacionamento Amoroso', desc: 'Como você avalia a troca de afeto, cumplicidade e equilíbrio entre dar e receber nesta área?' },
  { id: 10, name: 'Recursos Financeiros', desc: 'Como você se sente em relação à estabilidade, prosperidade e fluxo de recursos ligados a este tema?' },
  { id: 11, name: 'Hobbies e Diversão', desc: 'Você consegue encontrar momentos de leveza, prazer e descontração dentro desta área?' },
  { id: 12, name: 'Realização Profissional', desc: 'O quanto você se sente realizada, motivada e produtiva em relação a esta escolha?' },
];

pilares.forEach(p => {
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.primary);
  doc.text(`${p.id}. ${p.name}: `, { continued: true });
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.textDark);
  doc.text(p.desc);
  doc.moveDown(0.18);
});

drawSubTitle('2.2. Regra de Concordância Gramatical Dinâmica');
drawParagraph(
  'Foi implementada a função utilitária getAppTitle(focusArea). Ela suprime hifens e assegura a concordância exata em língua portuguesa:\n' +
  '• Quando "Relacionamento" é selecionado, adiciona o prefixo " de ", resultando em: "Diagnóstico da Harmonia Energética de Relacionamento".\n' +
  '• Para os demais tópicos (Pessoal, Profissional, Familiar), concatena de forma fluida (ex: "Diagnóstico da Harmonia Energética Pessoal").'
);

// ==========================================
// PÁGINA 4: FUNIL, WHATSAPP & SOLUÇÃO CID GMAIL
// ==========================================
doc.addPage();
drawPageHeader('ENGENHARIA DO FUNIL & E-MAIL RESEND');

doc.y = 55;
drawSubTitle('2.3. Funil de Qualificação & Conversão WhatsApp');
drawParagraph(
  'A aplicação estrutura-se como um funil psicológico de alto valor: o consulente realiza o autoexame com a sensação de observador da própria vida. ' +
  'Para evitar que a pessoa acredite que o autoexame substitui a mentoria individual, foi implementada uma copy de quebra de padrão ' +
  'imediatamente antes do botão de agendamento:'
);

drawCallout(
  'COPY DE CONVERSÃO PRÉ-CTA HOMOLOGADA',
  'O que o seu reflexo está te mostrando?\n\n' +
  'Sua autoavaliação revelou como você percebe seu momento atual. Mas será que existem bloqueios que ainda não consegue enxergar?\n\n' +
  'Descubra o que está por trás dos seus desequilíbrios e receba uma devolutiva completa com orientações para o seu processo de harmonização.',
  COLORS.accentGold,
  '#FFFDF5'
);

drawParagraph(
  'O botão final aciona a API do WhatsApp com deep-link codificado:\n' +
  'URL: https://api.whatsapp.com/send?phone=5511930057499&text=...\n' +
  'Mensagem transmitida: "Olá Fabiana! Fiz o Diagnóstico da Harmonia Energética [Área] com média geral de [X.X]/9. O principal ponto a harmonizar foi [Nome do Pilar] e gostaria de agendar minha devolutiva completa."'
);

drawSubTitle('2.4. Resolução Definitiva do Bloqueio de Imagens do Gmail (CID Inline)');
drawParagraph(
  'Um dos maiores desafios técnicos em disparos transacionais modernos decorre dos proxies de segurança de webmails (notadamente o Google Image Proxy do Gmail), ' +
  'que bloqueiam ou corrompem imagens incluídas via Base64 puro (data:image/png;base64,...).'
);

drawCallout(
  'ARQUITETURA DE CONTORNO DE BLOQUEIO DE IMAGEM NO GMAIL',
  '1. O front-end converte o radar polar em PNG de alta resolução via elemento Canvas off-screen (generateRadarChartPng).\n' +
  '2. A string Base64 é enviada via requisição POST assíncrona para /api/send-report.\n' +
  '3. O endpoint serverless converte o payload em Buffer binário e cria um anexo MIME com:\n' +
  '   • filename: "grafico-harmonia-energetica.png"\n' +
  '   • content_id: "chart-wheel-image"\n' +
  '   • disposition: "inline"\n' +
  '4. No template HTML do e-mail, a imagem é chamada exclusivamente por: <img src="cid:chart-wheel-image" />.\n' +
  '5. Resultado: O Gmail interpreta a imagem como recurso interno autenticado da mensagem, renderizando-a com 100% de confiabilidade, sem avisos de segurança ou links quebrados.',
  COLORS.primary,
  '#FBF5FA'
);

drawParagraph(
  'Princípio de Execução Silenciosa: Toda a comunicação com a API do Resend ocorre em segundo plano via fetch() desacoplado. ' +
  'O usuário final nunca é interrompido por loaders, mensagens de erro de rede ou confirmações técnicas desnecessárias.'
);

// ==========================================
// PÁGINA 5: DESIGN SYSTEM & CORES
// ==========================================
doc.addPage();
drawPageHeader('DESIGN SYSTEM & IDENTIDADE VISUAL');

doc.y = 55;
drawSectionTitle('3', 'DESIGN SYSTEM, PALETA DE CORES & TIPOGRAFIA');

drawParagraph(
  'O projeto visual foi desenvolvido com rigor estético para harmonizar serenidade espiritual, autoridade holística e precisão analítica. ' +
  'A base cromática emprega o moderno modelo OKLCH do CSS Color Module Level 4, permitindo gradientes luminosos sem zonas mortas.'
);

drawSubTitle('3.1. Tabela da Paleta de Cores');

// Tabela de Cores
const tableX = 50;
let tableY = doc.y + 4;
const colWidths = [110, 110, 80, 195];

// Cabeçalho da Tabela
doc.save();
doc.rect(tableX, tableY, doc.page.width - 100, 18).fill(COLORS.tableHeader);
doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.primaryDark);
doc.text('TOKEN', tableX + 8, tableY + 5);
doc.text('ESPECIFICAÇÃO OKLCH', tableX + 115, tableY + 5);
doc.text('HEX', tableX + 225, tableY + 5);
doc.text('FINALIDADE / APLICAÇÃO', tableX + 305, tableY + 5);
doc.restore();

tableY += 18;

const colorTokens = [
  { name: 'Primary (Ametista)', oklch: 'oklch(49% 0.25 298)', hex: '#7C2D82', desc: 'Identidade mística, botões de ação e títulos' },
  { name: 'Pink Cósmico', oklch: 'oklch(70% 0.21 355)', hex: '#D946EF', desc: 'Expansão de consciência, gradientes do radar' },
  { name: 'Dourado Sagrado', oklch: 'oklch(87% 0.15 62)', hex: '#D4AF37', desc: 'Foco profissional, badges de maestria e iluminação' },
  { name: 'Verde Esmeralda', oklch: 'oklch(72% 0.18 158)', hex: '#10B981', desc: 'Cura energética, pontos equilibrados e harmonia' },
  { name: 'Background Celestial', oklch: 'oklch(99.5% 0.004 350)', hex: '#FAF5F8', desc: 'Fundo etéreo de tela com auras radiais suaves' },
  { name: 'Superfície de Card', oklch: 'oklch(100% 0 0 / 0.85)', hex: '#FFFFFF (85%)', desc: 'Glassmorphism com backdrop blur 16px' },
  { name: 'Bordas e Divisórias', oklch: 'oklch(89% 0.045 320)', hex: '#F0D5E5', desc: 'Contornos suaves de cartões e sliders' },
  { name: 'Texto Principal', oklch: 'oklch(26% 0.07 300)', hex: '#2D1A2E', desc: 'Preto ametista profundo para máxima legibilidade' },
  { name: 'Texto Muted', oklch: 'oklch(44% 0.07 300)', hex: '#6B516C', desc: 'Instruções secundárias e explicações analíticas' },
];

colorTokens.forEach((c, idx) => {
  const rowHeight = 17;
  doc.save();
  if (idx % 2 === 1) {
    doc.rect(tableX, tableY, doc.page.width - 100, rowHeight).fill(COLORS.tableAlt);
  }
  doc.rect(tableX, tableY, doc.page.width - 100, rowHeight).stroke(COLORS.border);
  
  // Pequeno quadrado de demonstração da cor
  doc.rect(tableX + 4, tableY + 4, 8, 8).fill(c.hex.startsWith('#') ? c.hex.slice(0, 7) : COLORS.primary);
  
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.textDark);
  doc.text(c.name, tableX + 16, tableY + 5);
  doc.font('Courier').fontSize(7).fillColor(COLORS.primary);
  doc.text(c.oklch, tableX + 115, tableY + 5);
  doc.font('Courier-Bold').fontSize(7.5).fillColor(COLORS.secondary);
  doc.text(c.hex, tableX + 225, tableY + 5);
  doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.textDark);
  doc.text(c.desc, tableX + 305, tableY + 5, { width: 185 });
  doc.restore();

  tableY += rowHeight;
});

doc.y = tableY + 14;

drawSubTitle('3.2. Tipografia do Sistema');
drawParagraph(
  '• Tipografia Display (Serifada Clássica): Cormorant Garamond (Google Fonts). Empregada nos títulos centrais, cabeçalhos de impacto, numerais de score e pensamentos reflexivos. Proporciona requinte literário e solene.\n' +
  '• Tipografia de Interface (Sans-Serif): Karla (Google Fonts). Empregada nos enunciados das perguntas, rótulos de sliders, formulários, tabelas e botões de chamada. Oferece neutralidade técnica e espaçamento uniforme.'
);

drawSubTitle('3.3. Elementos Gráficos & Interatividade');
drawParagraph(
  '• Mandala Sagrada: Vetor SVG dinâmico montado por 12 elipses rotacionadas em incrementos de 15° com anéis concêntricos.\n' +
  '• Gráfico Radar Polar: 12 eixos com níveis de graduação geométrica 1, 3, 5, 7 e 9, com polígono de notas preenchido por gradiente suave.\n' +
  '• Régua Hawkins: Barra linear contínua correlacionando as médias de 1 a 9 às frequências vibracionais de 20 Hz a 700 Hz.'
);

// ==========================================
// PÁGINA 6: DEPLOY, VERCEL & PROMPT DE REPLICAÇÃO
// ==========================================
doc.addPage();
drawPageHeader('DEPLOY & REPLICAÇÃO TURNKEY');

doc.y = 55;
drawSectionTitle('4', 'CONFIGURAÇÃO DE DEPLOY & AMBIENTE VERCEL');

drawParagraph(
  'A aplicação está provisionada em arquitetura Jamstack com execução serverless híbrida no Vercel:'
);

drawCallout(
  'VARIÁVEIS DE AMBIENTE REQUERIDAS (VERCEL DASHBOARD)',
  '1. RESEND_API_KEY: Chave secreta de envio transacional (ex: re_abcdef123456...)\n' +
  '2. RECIPIENT_EMAIL: E-mail da especialista que recebe os leads (fabianaberkana@gmail.com)\n' +
  '3. GEMINI_API_KEY: Chave Google AI Studio para geração dinâmica de insights analíticos\n\n' +
  'Configuração de Rewrites no vercel.json:\n' +
  '• Rota de API: /api/(.*) -> /api/$1\n' +
  '• Rota SPA: /((?!api/).*) -> /index.html'
);

drawSectionTitle('5', 'PROMPT DE ENGENHARIA REVERSA PARA REPLICAÇÃO (IA TURNKEY)');

drawParagraph(
  'Para recriar a totalidade deste sistema em outro repositório ou framework utilizando inteligência artificial, copie e execute o prompt a seguir:'
);

const replicationPrompt = 
  'Atue como um Engenheiro Full-Stack Sênior. Crie uma aplicação web intitulada "Diagnóstico da Harmonia Energética" ' +
  'para Fabiana Berkana (Método Berkana). Requisitos:\n' +
  '1. 12 Pilares Universais (Escala 1 a 9): Plenitude e Felicidade, Equilíbrio Emocional, Desenvolvimento Intelectual, ' +
  'Contribuição Social, Saúde e Disposição, Vida Social, Espiritualidade, Relacionamento Familiar, Relacionamento Amoroso, ' +
  'Recursos Financeiros, Hobbies e Diversão, Realização Profissional.\n' +
  '2. Concordância no Título: Título principal sem hífen. Se o usuário escolher a área de foco "Relacionamento", ' +
  'o título deve exibir: "Diagnóstico da Harmonia Energética de Relacionamento" (prefixo " de " incluído).\n' +
  '3. Mandala Polar e Escala Hawkins: Gráfico SVG de radar com 12 vértices e níveis 1, 3, 5, 7, 9. Régua de 20 Hz a 700 Hz.\n' +
  '4. Funil WhatsApp: Bloco reflexivo antes do CTA: "O que o seu reflexo está te mostrando? Sua autoavaliação revelou como ' +
  'você percebe seu momento atual. Mas será que existem bloqueios que ainda não consegue enxergar? Descubra o que está por trás ' +
  'dos seus desequilíbrios e receba uma devolutiva completa...". Botão envia para WhatsApp (+55 11 93005-7499).\n' +
  '5. Disparo de E-mail Silencioso via Resend: Envia para fabianaberkana@gmail.com com anexo inline CID (cid:chart-wheel-image) ' +
  'para evitar que o Gmail bloqueie a imagem do gráfico. Sem avisos intrusivos na interface do usuário.\n' +
  '6. Design System: Fontes Cormorant Garamond + Karla. Paleta Ametista (#7C2D82), Dourado (#D4AF37), Verde (#10B981) e Rosa (#D946EF).';

drawCallout('PROMPT DE REPLICAÇÃO PARA IA', replicationPrompt, COLORS.secondary, COLORS.tableAlt);

doc.moveDown(0.5);
drawSectionTitle('6', 'REPOSITÓRIOS E LINKS OFICIAIS');

const links = [
  { label: 'Repositório GitHub:', url: 'https://github.com/backters/ProjetoberkanaHarmonia.git' },
  { label: 'Deploy de Produção Vercel:', url: 'https://projetoberkanaharmonia.vercel.app' },
  { label: 'Canal de Conversão WhatsApp:', url: 'https://wa.me/5511930057499' },
  { label: 'E-mail de Notificação:', url: 'mailto:fabianaberkana@gmail.com' },
];

links.forEach(l => {
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.textDark);
  doc.text(l.label, 60, doc.y, { continued: true });
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.primary);
  doc.text(`  ${l.url}`);
  doc.moveDown(0.2);
});

// ==========================================
// NUMERAÇÃO DE PÁGINAS NO RODAPÉ
// ==========================================
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  doc.save();
  // Não imprime rodapé na capa (página 0)
  if (i > 0) {
    doc.rect(50, doc.page.height - 35, doc.page.width - 100, 0.8).fill(COLORS.border);
    doc.font('Helvetica').fontSize(8).fillColor(COLORS.textLight);
    doc.text(
      'Diagnóstico da Harmonia Energética • Fabiana Berkana • Documentação Técnica',
      50,
      doc.page.height - 25,
      { align: 'left' }
    );
    doc.text(
      `Página ${i + 1} de ${totalPages}`,
      50,
      doc.page.height - 25,
      { align: 'right' }
    );
  }
  doc.restore();
}

doc.end();

writeStream.on('finish', () => {
  console.log(`PDF gerado com sucesso em: ${outputPath}`);
});
