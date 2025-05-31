import logging
import fitz  # PyMuPDF
from pdf2docx import Converter as PdfToDocxConverter
from docx import Document as DocxDocument

logging.basicConfig(level=logging.INFO)

def pdf_to_docx(pdf_path, output_path):
    """Converts a PDF file to DOCX format."""
    try:
        cv = PdfToDocxConverter(pdf_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        logging.info(f"Successfully converted {pdf_path} to {output_path}")
        return True
    except Exception as e:
        logging.error(f"Error converting {pdf_path} to DOCX: {e}")
        return False

def pdf_to_html(pdf_path, output_path):
    """Converts a PDF file to HTML format."""
    try:
        doc = fitz.open(pdf_path)
        html_content = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            html_content += page.get_text("html")

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        logging.info(f"Successfully converted {pdf_path} to {output_path}")
        return True
    except Exception as e:
        logging.error(f"Error converting {pdf_path} to HTML: {e}")
        return False

def pdf_to_txt(pdf_path, output_path):
    """Extracts text from a PDF file and saves it to a TXT file."""
    try:
        doc = fitz.open(pdf_path)
        text_content = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text_content += page.get_text("text")

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text_content)
        logging.info(f"Successfully converted {pdf_path} to {output_path}")
        return True
    except Exception as e:
        logging.error(f"Error converting {pdf_path} to TXT: {e}")
        return False

def pdf_to_odt(pdf_path, output_path):
    """Placeholder for PDF to ODT conversion."""
    logging.warning(f"Conversion to ODT from {pdf_path} to {output_path} is not yet implemented.")
    # raise NotImplementedError("PDF to ODT conversion is not yet implemented.")
    return False

def pdf_to_rtf(pdf_path, output_path):
    """Placeholder for PDF to RTF conversion."""
    logging.warning(f"Conversion to RTF from {pdf_path} to {output_path} is not yet implemented.")
    # raise NotImplementedError("PDF to RTF conversion is not yet implemented.")
    return False
