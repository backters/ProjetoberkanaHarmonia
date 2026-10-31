# Life Wheel Harmony Guide - Berkana Harmonia

Aplicação interativa de diagnóstico pessoal e profissional baseada na **Roda da Vida** (*Life Wheel Harmony Guide*), desenvolvida com foco em autoliderança, harmonia integral, captura opcional de leads e envio imediato de relatório por e-mail.

Repositório GitHub: [https://github.com/backters/ProjetoberkanaHarmonia](https://github.com/backters/ProjetoberkanaHarmonia)

---

## 🌟 Funcionalidades Principais

1. **Roda da Vida Interativa (12 Dimensões em 4 Pilares)**:
   - **Pessoal**: Saúde & Disposição, Desenvolvimento Intelectual, Equilíbrio Emocional.
   - **Profissional**: Realização & Propósito, Recursos Financeiros, Contribuição Social.
   - **Relacionamentos**: Família & Convivência, Amor & Afeto, Vida Social & Amizades.
   - **Qualidade de Vida**: Hobbies & Lazer, Espiritualidade & Sentido, Ambiente Físico & Lar.
2. **Dupla Experiência de Autoavaliação**:
   - **Modo Guiado**: Perguntas reflexivas detalhadas e notas de 1 a 10 com indicadores qualitativos.
   - **Modo Rápido / Roda Completa**: Visualização simultânea com sliders por pilar e atualização em tempo real do gráfico.
3. **Gráfico SVG Dinâmico Dual-Mode**:
   - Modo Setores da Vida (fatias clássicas) e Modo Radar Contínuo (polígono de equilíbrio).
   - Exportação em alta resolução (PNG) com download direto no navegador.
4. **Algoritmo de Cálculo do Índice de Harmonia**:
   - Combina a média aritmética com a dispersão/desvio-padrão (uma roda com notas desiguais não gira com fluidez).
   - Identificação automática da **Maior Fortaleza**, **Ponto Crítico** e **Área Alavanca** (a dimensão com maior efeito dominó na vida do usuário).
5. **Captura Opcional de Leads & Disparo de E-mail**:
   - Todos os dados coletados (nome, e-mail, telefone) são **100% opcionais**.
   - Se o usuário preencher o e-mail, o dossiê com o resultado é despachado imediatamente para sua caixa postal via backend Express + Nodemailer.
   - Modal com preview visual do HTML completo enviado, histórico e opção de reenvio.
6. **Painel de Gestão de Leads (Coach / Admin)**:
   - Visualização de todos os diagnósticos concluídos, estatísticas médias de equilíbrio e exportação em formato CSV.
7. **Integração com IA (Google Gemini API)**:
   - Parecer estratégico de mentoria personalizado gerado sob demanda.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/backters/ProjetoberkanaHarmonia.git
cd ProjetoberkanaHarmonia

# Instale as dependências
npm install

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Inicie o servidor full-stack de desenvolvimento
npm run dev
```

Abra seu navegador em `http://localhost:3000`.

---

## 📧 Configuração de E-mail (SMTP)

Por padrão, a aplicação executa um transporte com prévia em tempo real do e-mail. Para despachar mensagens através do seu servidor de e-mail corporativo (ex: Brevo, Gmail, SendGrid, Amazon SES), preencha no `.env`:

```env
SMTP_HOST="smtp.seuprovedor.com"
SMTP_PORT="587"
SMTP_USER="seu-usuario"
SMTP_PASS="sua-senha"
SMTP_FROM="Berkana Harmonia <contato@berkanaharmonia.com.br>"
```

---

## 📦 Stack Tecnológica

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Nodemailer, @google/genai.
- **Build & Dev**: Vite, TSX.

---

© Berkana Harmonia. Desenvolvido para inspirar clareza, serenidade e plenitude.
