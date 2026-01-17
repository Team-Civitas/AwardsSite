import '../../App.css'

const STATUS_LABELS = {
  locked: "EJ UPPLÅST",
  unlocked: "UPPLÅST"
}

const CATEGORY_LABELS = {
    stories: "Civitas Stories",
    originals: "Civitas Originals",
    other: "Övrigt"
}

export default function BadgeCard( { badge }) {
    return (
        <div className={`badge-card rarity-${badge.rarity} status-${badge.status}`}>
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-rarity">
                <div className={`badge-rarity-tag rarity-${badge.rarity}`}>{badge.rarity}</div>
            </div>
            <h3 className="badge-title">{badge.title}</h3>
            <p className="badge-description">{badge.description}</p>
            <p className="badge-mission">{badge.mission}</p>
            <div className="badge-footer">
                <span className="badge-category">{CATEGORY_LABELS[badge.category]}</span>
                <span>{STATUS_LABELS[badge.status]}</span>
            </div>
        </div>
    )
}