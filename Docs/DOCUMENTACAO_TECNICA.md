# DOCUMENTAÇÃO TÉCNICA DO SISTEMA
## Diagnóstico da Harmonia Energética — Método Fabiana Berkana

---

### METADADOS DO PROJETO & AMBIENTES DE IMPLANTAÇÃO

- **Aplicação:** Diagnóstico da Harmonia Energética
- **Especialista / Mentora:** Fabiana Berkana
- **WhatsApp de Atendimento & Conversão:** `+55 (11) 93005-7499`
- **E-mail de Notificação de Leads:** `fabianaberkana@gmail.com`
- **Repositório Git (GitHub):** `https://github.com/backters/ProjetoberkanaHarmonia.git`
- **Ambiente de Produção (Vercel):** `https://projetoberkanaharmonia.vercel.app`
- **Stack Tecnológica:** React 19, TypeScript, Tailwind CSS v4, Vite 8, Express / Vercel Serverless Functions, Resend API, Nodemailer, Google Gemini API (`@google/genai`), Canvas Confetti, Lucide React, PDFKit.

---

## 1. RESUMO EXECUTIVO & VISÃO ARQUITETURAL

O sistema **Diagnóstico da Harmonia Energética** é uma aplicação web full-stack desenvolvida para operar como um **autoexame consciente** e um **funil de alta conversão** para os atendimentos terapêuticos e diagnósticos energéticos de Fabiana Berkana (Método Berkana).

A ferramenta convida o consulente a mapear a sua percepção consciente em **12 pilares universais de vida** em uma escala calibrada de **1 a 9**, contextualizados em diferentes esferas (Pessoal, Profissional, Relacionamento, Familiar ou Tema Livre).

Ao concluir o mapeamento, o sistema calcula a média geral, plota uma **mandala energética (Radar Chart)** em tempo real, correlaciona a média à **Escala de Consciência de David R. Hawkins (20 Hz a 700 Hz)**, identifica os pontos de maior expansão e as áreas críticas para harmonização, gera insights por Inteligência Artificial (Gemini) e aciona duas vias de fechamento:
1. **Frontend / Lead:** Um CTA persuasivo com deep-link direto para o WhatsApp oficial com mensagem pré-formatada com as métricas do cliente.
2. **Backend / Servidor:** Disparo assíncrono e resiliente de e-mail administrativo para `fabianaberkana@gmail.com` via Resend API, contendo a ficha completa do lead, métricas analíticas e a imagem do gráfico incorporada via **Content-ID (CID inline)** para contornar bloqueios do Gmail.

---

## 2. HISTÓRICO COMPLETO DE IMPLEMENTAÇÃO (PASSO A PASSO TÉCNICO)

### Fase 1: Calibração dos 12 Pilares Universais
Para permitir que o usuário avalie qualquer esfera da vida (seja uma crise no casamento, uma transição de carreira ou conflito familiar) sem que as perguntas ficassem incoerentes, os 12 pilares foram redigidos como perguntas diretas, neutras e energéticas:

1. **Plenitude e Felicidade:** O quanto você se sente realizada, alegre e em paz com a área que está analisando?
2. **Equilíbrio Emocional:** Como você lida com os desafios e os momentos de pressão nesta área, sem perder a sua centralidade?
3. **Desenvolvimento Intelectual:** O quanto você investe em aprendizado, clareza mental e evolução em relação a este tema?
4. **Contribuição Social:** Qual é a sensação de pertencimento, valor e impacto positivo que você percebe nesta área da sua vida?
5. **Saúde e Disposição:** Como está a sua vitalidade, a sua energia física e a leveza ao lidar com esta questão?
6. **Vida Social:** De que forma as suas trocas e o apoio das pessoas ao redor influenciam positivamente esta área?
7. **Espiritualidade:** O quanto você sente que este aspecto da sua vida está alinhado com o seu propósito maior e com a sua verdade?
8. **Relacionamento Familiar:** Como está a harmonia, a base e a fluidez das relações que sustentam este aspecto da sua vida?
9. **Relacionamento Amoroso:** Como você avalia a troca de afeto, a cumplicidade e o equilíbrio entre dar e receber nesta área?
10. **Recursos Financeiros:** Como você se sente em relação à estabilidade, à prosperidade e ao fluxo de recursos ligados a este tema?
11. **Hobbies e Diversão:** Você consegue encontrar momentos de leveza, prazer e descontração dentro desta área?
12. **Realização Profissional:** O quanto você se sente realizada, motivada e produtiva em relação a esta escolha?

