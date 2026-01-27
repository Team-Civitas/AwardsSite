import '../../App.css'

export default function FilterOptions({ activeCategory, onCategoryChange, badgeSearch, setBadgeSearch }) {

    return (
        <div className="filter-options">
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
            <input
                className="filter-search-bar"
                type="text"
                placeholder="Sök på en badge..."
                value={badgeSearch}
                onChange={e => setBadgeSearch(e.target.value)}
            />
        </div>
    )
}