import "./RecipeDrawer.css";

function RecipeDrawer({ recipe, onClose }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2>{recipe.name}</h2>
        <p className="time">{recipe.minutes} mins</p>

        <div className="section">
          <h4>Ingredients</h4>
          <ul>
            <li>Ingredient 1</li>
            <li>Ingredient 2</li>
            <li>Ingredient 3</li>
          </ul>
        </div>

        <div className="section">
          <h4>Instructions</h4>
          <p>
            Step 1: Prepare ingredients.<br/>
            Step 2: Cook properly.<br/>
            Step 3: Serve hot.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecipeDrawer;
