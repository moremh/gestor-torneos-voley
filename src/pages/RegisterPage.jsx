import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/authService'

const getFirebaseErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo.'

    case 'auth/invalid-email':
      return 'El correo ingresado no es válido.'

    case 'auth/weak-password':
      return 'La contraseña es demasiado débil.'

    default:
      return 'No se pudo crear la cuenta. Intentá nuevamente.'
  }
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError('Completá todos los campos.')
      return
    }

    if (form.password.length < 6) {
      setError(
        'La contraseña debe tener al menos 6 caracteres.'
      )
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)

      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })

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

          <h1>Crear cuenta</h1>

          <p>
            Registrate para crear o administrar torneos.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <label>
              Nombre

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Nombre"
                autoComplete="given-name"
              />
            </label>

            <label>
              Apellido

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Apellido"
                autoComplete="family-name"
              />
            </label>
          </div>

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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirmar contraseña

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repetí la contraseña"
              autoComplete="new-password"
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
              ? 'Creando cuenta...'
              : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login">
            Iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage