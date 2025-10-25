import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string | number;
  FRONTEND_URL: string;
  APP_URL: string;
  REFERRAL_CREDIT_AMOUNT: number;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  NODE_ENV: getEnvVariable("NODE_ENV", "development"),
  PORT: parseInt(getEnvVariable("PORT", "5000"), 10),
  MONGODB_URI: getEnvVariable("MONGODB_URI"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVariable("JWT_EXPIRES_IN", "7d"),
  FRONTEND_URL: getEnvVariable("FRONTEND_URL", "http://localhost:3000"),
  APP_URL: getEnvVariable("APP_URL", "http://localhost:5000"),
  REFERRAL_CREDIT_AMOUNT: parseInt(
    getEnvVariable("REFERRAL_CREDIT_AMOUNT", "2"),
    10
  ),
};