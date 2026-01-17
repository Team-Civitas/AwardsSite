import civitasLogo from '../../assets/team_civitas.svg'
import '../../App.css'

function handleLogout() {
    fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.reload()
    })
}

export default function Navbar({ user }) {
    return (
        <div className="navbar">
            <img src={civitasLogo} alt="Logotype" />
            <p className="navbar-name">Civitas Awards</p>


            {/* SPACER*/}

            <div style={{ flex: 1 }} />

            <div className="navbar-user">
                {!user && (
                    <a
                        className="login-button"
                        href="/auth/discord"
                    >
                        Logga in
                    </a>
                )}

                {user && (
                    <div className="user-profile">
                        <img
                            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                            alt="Avatar"
                        />
                        <span>{user.username}</span>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logga ut
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}