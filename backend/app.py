from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import desc, case
import re
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin123@localhost:5432/recipes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# -------------------------------
# Model
# -------------------------------
class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    cuisine = db.Column(db.String(255))
    title = db.Column(db.String(255))
    rating = db.Column(db.Float)
    prep_time = db.Column(db.Integer)
    cook_time = db.Column(db.Integer)
    total_time = db.Column(db.Integer)
    description = db.Column(db.Text)
    nutrients = db.Column(db.JSON)
    serves = db.Column(db.String(100))
    image_url = db.Column(db.Text)


# -------------------------------
# Helper: Parse Operators
# -------------------------------
def parse_operator(value):
    match = re.match(r"(>=|<=|=|>|<)?\s*(\d+\.?\d*)", value)
    if match:
        operator = match.group(1) if match.group(1) else "="
        number = float(match.group(2))
        return operator, number
    return None, None


# -------------------------------
# Home
# -------------------------------
@app.route("/")
def home():
    return "Backend Running with Image Priority + Search"


# -------------------------------
# Get Recipes (Gallery View)
# -------------------------------
@app.route("/api/recipes", methods=["GET"])
def get_recipes():

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    query = Recipe.query.order_by(
        case((Recipe.image_url == None, 1), else_=0),
        desc(Recipe.rating).nullslast()
    )

    total = query.count()

    recipes = query.offset((page - 1) * limit).limit(limit).all()

    data = []
    for r in recipes:
        data.append({
            "id": r.id,
            "title": r.title,
            "cuisine": r.cuisine,
            "rating": r.rating,
            "prep_time": r.prep_time,
            "cook_time": r.cook_time,
            "total_time": r.total_time,
            "description": r.description,
            "nutrients": r.nutrients,
            "serves": r.serves,
            "image_url": r.image_url
        })

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total,
        "data": data
    })


# -------------------------------
# Search Recipes
# -------------------------------
@app.route("/api/recipes/search", methods=["GET"])
def search_recipes():

    query = Recipe.query

    # Title
    title = request.args.get("title")
    if title:
        query = query.filter(Recipe.title.ilike(f"%{title}%"))

    # Cuisine
    cuisine = request.args.get("cuisine")
    if cuisine:
        query = query.filter(Recipe.cuisine.ilike(f"%{cuisine}%"))

    # Rating
    rating_param = request.args.get("rating")
    if rating_param:
        operator, value = parse_operator(rating_param)
        if operator == ">=":
            query = query.filter(Recipe.rating >= value)
        elif operator == "<=":
            query = query.filter(Recipe.rating <= value)
        elif operator == ">":
            query = query.filter(Recipe.rating > value)
        elif operator == "<":
            query = query.filter(Recipe.rating < value)
        else:
            query = query.filter(Recipe.rating == value)

    # Total Time
    total_time_param = request.args.get("total_time")
    if total_time_param:
        operator, value = parse_operator(total_time_param)
        if operator == ">=":
            query = query.filter(Recipe.total_time >= value)
        elif operator == "<=":
            query = query.filter(Recipe.total_time <= value)
        elif operator == ">":
            query = query.filter(Recipe.total_time > value)
        elif operator == "<":
            query = query.filter(Recipe.total_time < value)
        else:
            query = query.filter(Recipe.total_time == value)

    # Calories (JSONB extraction)
    calories_param = request.args.get("calories")
    if calories_param:
        operator, value = parse_operator(calories_param)
        query = query.filter(
            db.text(
                f"CAST(regexp_replace(nutrients->>'calories', '[^0-9]', '', 'g') AS INTEGER) {operator} {int(value)}"
            )
        )

    results = query.order_by(
        case((Recipe.image_url == None, 1), else_=0),
        desc(Recipe.rating).nullslast()
    ).all()

    data = []
    for r in results:
        data.append({
            "id": r.id,
            "title": r.title,
            "cuisine": r.cuisine,
            "rating": r.rating,
            "prep_time": r.prep_time,
            "cook_time": r.cook_time,
            "total_time": r.total_time,
            "description": r.description,
            "nutrients": r.nutrients,
            "serves": r.serves,
            "image_url": r.image_url
        })

    return jsonify({
        "total_results": len(data),
        "data": data
    })


# -------------------------------
# Run
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)


