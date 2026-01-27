import BadgeCard from "./BadgeCard"
import badges from "../../data/badges.json"

export default function BadgeGrid({ activeCategory, user, badgeSearch = "" }) {

  const visibleBadges = badges.filter(badge => {
    const matchesCategory =
      activeCategory === "all" || badge.category === activeCategory;

    const search = badgeSearch.toLowerCase();

    const matchesSearch =
      badge.title.toLowerCase().includes(search) ||
      badge.description?.toLowerCase().includes(search);


    return matchesCategory && matchesSearch;
  });

  return (
    <div className="badge-grid">
      {visibleBadges.map(badge => {
        const isUnlocked = user?.badges?.includes(badge.id)

        return (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={isUnlocked}
          />
        )
      })}
    </div>
  )
}