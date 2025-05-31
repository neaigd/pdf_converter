import os
from flask import Flask, jsonify
from src.routes.conversion import convert_bp # Import the blueprint

app = Flask(__name__)

# Register the blueprint
app.register_blueprint(convert_bp)

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    # Ensure the 'uploads' directory exists
    upload_folder = os.path.join(app.root_path, 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    app.run(debug=True, host='0.0.0.0', port=5000)