### Fase 2: Concordância Gramatical Dinâmica & Refinamento Visual
- **Remoção de Hífen:** O título principal foi unificado para formar uma sentença coesa (`Diagnóstico da Harmonia Energética ...`).
- **Concordância da Opção Relacionamento:** Quando a área de foco "Relacionamento" é ativada, o sistema aplica condicionalmente o prefixo `" de "` gerando o título:  
  `Diagnóstico da Harmonia Energética de Relacionamento`  
  Para as demais áreas, concatena o complemento com espaçamento natural (ex.: `Diagnóstico da Harmonia Energética Pessoal`).
- **Tema Visual Dinâmico:** Cada foco de vida altera o atributo `data-theme` no elemento raiz do documento, acionando gradientes e auras de iluminação específicas (pessoal, profissional, relacionamento, familiar).

### Fase 3: Funil de Qualificação & Integração com WhatsApp
- **Persuasão Pré-CTA:** O usuário recebe a leitura da sua autoavaliação conscious, seguida de um gatilho de reflexão antes do botão final:
  > **O que o seu reflexo está te mostrando?**  
  > *Sua autoavaliação revelou como você percebe seu momento atual. Mas será que existem bloqueios que ainda não consegue enxergar? Descubra o que está por trás dos seus desequilíbrios e receba uma devolutiva completa com orientações para o seu processo de harmonização.*
- **Deep Link de Alta Conversão:** O botão de agendamento conecta diretamente com `https://api.whatsapp.com/send?phone=5511930057499` enviando o payload codificado:
  > `Olá Fabiana! Fiz o Diagnóstico da Harmonia Energética [Área] com média geral de [X.X]/9. O principal ponto a harmonizar foi "[Nome do Pilar]" e gostaria de agendar minha devolutiva completa.`

### Fase 4: Automação Silenciosa de E-mail & Resolução de Bloqueio do Gmail
- **Problema Enfrentado Anteriormente:** E-mails com imagens de gráficos incorporadas em `data:image/png;base64,...` no atributo `src` de tags `<img>` eram suprimidos ou quebrados pelo proxy de imagens do Gmail (`googleusercontent.com`), que bloqueia data URIs por motivos de segurança.
- **Engenharia da Solução:**
  1. O canvas cliente gera um snapshot PNG limpo do gráfico radar (`generateRadarChartPng`).
  2. O payload é enviado via POST assíncrono para `/api/send-report`.
  3. No backend (tanto local em `server.ts` quanto serverless em `api/send-report.ts`), a string Base64 é decodificada em Buffer binário.
  4. O e-mail é montado com especificação MIME multipart e anexo inline com `Content-ID`: `<chart-wheel-image>` e `content_id: 'chart-wheel-image'`.
  5. O corpo HTML referencia `<img src="cid:chart-wheel-image" ... />`, garantindo que o cliente de e-mail (Gmail, Outlook, Apple Mail) renderize a imagem em alta resolução sem avisos de bloqueio de imagens externas.
  6. **Resiliência Multi-Provedor:** Implementado pipeline primário via **Resend SDK** e pipeline de contingência via **Nodemailer SMTP** (caso chaves Resend não estejam provisionadas ou ocorram exceções de rede).
  7. **Experiência do Usuário (Silent Execution):** O disparo é executado em background via `fetch()` não bloqueante. Nenhuma mensagem técnica, spinner invasivo ou alerta de erro de e-mail é exibido para o cliente final.

---

## 3. DESIGN SYSTEM & IDENTIDADE VISUAL

### 3.1. Paleta de Cores

