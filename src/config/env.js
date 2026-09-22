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
  nodeEnv: env,
  storagePath: required('STORAGE_PATH'),
  webhookSecret: required('WEBHOOK_SECRET'),
  repoPath: required('REPO_PATH'),
  pm2AppName: process.env.PM2_APP_NAME || 'homelab-monitor-api',
  deployDryRun: process.env.DEPLOY_DRY_RUN === 'true',
};