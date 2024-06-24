import boom from "@hapi/boom"
import config from "../config/config.js"

export function checkApiKey(req, _res, next) {
  const apiKey = req.headers['api']

  if (apiKey === config.apiKey) next()

  next(boom.unauthorized())
}

// export function checkAdminRole(req, res, next) {
//   const user = req.user
//
//   if (user.role === 'admin') {
//     return next()
//   }
//
//   next(boom.unauthorized())
// }

export function checkRoles(...roles) {
  return (req, _res, next) => {
    const user = req.user
    if (roles.includes(user.role)) {
      return next()
    } else {
      next(boom.unauthorized())
    }
  }
}

