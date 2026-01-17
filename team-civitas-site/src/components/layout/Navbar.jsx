import civitasLogo from '../../assets/team_civitas.svg'
import '../../App.css'

export default function Navbar() {
    return (
        <div className="navbar">
            <img src={civitasLogo} alt="Logotype"/>
            <p className="navbar-name">Civitas Awards</p>
        </div>
    )
}