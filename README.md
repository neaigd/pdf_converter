# PDF Converter - Aplicativo Web de Conversão de PDF

Este repositório contém um aplicativo web para conversão de arquivos PDF para vários formatos de texto (DOCX, ODT, TXT, RTF, HTML), mantendo a formatação original.

## Estrutura do Projeto

```
pdf-converter/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Configuração de CI/CD para GitHub Actions
├── frontend/
│   ├── public/             # Arquivos públicos
│   ├── src/                # Código-fonte do frontend
│   │   ├── components/     # Componentes React
│   │   ├── App.tsx         # Componente principal
│   │   └── main.tsx        # Ponto de entrada
│   ├── package.json        # Dependências do frontend
│   └── tsconfig.json       # Configuração TypeScript
├── backend/
│   ├── src/                # Código-fonte do backend
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços de conversão
│   │   └── utils/          # Utilitários
│   ├── main.py             # Ponto de entrada do backend
│   └── requirements.txt    # Dependências do backend
└── README.md               # Este arquivo
```

## Tecnologias Utilizadas

### Frontend
- React.js com TypeScript
- Tailwind CSS para estilização
- React Dropzone para upload de arquivos
- Axios para requisições HTTP

### Backend
- Flask (Python)
- pdf2docx para conversão PDF → DOCX
- PyMuPDF para manipulação de PDF
- python-docx para manipulação de DOCX
- odfpy para manipulação de ODT

### Infraestrutura
- GitHub Pages para hospedagem do frontend
- GitHub Actions para CI/CD

## Funcionalidades

- Upload de arquivos PDF via arrastar e soltar ou seleção de arquivo
- Seleção de múltiplos formatos de saída
- Conversão mantendo a formatação original
- Download dos arquivos convertidos
- Interface responsiva e minimalista

## Instalação e Execução

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

## Automação com GitHub Actions

O projeto inclui configuração de CI/CD com GitHub Actions para:

1. Build automático ao fazer push para a branch main
2. Deploy automático para GitHub Pages

## Licença

MIT
