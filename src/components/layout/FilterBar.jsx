import '../../App.css'

export default function FilterBar({ activeCategory, onCategoryChange }) {
    return (
        <div className="filter-bar">
            <div className="filter-tabs">
                <button
                    className={activeCategory === "all" ? "active" : ""}
                    onClick={() => onCategoryChange("all")}>Alla kategorier</button>
                <button
                    className={activeCategory === "stories" ? "active" : ""}
                    onClick={() => onCategoryChange("stories")}>Civitas Stories</button>
                <button
                    className={activeCategory === "originals" ? "active" : ""}
                    onClick={() => onCategoryChange("originals")}>Civitas Originals</button>
                <button
                    className={activeCategory === "other" ? "active" : ""}
                    onClick={() => onCategoryChange("other")}>Övrigt</button>
            </div>
        </div>
    )
}