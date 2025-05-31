import os
import pytest
from unittest import mock
from src.services import converter

# Since we are not creating actual files, we can use dummy paths
DUMMY_PDF_PATH = "dummy.pdf"
DUMMY_OUTPUT_PATH_DOCX = "output.docx"
DUMMY_OUTPUT_PATH_HTML = "output.html"
DUMMY_OUTPUT_PATH_TXT = "output.txt"
DUMMY_OUTPUT_PATH_ODT = "output.odt"
DUMMY_OUTPUT_PATH_RTF = "output.rtf"

@mock.patch("src.services.converter.PdfToDocxConverter")
def test_pdf_to_docx_success(mock_pdf_to_docx_converter):
    mock_cv_instance = mock.Mock()
    mock_pdf_to_docx_converter.return_value = mock_cv_instance

    result = converter.pdf_to_docx(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_DOCX)

    mock_pdf_to_docx_converter.assert_called_once_with(DUMMY_PDF_PATH)
    mock_cv_instance.convert.assert_called_once_with(DUMMY_OUTPUT_PATH_DOCX, start=0, end=None)
    mock_cv_instance.close.assert_called_once()
    assert result is True

@mock.patch("src.services.converter.PdfToDocxConverter", side_effect=Exception("Conversion Error"))
def test_pdf_to_docx_failure(mock_pdf_to_docx_converter):
    result = converter.pdf_to_docx(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_DOCX)
    mock_pdf_to_docx_converter.assert_called_once_with(DUMMY_PDF_PATH)
    assert result is False

@mock.patch("fitz.open")
@mock.patch("builtins.open", new_callable=mock.mock_open)
def test_pdf_to_html_success(mock_file_open, mock_fitz_open):
    mock_doc = mock.MagicMock()
    mock_page = mock.MagicMock()
    mock_page.get_text.return_value = "<html><body>Test HTML</body></html>"
    mock_doc.load_page.return_value = mock_page
    mock_doc.__len__.return_value = 1 # Simulate one page
    mock_fitz_open.return_value = mock_doc

    result = converter.pdf_to_html(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_HTML)

    mock_fitz_open.assert_called_once_with(DUMMY_PDF_PATH)
    mock_doc.load_page.assert_called_once_with(0)
    mock_page.get_text.assert_called_once_with("html")
    mock_file_open.assert_called_once_with(DUMMY_OUTPUT_PATH_HTML, "w", encoding="utf-8")
    mock_file_open().write.assert_called_once_with("<html><body>Test HTML</body></html>")
    assert result is True

@mock.patch("fitz.open", side_effect=Exception("Fitz Error"))
def test_pdf_to_html_failure(mock_fitz_open):
    result = converter.pdf_to_html(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_HTML)
    mock_fitz_open.assert_called_once_with(DUMMY_PDF_PATH)
    assert result is False

@mock.patch("fitz.open")
@mock.patch("builtins.open", new_callable=mock.mock_open)
def test_pdf_to_txt_success(mock_file_open, mock_fitz_open):
    mock_doc = mock.MagicMock()
    mock_page = mock.MagicMock()
    mock_page.get_text.return_value = "Test text"
    mock_doc.load_page.return_value = mock_page
    mock_doc.__len__.return_value = 1
    mock_fitz_open.return_value = mock_doc

    result = converter.pdf_to_txt(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_TXT)

    mock_fitz_open.assert_called_once_with(DUMMY_PDF_PATH)
    mock_doc.load_page.assert_called_once_with(0)
    mock_page.get_text.assert_called_once_with("text")
    mock_file_open.assert_called_once_with(DUMMY_OUTPUT_PATH_TXT, "w", encoding="utf-8")
    mock_file_open().write.assert_called_once_with("Test text")
    assert result is True

@mock.patch("fitz.open", side_effect=Exception("Fitz Error"))
def test_pdf_to_txt_failure(mock_fitz_open):
    result = converter.pdf_to_txt(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_TXT)
    mock_fitz_open.assert_called_once_with(DUMMY_PDF_PATH)
    assert result is False

def test_pdf_to_odt_placeholder():
    # Check if it logs a warning, or adapt if it raises NotImplementedError
    with mock.patch.object(converter.logging, 'warning') as mock_log_warning:
        result = converter.pdf_to_odt(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_ODT)
        mock_log_warning.assert_called_once_with(
            f"Conversion to ODT from {DUMMY_PDF_PATH} to {DUMMY_OUTPUT_PATH_ODT} is not yet implemented."
        )
        assert result is False # Placeholder function returns False

def test_pdf_to_rtf_placeholder():
    with mock.patch.object(converter.logging, 'warning') as mock_log_warning:
        result = converter.pdf_to_rtf(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_RTF)
        mock_log_warning.assert_called_once_with(
            f"Conversion to RTF from {DUMMY_PDF_PATH} to {DUMMY_OUTPUT_PATH_RTF} is not yet implemented."
        )
        assert result is False # Placeholder function returns False

# Example of how you might test if NotImplementedError is raised, if you change implementation:
# def test_pdf_to_odt_raises_not_implemented():
#     with pytest.raises(NotImplementedError, match="PDF to ODT conversion is not yet implemented."):
#         converter.pdf_to_odt(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_ODT)

# def test_pdf_to_rtf_raises_not_implemented():
#     with pytest.raises(NotImplementedError, match="PDF to RTF conversion is not yet implemented."):
#         converter.pdf_to_rtf(DUMMY_PDF_PATH, DUMMY_OUTPUT_PATH_RTF)
