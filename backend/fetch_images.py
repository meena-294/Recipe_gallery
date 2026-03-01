import requests
import time
import os
from dotenv import load_dotenv
from app import app, db, Recipe

# Load API key
load_dotenv()
API_KEY = os.getenv("SPOONACULAR_API_KEY")

BASE_URL = "https://api.spoonacular.com/recipes/complexSearch"

def fetch_image_for_recipe(title):
    params = {
        "query": title,
        "number": 1,
        "apiKey": API_KEY
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        results = data.get("results")

        if results:
            return results[0].get("image")

    return None


with app.app_context():

    recipes = Recipe.query.filter(
        (Recipe.image_url == None) | (Recipe.image_url == "")
    ).limit(50).all()  # Limit to avoid hitting API limit

    print(f"Fetching images for {len(recipes)} recipes...")

    for recipe in recipes:
        print(f"Searching image for: {recipe.title}")

        image_url = fetch_image_for_recipe(recipe.title)

        if image_url:
            recipe.image_url = image_url
            db.session.commit()
            print("Image saved ✅")
        else:
            print("No image found ❌")

        time.sleep(1)  # Avoid API rate limit

    print("Done updating images!")