A aplicação utiliza o espaço de cor **OKLCH** para transições de gradiente perceptualmente uniformes e luminosas, com equivalências em HEX para compatibilidade de e-mail e renderização gráfica:

| Nome do Token | Valor OKLCH / CSS | Valor HEX / RGB | Aplicação & Significado |
| :--- | :--- | :--- | :--- |
| **Primary (Ametista)** | `oklch(49% 0.25 298)` | `#7C2D82` / `rgb(124, 45, 130)` | Cor principal da marca, botões de ação e títulos |
| **Pink Cósmico** | `oklch(70% 0.21 355)` | `#D946EF` / `rgb(217, 70, 239)` | Destaques de frequência, gradientes de expansão |
| **Dourado Sagrado** | `oklch(87% 0.15 62)` | `#D4AF37` / `rgb(212, 175, 55)` | Badges de maestria, foco profissional, iluminação |
| **Verde Esmeralda** | `oklch(72% 0.18 158)` | `#10B981` / `rgb(16, 185, 129)` | Cura, pontos de equilíbrio e harmonia |
| **Background Aura** | `oklch(99.5% 0.004 350)` | `#FAF5F8` / `rgb(250, 245, 248)` | Fundo celestial suave com halos radiais |
| **Card Surface** | `oklch(100% 0 0 / 0.85)` | `rgba(255, 255, 255, 0.85)` | Vidro fosco (*glassmorphism*) com backdrop blur |
| **Bordas Suaves** | `oklch(89% 0.045 320)` | `#F0D5E5` / `rgb(240, 213, 229)` | Delimitação de cards e divisórias sutis |
| **Texto Títulos** | `oklch(26% 0.07 300)` | `#2D1A2E` / `rgb(45, 26, 46)` | Preto violáceo profundo de alto contraste |
| **Texto Secundário** | `oklch(44% 0.07 300)` | `#6B516C` / `rgb(107, 81, 108)` | Explicações, orientações e textos de apoio |

#### Variações Temáticas por Foco de Vida (`data-theme`):
- `pessoal`: Lilás suave e branco (`oklch(52% 0.23 300)`).
- `profissional`: Marfim acetinado e ouro sóbrio (`oklch(50% 0.15 65)`).
- `relacionamento`: Rosa quartzo e carmim acolhedor (`oklch(54% 0.24 355)`).
- `familiar`: Anil sereno e âmbar acolhedor (`oklch(46% 0.20 260)`).

### 3.2. Tipografia

A hierarquia tipográfica foi concebida para balancear autoridade espiritual e clareza analítica:

1. **Tipografia Display / Editorial:**
   - **Família:** `'Cormorant Garamond', Georgia, serif`
   - **Pesos:** Regular (400), Medium (500), Semi-Bold (600), Italic (400i)
   - **Uso:** Título principal, títulos de seções, números de pontuação e citações reflexivas.
   - **Propósito:** Evoca manuscritos clássicos, elegância transcendental e acolhimento humano.

2. **Tipografia de Interface / UI:**
   - **Família:** `'Karla', -apple-system, sans-serif`
   - **Pesos:** Regular (400), Medium (500), Bold (700)
   - **Uso:** Perguntas dos 12 pilares, rótulos de sliders, botões, badges, dados do lead e tabelas.
   - **Propósito:** Máxima legibilidade em telas móveis e desktop, excelente espaçamento numérico.

### 3.3. Layout & Arquitetura Visual

- **Composição em Container Único:** Largura máxima de `640px` a `768px` centralizada, garantindo experiência *mobile-first* impecável em smartphones.
- **Mandala Sagrada em SVG:** No topo e como elemento decorativo de fundo, composta por 12 elipses rotacionadas a 15 graus e círculos concêntricos concêntricos.
- **Sliders Táteis:** Controles de arrasto contínuos com marcação de 1 a 9, com microinterações sonoras e táteis implícitas e exibição instantânea da nota.
- **Gráfico Radar Polar:** 12 eixos radiais com 5 polígonos concêntricos de referência (1, 3, 5, 7, 9) preenchidos com gradiente translúcido entre Rosa e Verde Esmeralda.
- **Barra de Frequência Hawkins:** Régua cromática contínua de 20 Hz a 700 Hz com indicador dinâmico da posição vibracional do usuário.

