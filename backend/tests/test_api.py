import pytest
import io
import json
from main import app as flask_app # Assuming your Flask app instance is named 'app' in main.py
from unittest import mock

@pytest.fixture
def app_fixture(): # Renamed from 'app' to avoid conflict with flask_app import if flask_app was also 'app'
    # Configure the app for testing
    flask_app.config.update({
        "TESTING": True,
        # Add other configurations if necessary, e.g., suppress logging for tests
        # "LOGGING_LEVEL": "CRITICAL",
    })
    # You might want to set up a temporary 'uploads' folder or mock its creation/use
    # For now, we assume the service layer mocks will prevent actual file I/O for most tests
    yield flask_app

@pytest.fixture
def client(app_fixture):
    return app_fixture.test_client()

# --- Test Cases for POST /api/convert ---

def create_dummy_pdf_bytes():
    # A very simple valid PDF structure (minimal)
    # This is not a visually renderable PDF but should pass basic 'is PDF?' checks
    # if the backend relies on simple magic number or structure.
    # For more robust testing, a small, actual PDF file loaded into BytesIO would be better.
    pdf_bytes = b"%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000058 00000 n\n0000000111 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n130\n%%EOF"
    return io.BytesIO(pdf_bytes)

@mock.patch("src.routes.conversion.send_file") # Mock send_file itself in the route
def test_convert_pdf_success_docx(mock_send_file_route, client):
    # Removed mock_path_exists_route as send_file is already mocked, reducing complexity.
    # The finally block in the route should correctly find no file to delete if it wasn't created,
    # or rely on the natural os.path.exists for the output_file_path if it were actually created by a real service.
    # Since the service is mocked here to return True (success), but doesn't create a file,
    # the os.path.exists in finally should be False for output_file_path.
    mock_docx_service_func = mock.Mock(return_value=True)
    # Patch the 'docx' entry in SUPPORTED_FORMATS for this test
    with mock.patch.dict("src.routes.conversion.SUPPORTED_FORMATS", {'docx': mock_docx_service_func}):
        dummy_pdf = create_dummy_pdf_bytes()
        data = {
            'file': (dummy_pdf, 'test.pdf'),
            'format': 'docx'
        }

        mock_send_file_route.return_value = "File sent"

        response = client.post('/api/convert', data=data, content_type='multipart/form-data')

        assert response.status_code == 200
        args, kwargs = mock_send_file_route.call_args
        assert kwargs.get('as_attachment') is True
        assert 'converted.docx' in kwargs.get('download_name', '')
        mock_docx_service_func.assert_called_once()


def test_convert_missing_file(client):
    data = {'format': 'docx'}
    response = client.post('/api/convert', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert "error" in json_data
    assert json_data["error"] == "No file part"

def test_convert_missing_format(client):
    dummy_pdf = create_dummy_pdf_bytes()
    data = {'file': (dummy_pdf, 'test.pdf')}
    response = client.post('/api/convert', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert "error" in json_data
    assert json_data["error"] == "No format specified"

def test_convert_unsupported_format(client):
    dummy_pdf = create_dummy_pdf_bytes()
    data = {
        'file': (dummy_pdf, 'test.pdf'),
        'format': 'unsupported_ext'
    }
    response = client.post('/api/convert', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert "error" in json_data
    assert "Unsupported format" in json_data["error"]

def test_convert_non_pdf_file(client):
    # Simulate a non-PDF file by changing the filename/content type if your app checks it
    # For now, the backend checks filename extension.
    dummy_txt = io.BytesIO(b"This is not a PDF.")
    data = {
        'file': (dummy_txt, 'test.txt'),
        'format': 'docx'
    }
    response = client.post('/api/convert', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert "error" in json_data
    assert json_data["error"] == "File is not a PDF"

def test_convert_no_selected_file(client):
    data = {
        'file': (io.BytesIO(b"this is a dummy file"), ''), # Empty filename but with content
        'format': 'docx'
    }
    response = client.post('/api/convert', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    json_data = json.loads(response.data)
    assert "error" in json_data
    assert json_data["error"] == "No selected file"


def test_convert_not_implemented_odt(client):
    mock_odt_service_func = mock.Mock(return_value=False)
    with mock.patch.dict("src.routes.conversion.SUPPORTED_FORMATS", {'odt': mock_odt_service_func}):
        dummy_pdf = create_dummy_pdf_bytes()
        data = {
            'file': (dummy_pdf, 'test.pdf'),
            'format': 'odt'
        }
        response = client.post('/api/convert', data=data, content_type='multipart/form-data')

        assert response.status_code == 501
        json_data = json.loads(response.data)
        assert "error" in json_data
        assert "Conversion to odt is not yet implemented" in json_data["error"]
        mock_odt_service_func.assert_called_once()

def test_convert_not_implemented_rtf(client):
    mock_rtf_service_func = mock.Mock(return_value=False)
    with mock.patch.dict("src.routes.conversion.SUPPORTED_FORMATS", {'rtf': mock_rtf_service_func}):
        dummy_pdf = create_dummy_pdf_bytes()
        data = {
            'file': (dummy_pdf, 'test.pdf'),
            'format': 'rtf'
        }
        response = client.post('/api/convert', data=data, content_type='multipart/form-data')

        assert response.status_code == 501
        json_data = json.loads(response.data)
        assert "error" in json_data
        assert "Conversion to rtf is not yet implemented" in json_data["error"]
        mock_rtf_service_func.assert_called_once()


def test_convert_pdf_conversion_fails_in_service(client):
    # Removed mock_path_exists_route. If conversion service returns False,
    # no output file is created. The 'finally' block's os.path.exists(output_file_path)
    # should correctly return False, and os.remove for output_file_path should be skipped.
    mock_txt_service_func = mock.Mock(return_value=False) # Simulate conversion returning False
    # Patch the specific format 'txt' in the SUPPORTED_FORMATS dictionary for this test
    with mock.patch.dict("src.routes.conversion.SUPPORTED_FORMATS", {'txt': mock_txt_service_func}):
        dummy_pdf = create_dummy_pdf_bytes()
        data = {
            'file': (dummy_pdf, 'test.pdf'),
            'format': 'txt' # Using 'txt' as an example of a normally supported format
        }

        response = client.post('/api/convert', data=data, content_type='multipart/form-data')

        assert response.status_code == 500 # Should be 500 if conversion function returns False
        json_data = json.loads(response.data)
        assert "error" in json_data
        assert json_data["error"] == "Conversion failed" # Message from conversion.py
        mock_txt_service_func.assert_called_once()
