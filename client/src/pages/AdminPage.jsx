import { useEffect, useState } from "react";
import UserRow from "../components/admin/UserRow"; // om den ligger i egen fil

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/users", { credentials: "include" }),
            fetch("/api/admin/badges", { credentials: "include" })
        ])
            .then(async ([usersRes, badgesRes]) => {
                const usersData = await usersRes.json();
                const badgesData = await badgesRes.json();

                setUsers(usersData);
                setBadges(badgesData);
                setLoading(false);
            });
    }, []);

    function toggleUserBadge(userId, badgeId, hasBadge) {
        fetch(`/api/admin/${hasBadge ? "revoke-badge" : "grant-badge"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId, badgeId })
        }).then(() => {
            setUsers(prev =>
                prev.map(u =>
                    u.id !== userId
                        ? u
                        : {
                              ...u,
                              badges: hasBadge
                                  ? u.badges.filter(b => b !== badgeId)
                                  : [...u.badges, badgeId]
                          }
                )
            );
        });
    }

    if (loading) return <p>Laddar adminpanel…</p>;

    return (
        <div style={{ padding: 24 }}>
            <h1>Adminpanel – Badges</h1>

            {users.map(user => (
                <UserRow
                    key={user.id}
                    user={user}
                    badges={badges}
                    onToggleBadge={toggleUserBadge}
                />
            ))}
        </div>
    );
}
