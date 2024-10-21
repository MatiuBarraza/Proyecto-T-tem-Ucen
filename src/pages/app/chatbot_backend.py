from flask import Flask, request, jsonify
import pdfplumber
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

# Función para cargar el contenido del PDF
def cargar_pdf(ruta_pdf):
    contenido = ""
    try:
        with pdfplumber.open(ruta_pdf) as pdf:
            for page in pdf.pages:
                texto = page.extract_text()
                if texto:
                    contenido += texto + " "
        print("Contenido del PDF cargado:\n", contenido)  # <--- Aquí está el print
        return contenido
    except Exception as e:
        print(f"Error al cargar el PDF: {e}")
        return None


# Cargar el PDF al inicio del servidor
pdf_path = "src/ejemplo_universidad.pdf"  # Cambia esto por la ruta de tu archivo PDF
pdf_content = cargar_pdf(pdf_path)

# Función para buscar una respuesta en el contenido del PDF
def buscar_respuesta(pregunta):
    # Simplificación: Busca la primera oración en la que aparece la palabra clave
    if pdf_content:
        palabras_clave = pregunta.lower().split()  # Separa en palabras clave
        for palabra in palabras_clave:
            if palabra in pdf_content.lower():
                # Extrae un fragmento de texto alrededor de la palabra clave
                index = pdf_content.lower().find(palabra)
                start = max(0, index - 100)
                end = min(len(pdf_content), index + 100)
                return pdf_content[start:end].strip()
        return "No encontré información relacionada con tu pregunta en el documento."
    else:
        return "El documento no se pudo cargar correctamente."

# Ruta de la API para recibir preguntas
@app.route('/preguntar', methods=['POST'])
def preguntar():
    data = request.get_json()
    pregunta = data.get("pregunta", "")
    respuesta = buscar_respuesta(pregunta)
    return jsonify({"respuesta": respuesta})

if __name__ == '__main__':
    app.run(debug=True)
