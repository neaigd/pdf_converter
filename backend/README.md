# PDF Converter - Backend

This directory contains the backend for the PDF Converter application, responsible for processing and converting PDF files to various text formats.

## Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── conversion.py  # API routes for conversion
│   ├── services/
│   │   └── converter.py   # Core conversion logic
│   └── utils/             # Placeholder for utility functions (if any in future)
├── main.py                # Main application entry point (Flask app)
└── requirements.txt       # Python dependencies
```

## Installation

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python3 -m venv venv  # Use python3 if your default python is 2.x

# Activate the virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Execution

```bash
python main.py
```
The Flask development server will start, typically on `http://localhost:5000`.
An `uploads/` directory will be created in the `backend` directory to temporarily store uploaded and converted files.

## API Endpoints

### `POST /api/convert`

Converts an uploaded PDF file to the specified output format.

- **Request:** `multipart/form-data`
  - **`file`**: The PDF file to be converted (required).
  - **`format`**: The desired output format (required). Supported values:
    - `'docx'`: Microsoft Word (DOCX) - Full support.
    - `'html'`: HTML - Full support.
    - `'txt'`: Plain Text (TXT) - Full support.
    - `'odt'`: OpenDocument Text (ODT) - Placeholder, returns 501 Not Implemented.
    - `'rtf'`: Rich Text Format (RTF) - Placeholder, returns 501 Not Implemented.

- **Responses:**
  - **`200 OK`**: Success. The response body will contain the converted file as a blob, with appropriate `Content-Disposition` and `Content-Type` headers for direct download.
  - **`400 Bad Request`**: Invalid request. This can occur if:
    - The `file` or `format` parameter is missing.
    - The `file` is not a PDF.
    - The `format` specified is not one of the recognized values.
    - Response body: JSON object, e.g., `{"error": "No file part"}` or `{"error": "Unsupported format: xyz"}`.
  - **`500 Internal Server Error`**: An error occurred during the conversion process on the server.
    - Response body: JSON object, e.g., `{"error": "Conversion failed"}` or `{"error": "An error occurred during the conversion process"}`.
  - **`501 Not Implemented`**: The requested conversion format is recognized but not yet implemented (e.g., 'odt', 'rtf').
    - Response body: JSON object, e.g., `{"error": "Conversion to odt is not implemented"}`.
