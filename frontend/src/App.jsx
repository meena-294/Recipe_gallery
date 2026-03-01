
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const [showSearch, setShowSearch] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    rating: "",
    total_time: "",
    calories: ""
  });

  // 🔐 Spoonacular API Key
  const SPOONACULAR_API_KEY = "96b341083110486286f82491ac0a000a";

  // 🔥 Fetch image from Spoonacular
  const fetchSpoonacularImage = async (title) => {
    try {
      // 1️⃣ Try matching recipe title
      const searchRes = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        {
          params: {
            query: title,
            number: 1,
            apiKey: SPOONACULAR_API_KEY
          }
        }
      );

      if (searchRes.data.results.length > 0) {
        return searchRes.data.results[0].image;
      }

      // 2️⃣ If no match → get random food image
      const randomRes = await axios.get(
        "https://api.spoonacular.com/recipes/random",
        {
          params: {
            number: 1,
            apiKey: SPOONACULAR_API_KEY
          }
        }
      );

      if (randomRes.data.recipes.length > 0) {
        return randomRes.data.recipes[0].image;
      }

      return null;
    } catch (error) {
      console.error("Image fetch error:", error);
      return null;
    }
  };

  // ===============================
  // Fetch Recipes (Pagination)
  // ===============================
  const fetchRecipes = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/api/recipes?page=${page}&limit=${limit}`
      );

      let recipesData = res.data.data || [];

      // Attach Spoonacular image if missing
      const updatedRecipes = await Promise.all(
        recipesData.map(async (recipe) => {
          if (!recipe.image_url) {
            const spoonImage = await fetchSpoonacularImage(recipe.title);
            return {
              ...recipe,
              image_url: spoonImage
            };
          }
          return recipe;
        })
      );

      setRecipes(updatedRecipes);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
    window.scrollTo(0, 0);
  }, [page, limit]);

  // ===============================
  // Search Recipes
  // ===============================
  const searchRecipes = async () => {
    try {
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params[key] = filters[key];
      });

      const res = await axios.get(
        "http://127.0.0.1:5000/api/recipes/search",
        { params }
      );

      let recipesData = res.data.data || [];

      const updatedRecipes = await Promise.all(
        recipesData.map(async (recipe) => {
          if (!recipe.image_url) {
            const spoonImage = await fetchSpoonacularImage(recipe.title);
            return {
              ...recipe,
              image_url: spoonImage
            };
          }
          return recipe;
        })
      );

      setRecipes(updatedRecipes);
      setTotal(res.data.total_results || 0);
      setPage(1);
      setShowSearch(false);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div>

      {/* 🔮 Search Toggle */}
      <div
        className="search-toggle"
        onClick={() => setShowSearch(!showSearch)}
      >
        🔮 Search Recipes
      </div>

      {/* ✨ Search Panel */}
      <div className={`search-panel ${showSearch ? "active" : ""}`}>
        <div className="search-header">
          ✨ Magical Search Portal ✨
        </div>

        <div className="search-grid">
          <input
            placeholder="Title"
            value={filters.title}
            onChange={(e) =>
              setFilters({ ...filters, title: e.target.value })
            }
          />
          <input
            placeholder="Cuisine"
            value={filters.cuisine}
            onChange={(e) =>
              setFilters({ ...filters, cuisine: e.target.value })
            }
          />
          <input
            placeholder="Rating (>=4.5)"
            value={filters.rating}
            onChange={(e) =>
              setFilters({ ...filters, rating: e.target.value })
            }
          />
          <input
            placeholder="Total Time (<=60)"
            value={filters.total_time}
            onChange={(e) =>
              setFilters({ ...filters, total_time: e.target.value })
            }
          />
          <input
            placeholder="Calories (<=400)"
            value={filters.calories}
            onChange={(e) =>
              setFilters({ ...filters, calories: e.target.value })
            }
          />
        </div>

        <div className="search-actions">
          <button className="apply-btn" onClick={searchRecipes}>
            ✨ Apply Magic
          </button>
          <button
            className="close-btn-search"
            onClick={() => setShowSearch(false)}
          >
            Close
          </button>
        </div>
      </div>

      {/* 🌌 Title */}
      <h1 className="hero-title">
        ✨ Enchanted Recipe Gallery ✨
      </h1>

      {/* 🍽 Recipe Grid */}
      <div className="card-grid">
        {recipes.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            No recipes found.
          </p>
        ) : (
          recipes.map((recipe) => (
            <div
              className="card"
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img
                src={recipe.image_url}
                alt={recipe.title}
              />

              <div className="card-content">
                <div className="card-title">
                  {recipe.title}
                </div>

                <div className="card-meta">
                  <span>{recipe.cuisine}</span>
                  <span>⭐ {recipe.rating || "N/A"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📄 Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span className="page-info">
          Page {page} of {Math.ceil(total / limit)}
        </span>

        <button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* 📊 Results Per Page */}
      <div className="results-dropdown">
        <label>Results per page: </label>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(Number(e.target.value));
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* 🎬 Drawer */}
      {selectedRecipe && (
        <>
          <div
            className="overlay"
            onClick={() => setSelectedRecipe(null)}
          ></div>

          <div className="drawer active">

            <div className="drawer-header">
              <img
                src={selectedRecipe.image_url}
                alt={selectedRecipe.title}
                className="drawer-image"
              />

              <div
                className="close-btn"
                onClick={() => setSelectedRecipe(null)}
              >
                ✖
              </div>
            </div>

            <div className="drawer-title-below">
              {selectedRecipe.title}
            </div>

            <div className="drawer-body">
              <div className="info-badges">
                <div className="badge">🍽 {selectedRecipe.cuisine}</div>
                <div className="badge">⏱ {selectedRecipe.total_time} mins</div>
                <div className="badge">⭐ {selectedRecipe.rating || "N/A"}</div>
              </div>

              <p className="recipe-description">
                {selectedRecipe.description}
              </p>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default App;
