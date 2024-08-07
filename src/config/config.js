import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.e2e" : ".env";
dotenv.config({ path: envFile });

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
};

export default config;
