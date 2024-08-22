import boom from "@hapi/boom";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { hashPassword, verifyPassword } from "../libs/bcrypt.js";
import { signToken, verifyToken } from "../libs/token-sign.js";
import UserService from "./user.service.js";

const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      throw boom.unauthorized();
    }

    delete user.dataValues.recoveryToken;
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = { sub: user.id, role: user.role };
    const token = signToken(payload);

    return {
      user,
      token,
    };
  }

  async changePassword(token, newPassword) {
    const payload = verifyToken(token);
    const user = await service.findOne(payload.sub);

    if (!user || user.recoveryToken !== token) {
      throw boom.unauthorized();
    }

    const hash = await hashPassword(newPassword);
    await service.update(user.id, { recoveryToken: null, password: hash });
    return {
      message: "password changed",
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.id };

    const token = signToken(payload, "15min");
    await service.update(user.id, { recoveryToken: token });
    const link = `https://localhost:3000/recovery?token=${token}`;

    const mail = {
      from: `"Maddison Foo Koch 👻" <${config.email}>`,
      to: `${user.email}`,
      subject: "Email to recover password",
      html: `<b>Ingresa a este link: ${link}</b>`,
    };

    const rta = await this.sendMail(mail);
    return rta;
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.email,
        pass: config.emailPassword,
      },
    });
    await transporter.sendMail(infoMail);
    return { message: "email sent" };
  }
}

export default AuthService;
