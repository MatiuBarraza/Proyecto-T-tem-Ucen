from flask import Flask, request, jsonify
import pdfplumber
from transformers import BertForQuestionAnswering, BertTokenizer
import torch

app = Flask(__name__)

# Ruta del PDF que contiene la información
PDF_PATH = "manual_del_alumno_ucen.pdf"

# Cargar el modelo y el tokenizador de BERT
model_name = "bert-large-uncased-whole-word-masking-finetuned-squad"
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForQuestionAnswering.from_pretrained(model_name)

def extract_pdf_text():
    """Extrae y devuelve todo el texto del PDF."""
    with pdfplumber.open(PDF_PATH) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text

def answer_question(question, context):
    """Usa BERT para encontrar una respuesta en el contexto proporcionado."""
    inputs = tokenizer(question, context, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        answer_start = torch.argmax(outputs.start_logits)
        answer_end = torch.argmax(outputs.end_logits) + 1
        answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(inputs["input_ids"][0][answer_start:answer_end]))
    return answer

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')

    if not user_message:
        return jsonify({"reply": "No recibí ninguna pregunta, intenta de nuevo."}), 400

    # Extraer el texto del PDF
    context = extract_pdf_text()

    # Usar BERT para obtener la respuesta
    response = answer_question(user_message, context)

    # Si no se encuentra una respuesta válida
    if not response or response.strip() == '[CLS]':
        response = "Lo siento, no encontré una respuesta clara en el documento."

    return jsonify({"reply": response})

if __name__ == '__main__':
    app.run(debug=True)
