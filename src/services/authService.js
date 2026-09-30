import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { auth, db } from '../lib/firebase'

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const normalizedEmail = email.trim().toLowerCase()

  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  )

  const user = credential.user

  const fullName = `${firstName.trim()} ${lastName.trim()}`

  await updateProfile(user, {
    displayName: fullName,
  })

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    fullName,
    email: normalizedEmail,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return user
}

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase()

  const credential = await signInWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  )

  return credential.user
}

export const logoutUser = async () => {
  await signOut(auth)
}

export const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}