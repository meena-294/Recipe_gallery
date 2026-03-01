import json
from app import app, db, Recipe

with app.app_context():

    with open("US_recipes_null.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    # If JSON is a dictionary, convert to list
    if isinstance(data, dict):
        data = data.values()

    count = 0

    for item in data:

        if not isinstance(item, dict):
            continue

        rating = item.get("rating")
        if rating == "NaN" or rating is None:
            rating = None

        prep_time = item.get("prep_time")
        if prep_time == "NaN":
            prep_time = None

        cook_time = item.get("cook_time")
        if cook_time == "NaN":
            cook_time = None

        total_time = item.get("total_time")
        if total_time == "NaN":
            total_time = None

        recipe = Recipe(
            cuisine=item.get("cuisine"),
            title=item.get("title"),
            rating=rating,
            prep_time=prep_time,
            cook_time=cook_time,
            total_time=total_time,
            description=item.get("description"),
            nutrients=item.get("nutrients"),
            serves=item.get("serves")
        )

        db.session.add(recipe)
        count += 1

    db.session.commit()

    print(f"{count} recipes inserted successfully!")

