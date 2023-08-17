import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  sessionTtl: process.env.SESSION_TTL,
  gitHubClientId: process.env.GITHUB_CLIENT_ID,
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  gitHubCallbackURL: process.env.GITHUB_CALLBACK_URL,
  secret: process.env.SECRET,
  enviroment: process.env.ENVIROMENT,
  gmailEmail: process.env.GMAIL_EMAIL,
  gmailApplicationPassword: process.env.GMAIL_APPLICATION_PASSWORD,
};
