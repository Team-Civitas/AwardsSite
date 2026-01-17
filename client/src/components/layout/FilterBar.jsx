import '../../App.css'

export default function FilterBar({ activeCategory, onCategoryChange }) {
    return (
        <div className="filter-bar">
            <div className="filter-tabs">
                <button
                    className={activeCategory === "all" ? "active" : ""}
                    onClick={() => onCategoryChange("all")}>Alla kategorier</button>
                <button
                    className={activeCategory === "core" ? "active" : ""}
                    onClick={() => onCategoryChange("core")}>Core</button>
                <button
                    className={activeCategory === "modpack" ? "active" : ""}
                    onClick={() => onCategoryChange("modpack")}>Modpack</button>
                <button
                    className={activeCategory === "other" ? "active" : ""}
                    onClick={() => onCategoryChange("other")}>Övrigt</button>
            </div>
        </div>
    )
}