---

## 4. ESPECIFICAÇÃO DE APIS, SERVERLESS & VARIÁVEIS DE AMBIENTE

### 4.1. Variáveis de Ambiente no Vercel

As seguintes variáveis estão configuradas no painel do Vercel (`Project Settings > Environment Variables`):

| Variável | Tipo | Exemplo / Valor | Finalidade |
| :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | String (Secret) | `re_1234567890abcdef...` | Chave de autenticação na API do Resend |
| `RECIPIENT_EMAIL` | String | `fabianaberkana@gmail.com` | E-mail de destino que receberá as fichas de leads |
| `GEMINI_API_KEY` | String (Secret) | `AIzaSy...` | Chave Google AI Studio para insights energéticos |

### 4.2. Endpoints do Sistema

#### 1. `POST /api/send-report`
- **Função:** Recebe os dados do lead, as notas dos 12 pilares, a síntese analítica e o snapshot PNG do gráfico, despachando o e-mail formatado para a especialista.
- **Payload (JSON):**
  ```json
  {
    "leadName": "Nome do Cliente",
    "leadEmail": "cliente@email.com",
    "leadPhone": "(11) 99999-9999",
    "focusArea": "Relacionamento",
    "title": "Diagnóstico da Harmonia Energética de Relacionamento",
    "average": 7.4,
    "frequencyName": "Amor",
    "frequencyHz": 500,
    "reading": "Sua energia flui em boa sintonia...",
    "scores": [
      { "id": 1, "name": "Plenitude e Felicidade", "score": 8 },
      ...
    ],
    "chartImageBase64": "data:image/png;base64,iVBORw0KGgoAAA..."
  }
  ```
- **Resposta:** `200 OK` com `{ "success": true, "message": "Relatório enviado com sucesso via Resend", "id": "..." }`.

#### 2. `POST /api/ai-insights`
- **Função:** Gera a leitura personalizada em tempo real via Gemini 2.5 Flash baseada na correlação dos pilares de maior e menor frequência.

---

## 5. PROMPT DE REPLICAÇÃO TURNKEY (ENGENHARIA REVERSA)

Para recriar integralmente esta aplicação a partir do zero utilizando qualquer LLM ou agente de engenharia de software, utilize o prompt abaixo:

