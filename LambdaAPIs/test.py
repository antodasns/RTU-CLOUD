from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample in-memory data store
data_store = []

# GET API - Retrieve all items
@app.route('/items', methods=['GET'])
def get_items():
    return jsonify({"items": data_store}), 200

# POST API - Add a new item
@app.route('/items', methods=['POST'])
def add_item():
    new_item = request.json  # Get JSON data from request body
    if not new_item or "name" not in new_item:
        return jsonify({"error": "Invalid data"}), 400
    
    data_store.append(new_item)  # Add to the list
    return jsonify({"message": "Item added", "item": new_item}), 201

if __name__ == '__main__':
    app.run(debug=True)
