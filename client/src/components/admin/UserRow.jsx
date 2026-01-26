import { useState } from "react";

function UserRow({ user, badges, onToggleBadge }) {
    const [badgeSearch, setBadgeSearch] = useState("");

    const filteredBadges = badges.filter(b =>
        b.id.toLowerCase().includes(badgeSearch.toLowerCase())
    );

    function getAvatarUrl(user) {
        if (!user.avatar) {
            const index = Number(user.id) % 5;
            return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
        }

        const ext = user.avatar.startsWith("a_") ? "gif" : "png";
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`;
    }

    return (
        <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={getAvatarUrl(user)} width={40} height={40} style={{ borderRadius: "50%" }} />
                <strong>{user.name}</strong>
            </div>

            <input
                type="text"
                placeholder="Sök badge-id…"
                value={badgeSearch}
                onChange={e => setBadgeSearch(e.target.value)}
                style={{ marginTop: 8, marginBottom: 8, padding: 6, width: 240 }}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {filteredBadges.map(badge => {
                    const hasBadge = user.badges.includes(badge.id);

                    return (
                        <label key={badge.id}>
                            <input
                                type="checkbox"
                                checked={hasBadge}
                                onChange={() =>
                                    onToggleBadge(user.id, badge.id, hasBadge)
                                }
                            />
                            {" "}{badge.id}
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export default UserRow;
