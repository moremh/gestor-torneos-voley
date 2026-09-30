import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'

const DashboardPage = () => {
  const navigate = useNavigate()

  const {
    user,
    profile,
  } = useAuth()

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login', {
        replace: true,
      })
    } catch (error) {
      console.error(
        'Error cerrando sesión:',
        error
      )
    }
  }

  const userName =
    profile?.firstName ||
    user?.displayName?.split(' ')[0] ||
    'Organizador'

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <strong className="app-name">
            🏐 Gestor de Torneos
          </strong>
        </div>

        <div className="header-user">
          <span>
            {userName}
          </span>

          <button
            className="secondary-button"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-title">
          <div>
            <h1>Mis torneos</h1>

            <p>
              Administrá los torneos que creaste
              o a los que fuiste invitado.
            </p>
          </div>

          <button
            className="primary-button create-tournament-button"
            type="button"
          >
            + Crear torneo
          </button>
        </section>

        <section className="empty-state">
          <div className="empty-icon">
            🏐
          </div>

          <h2>Todavía no tenés torneos</h2>

          <p>
            Creá tu primer torneo o aceptá una
            invitación para comenzar.
          </p>

          <button
            className="primary-button"
            type="button"
          >
            Crear mi primer torneo
          </button>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage