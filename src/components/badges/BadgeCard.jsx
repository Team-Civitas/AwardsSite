import '../../App.css'

export default function BadgeCard() {
    return (
        <div className="badge-card">
            <div className="badge-icon">💎</div>
            <div className="badge-rarity">
                <div className="badge-rarity-tag">Standard</div>
            </div>
            <h3 className="badge-title">Team Member</h3>
            <p className="badge-description">Du är medlem i Team Civitas. Grattis!</p>
            <div className="badge-footer">
                <span className="badge-category">Övrigt</span>
                <span>Upplåst</span>
            </div>
        </div>
    )
}