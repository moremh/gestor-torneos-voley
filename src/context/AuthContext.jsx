import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../lib/firebase'
import { getUserProfile } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser)

        if (firebaseUser) {
          const userProfile = await getUserProfile(firebaseUser.uid)
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Error cargando perfil:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null)
      return
    }

    const userProfile = await getUserProfile(user.uid)
    setProfile(userProfile)
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      refreshProfile,
    }),
    [user, profile, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  }

  return context
}