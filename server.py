from flask import Flask, request, jsonify, render_template, send_from_directory
from datetime import datetime
import os
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

# Menu Data
SIZE_PRICES = {
    "small": 2.50,
    "large": 3.50,
}

CUSTOMIZATIONS = {
    "almond milk": 0.50,
    "soy milk": 0.50,
    "extra shot": 1.00,
    "vanilla syrup": 0.75,
}

DRINKS = [
    "cafè latte",
    "cappuccino",
    "mocha",
    "hot chocolate",
    "long black",
]

# Route: Homepage
@app.route("/")
def home():
    return render_template("index.html")

# Route: Admin Dashboard
@app.route("/admin")
def admin():
    return render_template("admin.html")

# Route: Serve menu
@app.route("/api/menu")
def menu():
    return jsonify({
        'drinks': DRINKS,
        'sizes': list(SIZE_PRICES.keys()),
        'size_prices': SIZE_PRICES,
        'customizations': CUSTOMIZATIONS
    })

# Route: Handle order
@app.route("/api/order", methods=["POST"])
def order():
    data = request.json
    name = data.get("name", "").strip()
    drink = data.get("drink")
    size = data.get("size")
    customizations = data.get("customizations", [])

    if not name or drink not in DRINKS or size not in SIZE_PRICES:
        return jsonify({'error': 'Invalid order data'}), 400

    base_price = SIZE_PRICES[size]
    custom_price = sum(CUSTOMIZATIONS.get(c, 0) for c in customizations)
    total_price = base_price + custom_price
    time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Save to file
    order_data = {
        'name': name,
        'drink': drink,
        'size': size,
        'customizations': customizations,
        'price': round(total_price, 2),
        'time': time_str
    }

    with open("orders.json", "a") as f:
        f.write(json.dumps(order_data) + "\n")

    return jsonify(order_data)

# Route: Fetch order history for admin
@app.route("/api/orders")
def order_history():
    orders = []
    if os.path.exists("orders.json"):
        with open("orders.json") as f:
            for line in f:
                try:
                    orders.append(json.loads(line))
                except:
                    pass
    return jsonify(orders)

# Start app
if __name__ == "__main__":
    app.run(debug=True)
