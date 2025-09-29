# 🏆💪🏋️🔝 MAPACADEMY  

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)  
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)  
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)  
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  

O projeto tem como intuito ajudar a organizar e marcar os treinos da semana na academia, permitindo que o usuário registre, edite e acompanhe suas atividades de forma prática.

---

## 🚀 Tecnologias utilizadas

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)  
- [Firebase](https://firebase.google.com/) (Auth + Firestore)  
- [Service Worker](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API) para PWA  
- [CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/) para estilização  
- [React Router](https://reactrouter.com/) para rotas  

---

## 📂 Estrutura do projeto

public/
├─ manifest.json # Configuração PWA
├─ sw.js # Service Worker
└─ vite.svg

src/
├─ assets/ # Imagens e ícones
├─ components/ # Componentes reutilizáveis
├─ pages/ # Páginas (Login, Register, Profile)
├─ services/ # Firebase e outros serviços
├─ context/ # Context API (ex: AuthContext)
├─ hooks/ # Hooks customizados
├─ styles/ # Estilos globais
├─ routes/ # Configuração de rotas
├─ App.jsx
└─ main.jsx

.env # Variáveis de ambiente
vite.config.js # Configuração do Vite

---

## ⚙️ Configuração e instalação

Clone o repositório:

```bash
git clone https://github.com/DavyFelix/pwa-tasks.git
cd pwa-tasks

npm install
Crie um arquivo .env na raiz do projeto com as chaves do Firebase:

VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id


Inicie o servidor de desenvolvimento:

npm run dev
```
📱 Funcionalidades

 Login e Registro de usuários com Firebase

 Gerenciamento de tarefas (CRUD)

 Perfil do usuário

 PWA (instalável em dispositivos móveis e desktops)

 Service Worker para cache offline

📦 Build para produção
npm run build


O build gerado ficará na pasta dist/.

Para testar o PWA localmente:

npm run preview

🔮 Melhorias futuras

 Tema dark/light

 Notificações push

 Organização de tarefas por categorias

 Arrastar e soltar (drag & drop) para reordenar

👨‍💻 Autor

Desenvolvido por Davy Felix

📄 Licença

Este projeto está sob a licença MIT.
