import BadgeCard from "./BadgeCard"
import badges from "../../data/badges.json"

const testBadge = {
  id: "member",
  title: "Team Member",
  description: "Du är medlem i Team Civitas. Grattis!",
  category: "Övrigt",
  rarity: "Standard",
  icon: "⭐"
}

export default function BadgeGrid() {
  return (
    <div className="badge-grid">
        {badges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
        ))}
      
    </div>
  )
}
