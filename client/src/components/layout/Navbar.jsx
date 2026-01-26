import civitasLogo from '../../assets/team_civitas.svg'
import '../../App.css'

function handleLogout() {
    fetch("/api/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.reload()
    })
}

export default function Navbar({ user }) {
    return (
        <div className="navbar">
            <div className="navbar-sub">
                <img src={civitasLogo} alt="Logotype" />
                <p className="navbar-name">Civitas Awards</p>
            </div>

            <div className="navbar-user">
                {!user && (

                    <a
                        className="login-button"
                        href="/auth/discord"
                    >
                        <svg className="nav-login-icon"><path d="m20.42 6.11-7.97-4c-.28-.14-.62-.14-.9 0l-7.97 4c-.31.15-.51.45-.55.79-.01.11-.96 10.76 8.55 15.01a.98.98 0 0 0 .82 0C21.91 17.66 20.97 7 20.95 6.9a.98.98 0 0 0-.55-.79ZM12 19.9C5.26 16.63 4.94 9.64 5 7.64l7-3.51 7 3.51c.04 1.99-.33 9.02-7 12.26"></path><path d="m11 12.59-1.29-1.3-1.42 1.42 2.71 2.7 4.71-4.7-1.42-1.42z"></path></svg>
                        Logga in med Discord
                    </a>
                )}


                {user && (

                    <div className="user-profile">
                        <div className="user-info">
                            <img
                                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                alt="Avatar"
                            />
                            <span>@{user.username}</span>
                        </div>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <svg className="nav-logout-icon"><path d="M15 11H8v2h7v4l6-5-6-5z"></path><path d="M5 21h7v-2H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2"></path></svg>
                            Logga ut
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}