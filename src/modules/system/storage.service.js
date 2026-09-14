import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { calculatePercent, kbToGB } from '../../utils/unitConverter.js';
import { config } from '../../config/env.js';

if (!process.env.STORAGE_PATH) {
  throw new Error('STORAGE_PATH não definida no .env');
}

const execFileAsync = promisify(execFile);
const { storagePath } = config;

// ---------- Armazenamento ----------

async function readRawStorage() {
  /* execFile, não exec: evita interpretação por shell, então não há risco de 
  injeção de comando mesmo que o argumento venha a mudar no futuro */
  const { stdout } = await execFileAsync('df', ['-k', storagePath]);

  const lines = stdout.trim().split('\n');
  const dataLine = lines[1];
  const columns = dataLine.split(/\s+/);

  return {
    totalKB: parseInt(columns[1], 10),
    usedKB: parseInt(columns[2], 10),
    availableKB: parseInt(columns[3], 10)
  };
}

function formatStorage(raw) {
  return {
    totalGB: kbToGB(raw.totalKB),
    usedGB: kbToGB(raw.usedKB),
    availableGB: kbToGB(raw.availableKB),
    usedPercentage: calculatePercent(raw.usedKB, raw.totalKB)
  };
}

// Export dos métodos públicos do módulo storage
export default {
  getStorageStatus: async () => {
    const raw = await readRawStorage();
    return formatStorage(raw);
  },
}