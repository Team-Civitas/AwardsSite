import '../../App.css'

export default function BadgeCard( { badge }) {
    return (
        <div className={`badge-card rarity-${badge.rarity}`}>
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-rarity">
                <div className={`badge-rarity-tag rarity-${badge.rarity}`}>{badge.rarity}</div>
            </div>
            <h3 className="badge-title">{badge.title}</h3>
            <p className="badge-description">{badge.description}</p>
            <p className="badge-mission">{badge.mission}</p>
            <div className="badge-footer">
                <span className="badge-category">{badge.category}</span>
                <span>{badge.status}</span>
            </div>
        </div>
    )
}