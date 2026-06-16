# 🌌 Astreu Hub — Plataforma de Exploração Astronômica

O **Astreu Hub** é um ecossistema completo desenvolvido para entusiastas da astronomia e pesquisadores. A plataforma permite a publicação de artigos científicos em PDF, o compartilhamento de relatos de missões e o acesso offline/local a um robusto dataset científico de astrofotografia dividido por categorias cósmicas (planetas, nebulosas, galáxias, etc.), com recursos avançados de curadoria e favoritos local.

---

## 🚀 Funcionalidades Principais

* **Arquivo Cósmico (Dataset Científico):** Integração com um dataset local com centenas de imagens processadas de alta resolução, categorizadas em tempo real diretamente do sistema de arquivos do servidor.
* **Curadoria e Favoritos:** Capacidade de favoritar imagens do dataset espacial em modo offline/local utilizando persistência em `AsyncStorage` e visualizá-las de forma unificada na aba Galeria.
* **Comunidade Astreu (Feed Híbrido):** * **Aba Estudos:** Feed de artigos científicos e relatórios de missões com suporte a leitura de PDFs anexados.
    * **Aba Galeria:** Visualização em Grid (2 colunas) combinando fotos postadas por usuários da comunidade com as imagens do dataset favoritadas pelo usuário corrente, permitindo expansão em tela cheia e exclusão direta.
* **Upload de Mídias Blindado:** Arquitetura otimizada para lidar com uploads multiparte (imagens e relatórios em PDF) sem corrupção de binários no backend.

---

## 🛠️ Tecnologias Utilizadas

### **Mobile (Frontend)**
* **React Native** com **Expo (Router)**
* **TypeScript** (Tipagem estrita e segura)
* **Axios** (Comunicação HTTP com tratamento de codificação de URLs)
* **AsyncStorage** (Persistência local de sessão de usuário e cache de favoritos)
* **Expo Linear Gradient** & **Vector Icons** (UI/UX futurista e imersiva)

### **Servidor (Backend)**
* **NestJS** (Framework Node.js progressivo e escalável)
* **TypeScript**
* **TypeORM** (Mapeamento Objeto-Relacional)
* **MySQL** (Persistência de dados de usuários e posts)
* **Multer / DiskStorage** (Gerenciamento e distribuição de streams binários estáticos)

---

## 📐 Arquitetura de Dados e Fluxos Técnicos

### **Estrutura do Dataset Local**
O servidor NestJS mapeia dinamicamente e distribui de forma estática o dataset estruturado da seguinte forma:
```text
uploads/
└── dataset/
    ├── planets/          # Imagens: 1.jpg, 10.jpg...
    ├── cosmos space/     # Tratamento de espaços em requisições URL
    ├── galaxies/
    ├── nebula/
    ├── stars/
    └── constellation/
🔧 Como Executar o Projeto
Pré-requisitos
Node.js instalado (v18+)

Gerenciador de pacotes npm ou yarn

Instância do MySQL ativa
Navegue até a pasta do servidor:

Bash
cd astreu-backend
Instale as dependências:

Bash
npm install
Certifique-se de mover a pasta do seu dataset do Kaggle para dentro do diretório:
uploads/dataset/
2. Configuração do Mobile (React Native / Expo)
Navegue até a pasta do aplicativo:

Bash
cd astreu-mobile
Instale as dependências:

Bash
npm install
Ajuste de Conexão com o Emulador: O projeto está configurado por padrão para mapear o IP 10.0.2.2 (padrão do emulador Android para responder ao localhost da máquina servidora). Caso use um dispositivo físico, altere a constante BASE_URL nos arquivos de tela para o IP local da sua rede wifi (ex: 192.168.x.x).

Inicie o ecossistema Expo:

Bash
npx expo start
Inicie o servidor em modo de desenvolvimento:

Bash
npm run start:dev
O servidor estará rodando em http://localhost:3000
