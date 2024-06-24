import jwt from 'jsonwebtoken'
import config from '../config/config.js'


export const signToken = (payload, expiration = '10h') => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: expiration })
}

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret)
}
