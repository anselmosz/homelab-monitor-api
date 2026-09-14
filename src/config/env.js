import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  return value;
}

export const config = {
  port: process.env.PORT || 3000,
  storagePath: required('STORAGE_PATH'),
  nodeEnv: env,
};