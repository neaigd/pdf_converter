# PDF Converter - Backend

Este diretório contém o backend do aplicativo PDF Converter, responsável pelo processamento e conversão de arquivos PDF para vários formatos de texto.

## Estrutura

```
backend/
├── src/
│   ├── routes/
│   │   └── conversion.py
│   ├── services/
│   │   └── converter.py
│   └── utils/
│       └── file_utils.py
├── main.py
└── requirements.txt
```

## Instalação

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt
```

## Execução

```bash
python main.py
```

## API Endpoints

- `POST /api/convert`: Converte um arquivo PDF para o formato especificado
  - Parâmetros:
    - `file`: Arquivo PDF (multipart/form-data)
    - `format`: Formato de saída (docx, odt, txt, rtf, html)
  - Resposta:
    - Arquivo convertido para download
