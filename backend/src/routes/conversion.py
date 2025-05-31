import os
import uuid
import logging
from flask import Blueprint, request, send_file, current_app, jsonify
from ..services.converter import pdf_to_docx, pdf_to_html, pdf_to_txt, pdf_to_odt, pdf_to_rtf

convert_bp = Blueprint('convert_bp', __name__, url_prefix='/api')

SUPPORTED_FORMATS = {
    'docx': pdf_to_docx,
    'html': pdf_to_html,
    'txt': pdf_to_txt,
    'odt': pdf_to_odt,
    'rtf': pdf_to_rtf
}

@convert_bp.route('/convert', methods=['POST'])
def convert_pdf_route():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    if 'format' not in request.form:
        return jsonify({"error": "No format specified"}), 400

    file = request.files['file']
    output_format = request.form['format'].lower()

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if output_format not in SUPPORTED_FORMATS:
        return jsonify({"error": f"Unsupported format: {output_format}. Supported formats are {', '.join(SUPPORTED_FORMATS.keys())}"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "File is not a PDF"}), 400

    upload_folder = os.path.join(current_app.root_path, 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    temp_filename_base = str(uuid.uuid4())
    input_pdf_path = os.path.join(upload_folder, f"{temp_filename_base}.pdf")
    output_file_path = os.path.join(upload_folder, f"{temp_filename_base}.{output_format}")

    file.save(input_pdf_path)

    conversion_function = SUPPORTED_FORMATS[output_format]

    try:
        if output_format in ['odt', 'rtf']: # Handling placeholder functions
            logging.warning(f"Attempted conversion to an unimplemented format: {output_format}")
            # Placeholder functions currently return False and log a warning.
            # We adapt this to a 501 response.
            success = conversion_function(input_pdf_path, output_file_path) # This will log the warning
            if not success: # Or if it raises NotImplementedError, catch below
                 return jsonify({"error": f"Conversion to {output_format} is not yet implemented."}), 501

        success = conversion_function(input_pdf_path, output_file_path)
        if success:
            return send_file(output_file_path, as_attachment=True, download_name=f"converted.{output_format}")
        else:
            # Generic error if conversion function returns False without specific NotImplementedError
            return jsonify({"error": "Conversion failed"}), 500
    except NotImplementedError:
        return jsonify({"error": f"Conversion to {output_format} is not implemented"}), 501
    except Exception as e:
        logging.error(f"Error during conversion or file operation: {e}")
        return jsonify({"error": "An error occurred during the conversion process"}), 500
    finally:
        if os.path.exists(input_pdf_path):
            os.remove(input_pdf_path)
            # More robust check for output file before attempting removal
        if os.path.exists(output_file_path):
                os.remove(output_file_path)
