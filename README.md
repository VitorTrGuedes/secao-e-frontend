Markdown
# 🍿 Seção E — Frontend Web Client

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Router-7.x-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Vitest-Ready-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

> **Interface Web do portal Seção E** — Aplicação Single Page Application (SPA) moderna, responsiva e de alta performance, projetada para a leitura de notícias e críticas autorais sobre Cinema, Animes e Séries, com interação da comunidade e sugestão de pautas.

---

## 🎨 Identidade Visual & Design System

A interface foi desenhada seguindo a estética **Dark Cinema**, com foco em imersão e legibilidade:
* **Fundo Imersivo:** Slate 900 (`#0F172A`) com efeito *glassmorphism* translúcido na barra de navegação.
* **Cores de Destaque:** Rose/Vermelho Cinema (`#E11D48`) para ações e Violet/Roxo (`#8B5CF6`) para o universo de Animes e Séries.
* **HTML Semântico:** Estruturação avançada utilizando `<main>`, `<article>`, `<header>`, `<figure>`, `<section>`, `<ul>`, `<li>` e `<time>`.
* **Acessibilidade (a11y):** Rótulos ocultos para leitores de tela (`sr-only`), foco visual acessível e contraste calibrado.

---

## 📌 Funcionalidades da Aplicação

- 🚀 **Feed Interativo:** Exibição de cards com imagens em alta resolução, badges por categoria, notas com estrelas (1 a 10) e assinatura do autor.
- 🔎 **Busca em Tempo Real + Filtros Combinados:** Barra de pesquisa instantânea que cruza palavras-chave no título/conteúdo com botões de categoria (*Cinema*, *Anime*, *Série*), com resposta de 0ms sem chamadas redundantes ao servidor.
- 📖 **Página de Detalhes da Crítica:** Leitura da análise completa com rotas dinâmicas via `:slug`.
- 💬 **Espaço da Comunidade:** Formulário integrado para envio de comentários e leitura de opiniões já aprovadas de outros leitores.
- 💡 **Formulário de Sugestões:** Canal direto para o público indicar filmes, animes ou séries para próximas análises, com validações e feedback visual.
- 📱 **Design 100% Responsivo:** Adaptado para smartphones (360px+), tablets e telas ultrawide.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Roteamento SPA:** [React Router DOM](https://reactrouter.com/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Suíte de Testes:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + [JSDOM](https://github.com/jsdom/jsdom)

---

## 📂 Estrutura de Pastas

```text
secao-e-frontend/
├── public/                 # Favicons e arquivos públicos
├── src/
│   ├── components/         # Componentes compartilhados (Navbar, etc.)
│   │   ├── Navbar.jsx
│   │   └── Navbar.test.jsx
│   ├── pages/              # Páginas e views da aplicação
│   │   ├── Home.jsx
│   │   ├── Home.test.jsx
│   │   ├── ArticleDetail.jsx
│   │   ├── ArticleDetail.test.jsx
│   │   ├── SuggestReview.jsx
│   │   └── SuggestReview.test.jsx
│   ├── App.jsx             # Definição e roteamento das páginas (SPA)
│   ├── index.css           # Diretivas base do Tailwind CSS
│   ├── main.jsx            # Ponto de entrada do React
│   └── setupTests.js       # Configuração de matchers do Vitest
├── .env.example            # Exemplo de variáveis de ambiente
├── tailwind.config.js      # Paleta de cores do Design System
├── vite.config.js          # Configurações do Vite e ambiente JSDOM
└── package.json            # Scripts e dependências


🚀 Como Executar o Projeto Localmente
Pré-requisitos
Node.js (versão 18 ou superior)
Backend do Seção E rodando localmente (ou a URL de produção)


1. Clonar o repositório
code
Bash
git clone https://github.com/SEU_USUARIO/secao-e-frontend.git
cd secao-e-frontend


2. Instalar as dependências
code
Bash
npm install


3. Configurar a Conexão com a API
Crie um arquivo .env na raiz do projeto (ou copie o .env.example):
code
Env
VITE_API_URL=http://127.0.0.1:8000/api


4. Iniciar o Servidor de Desenvolvimento
code
Bash
npm run dev
Acesse http://localhost:5173/ no navegador.
📲 Como Testar no seu Celular Físico (Rede Local)
Você pode testar a experiência mobile diretamente no seu smartphone sem precisar subir para a internet:
code
Bash
npm run dev -- --host
Abra o navegador do seu celular (conectado ao mesmo Wi-Fi do computador) e acesse a URL exibida em Network (ex: http://192.168.1.X:5173).


🧪 Executando os Testes Automatizados
A aplicação conta com testes de componentes em memória cobrindo navegação, validação de formulários, chamadas simuladas de API (Mocks) e filtragem em tempo real:
code
Bash


# Executa todos os testes e exibe o relatório no terminal
npm run test

# Executa os testes em modo interativo (assistindo alterações)
npx vitest
📦 Build e Otimização para Produção
Para testar a compilação do bundle antes do deploy:
code
Bash


# Compilar projeto para a pasta dist/
npm run build

# Testar o build compilado localmente
npm run preview
☁️ Deploy na Vercel
Importe o repositório secao-e-frontend no dashboard da Vercel.
O framework preset será detectado automaticamente como Vite.
Em Environment Variables, adicione:
VITE_API_URL: URL da sua API no Render (ex: https://secao-e-api.onrender.com/api).
Clique em Deploy.


👤 Autor
Desenvolvido por Vitor Guedes.
Críticas sinceras, notícias atualizadas e espaço aberto para o debate sobre Cinema, Animes e Séries!