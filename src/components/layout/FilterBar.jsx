import '../../App.css'

export default function FilterBar() {
    return (
        <div className="filter-bar">
            <div className="filter-tabs">
                <button>Alla kategorier</button>
                <button>Civitas Stories</button>
                <button>Civitas Originals</button>
                <button>Övrigt</button>
            </div>
        </div>
    )
}