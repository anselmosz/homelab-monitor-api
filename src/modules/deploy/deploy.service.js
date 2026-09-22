import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { appendFile } from 'node:fs/promises';
import { config } from '../../config/env.js';

const execFileAsync = promisify(execFile);
const LOG_PATH = './deploy.log';

// ---------- Log ----------

async function logDeploy(message) {
  const timeStamp = new Date().toISOString();
  await appendFile(LOG_PATH, `[${timeStamp}] ${message}\n`);
}

// ---------- Ações reais ----------

async function pullLatestChanges() {
  const { stdout } = await execFileAsync('git', ['-C', config.repoPath, 'pull']);
  return stdout.trim();
}

async function restartService() {
  const { stdout } = await execFileAsync('pm2', ['restart', config.pm2AppName]);
  return stdout.trim();
}

// ---------- Orquestração ----------

export async function runDeploy() {
  if (config.deployDryRun) {
    await logDeploy('DRY-RUN: webhook recebido, nenhuma ação executada');
    return {
      dryRun: true,
      executed: false
    };
  }
  
  try {
    const pullResult = await pullLatestChanges();
    await logDeploy(`git pull executado: ${pullResult}`);

    const restartResult = await restartService();
    await logDeploy(`pm2 restart executado: ${restartResult}`);

    return {
      dryRun: false,
      executed: true
    };
  } catch (error) {
    await logDeploy(`ERRO no deploy: ${error.message}`);
    throw error;
  }
}