import BadgeCard from "./BadgeCard"
import badges from "../../data/badges.json"

export default function BadgeGrid({ activeCategory }) {
  const visibleBadges = badges.filter(badge => {
    if (activeCategory === "all") return true
    return badge.category === activeCategory
  })

  return (
    <div className="badge-grid">
      {visibleBadges.map(badge => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  )
}