```text
Atue como um Engenheiro de Software Full-Stack Sênior e especialista em UI/UX.
Desenvolva uma aplicação web completa intitulada "Diagnóstico da Harmonia Energética" para a terapeuta Fabiana Berkana (Método Berkana).

REQUISITOS FUNCIONAIS E DE NEGÓCIO:
1. Mapeamento dos 12 Pilares Universais (Escala de 1 a 9):
   Perguntas universais adaptáveis para qualquer contexto:
   - Plenitude e Felicidade: O quanto você se sente realizada, alegre e em paz com a área que está analisando?
   - Equilíbrio Emocional: Como você lida com os desafios e os momentos de pressão nesta área, sem perder a sua centralidade?
   - Desenvolvimento Intelectual: O quanto você investe em aprendizado, clareza mental e evolução em relação a este tema?
   - Contribuição Social: Qual é a sensação de pertencimento, valor e impacto positivo que você percebe nesta área da sua vida?
   - Saúde e Disposição: Como está a sua vitalidade, a sua energia física e a leveza ao lidar com esta questão?
   - Vida Social: De que forma as suas trocas e o apoio das pessoas ao redor influenciam positivamente esta área?
   - Espiritualidade: O quanto você sente que este aspecto da sua vida está alinhado com o seu propósito maior e com a sua verdade?
   - Relacionamento Familiar: Como está a harmonia, a base e a fluidez das relações que sustentam este aspecto da sua vida?
   - Relacionamento Amoroso: Como você avalia a troca de afeto, a cumplicidade e o equilíbrio entre dar e receber nesta área?
   - Recursos Financeiros: Como você se sente em relação à estabilidade, à prosperidade e ao fluxo de recursos ligados a este tema?
   - Hobbies e Diversão: Você consegue encontrar momentos de leveza, prazer e descontração dentro desta área?
   - Realização Profissional: O quanto você se sente realizada, motivada e produtiva em relação a esta escolha?

2. Seletor de Foco de Vida e Concordância Dinâmica:
   Opções: Pessoal, Profissional, Relacionamento, Familiar e Outro.
   O título do diagnóstico deve ser formatado sem hífen. Quando 'Relacionamento' for selecionado, deve incluir o prefixo ' de ' resultando exatamente em: 'Diagnóstico da Harmonia Energética de Relacionamento'. Para as demais, 'Diagnóstico da Harmonia Energética [Área]'.

3. Análise Vibracional & Gráfico Radar:
   - Renderize uma Mandala/Radar Chart SVG em tempo real com os 12 eixos e níveis 1, 3, 5, 7, 9.
   - Calcule a média geral (1 a 9) e mapeie na Escala de Frequência de David Hawkins (20 Hz a 700 Hz: Vergonha, Culpa, Apatia, Medo, Raiva, Coragem, Neutralidade, Aceitação, Amor, Alegria, Paz, Iluminação).
   - Destaque os 2 maiores pilares (Pontos de Expansão) e os 2 menores (Pontos a Harmonizar).

4. Funil de Conversão WhatsApp:
   - Imediatamente acima do botão final, inclua o bloco de copy:
     "O que o seu reflexo está te mostrando?
      Sua autoavaliação revelou como você percebe seu momento atual. Mas será que existem bloqueios que ainda não consegue enxergar?
      Descubra o que está por trás dos seus desequilíbrios e receba uma devolutiva completa com orientações para o seu processo de harmonização."
   - Botão para WhatsApp (+55 11 93005-7499) com mensagem pré-formatada trazendo a média do usuário e a área prioritária de harmonização.

5. Envio Automático e Silencioso de E-mail (Resend + Vercel):
   - Assim que o diagnóstico é concluído, capture o gráfico radar via Canvas PNG e envie via POST para /api/send-report.
   - Utilize a API do Resend (com variáveis RESEND_API_KEY e RECIPIENT_EMAIL apontando para fabianaberkana@gmail.com).
   - O e-mail deve conter todos os dados do lead, métricas, tabela com os 12 pilares e a imagem do gráfico.
   - CRUCIAL: Anexe a imagem do gráfico como anexo MIME inline com Content-ID (cid:chart-wheel-image) e utilize <img src="cid:chart-wheel-image"> no HTML para evitar bloqueios do Gmail.
   - O envio deve ser transparente: não exiba mensagens de status de e-mail ao usuário final na tela.

6. Identidade Visual e Design System:
   - Fontes: 'Cormorant Garamond' (serif display para títulos e espiritualidade) e 'Karla' (sans-serif para legibilidade e controles).
   - Cores: Paleta mística baseada em Ametista/Magenta (#7C2D82), Rosa Cósmico (#D946EF), Dourado Sagrado (#D4AF37), Verde Esmeralda (#10B981) e fundo celestial (#FAF5F8) com glassmorphism.
   - Suporte a temas dinâmicos via data-theme.
```

---

## 6. INSTRUÇÕES DE REPRODUÇÃO & COMANDOS DE BUILD

```bash
# 1. Clonar o repositório
git clone https://github.com/backters/ProjetoberkanaHarmonia.git
cd ProjetoberkanaHarmonia

# 2. Instalar dependências
npm install

# 3. Configurar variáveis em .env
cp .env.example .env
# Preencher RESEND_API_KEY, RECIPIENT_EMAIL=fabianaberkana@gmail.com, GEMINI_API_KEY

# 4. Rodar ambiente de desenvolvimento local (Express + Vite)
npm run dev

# 5. Build de produção (compatível com Vercel)
npm run build
```

---
*Documentação técnica homologada para a versão de produção do projeto Fabiana Berkana.*
