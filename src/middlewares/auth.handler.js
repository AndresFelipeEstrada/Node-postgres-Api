import boom from "@hapi/boom";
import config from "../config/config.js";

export function checkApiKey(req, res, next) {
  const apiKey = req.headers["api"];

  if (apiKey === config.apiKey) {
    res.set("api", apiKey);
    return next();
  }

  next(boom.unauthorized());
}

export function checkRoles(...roles) {
  return (req, _res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      return next();
    } else {
      next(boom.unauthorized());
    }
  };
}
