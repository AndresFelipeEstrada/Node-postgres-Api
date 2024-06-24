import { hash, compare } from "bcrypt"

export async function hashPassword(password) {
  try {
    return await hash(password, 10)
  } catch (e) {
    console.log('Error al hashear la password', e.messagge)
    throw new Error('Error interno del servidor')
  }
}

export async function verifyPassword(password, hash) {
  try {
    return await compare(password, hash)
  } catch (e) {
    console.log('Error al verificar la password', e.messagge)
    throw new Error('Error interno del servidor')
  }
}
