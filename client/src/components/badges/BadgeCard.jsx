import '../../App.css'

const STATUS_LABELS = {
    locked: "EJ UPPLÅST",
    unlocked: "UPPLÅST"
}

const CATEGORY_LABELS = {
    modpack: "Modpack",
    core: "Core",
    other: "Övrigt"
}

export default function BadgeCard({ badge, unlocked }) {
    return (
        <div className={`badge-card rarity-${badge.rarity} ${unlocked ? "unlocked" : "locked"}`}>
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-rarity">
                <div className={`badge-rarity-tag rarity-${badge.rarity}`}>{badge.rarity}</div>
            </div>
            <h3 className="badge-title">{badge.title}</h3>
            <p className="badge-description">{badge.description}</p>
            <p className="badge-mission">{badge.mission}</p>
            <div className="badge-footer">
                <span className="badge-category">{CATEGORY_LABELS[badge.category]}</span>
                <span>{unlocked ? "Upplåst" : "Ej Upplåst"}</span>
            </div>
        </div>
    )
}