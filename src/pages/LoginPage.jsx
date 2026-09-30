import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/authService'

const getFirebaseErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
      return 'El correo o la contraseña son incorrectos.'

    case 'auth/invalid-email':
      return 'El correo ingresado no es válido.'

    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intentá nuevamente más tarde.'

    default:
      return 'No se pudo iniciar sesión. Intentá nuevamente.'
  }
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!authLoading && user) {
    return <Navigate to="/" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Completá el correo y la contraseña.')
      return
    }

    try {
      setLoading(true)

      await loginUser(form)

      navigate('/', {
        replace: true,
      })
    } catch (error) {
      console.error(error)
      setError(getFirebaseErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <div className="volleyball-mark">🏐</div>

          <h1>Gestor de Torneos</h1>

          <p>
            Administrá tus torneos de vóley desde un solo lugar.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Correo electrónico

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nombre@correo.com"
              autoComplete="email"
            />
          </label>

          <label>
            Contraseña

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Ingresando...'
              : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/registro">
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage