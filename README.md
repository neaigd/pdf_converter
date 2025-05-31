# PDF Converter - Web Application

This repository contains a web application for converting PDF files to various text formats (DOCX, ODT, TXT, RTF, HTML), aiming to maintain original formatting.

## Project Structure

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
│   ├── src/                # Backend source code
│   │   ├── routes/         # API routes (e.g., conversion.py)
│   │   ├── services/       # Conversion services (e.g., converter.py)
│   │   └── utils/          # Utility functions (if any)
│   ├── main.py             # Backend entry point
│   └── requirements.txt    # Backend dependencies
└── README.md               # This file
```

## Technologies Used

### Frontend
- React.js with TypeScript
- Vite as build tool and dev server
- Tailwind CSS for styling
- React Dropzone for file uploads
- Axios for HTTP requests

### Backend
- Flask (Python)
- pdf2docx for PDF → DOCX conversion
- PyMuPDF (fitz) for PDF manipulation (HTML, TXT extraction)
- python-docx for DOCX manipulation (used by pdf2docx)
- odfpy for ODT manipulation (currently placeholder)

### Infrastructure (Example)
- GitHub Pages for frontend hosting (example setup)
- GitHub Actions for CI/CD (example setup)

## Features

- PDF file upload via drag & drop or file selection
- Selection of multiple output formats (DOCX, HTML, TXT fully supported; ODT, RTF are placeholders)
- Conversion aiming to maintain original formatting
- Automatic download of converted files
- Responsive and minimalist interface with dark mode support

## Installation and Execution

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```
The frontend will typically be available at `http://localhost:5173`.

### Backend

```bash
cd backend
python3 -m venv venv  # Use python3 if default python is 2.x
source venv/bin/activate  # Linux/Mac
# For Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
The backend server will run on `http://localhost:5000`.
It creates an `uploads/` directory for temporary file storage.

## Backend API

The primary API endpoint for conversion is:

- **`POST /api/convert`**
    - **Request:** `multipart/form-data` with fields:
        - `file`: The PDF file to convert.
        - `format`: The desired output format (e.g., 'docx', 'html', 'txt', 'odt', 'rtf').
    - **Response:**
        - Success (200 OK): The converted file is sent as a blob for download.
        - Not Implemented (501 Not Implemented): If the requested format (e.g., 'odt', 'rtf') is not yet supported.
        - Bad Request (400 Bad Request): For missing file/format or invalid parameters.
        - Server Error (500 Internal Server Error): If conversion fails.

## Automation with GitHub Actions (Example)

The project includes an example CI/CD configuration with GitHub Actions for:

1. Automatic build on push to the main branch.
2. Automatic deployment to GitHub Pages (for the frontend).

## License

MIT
