import { readFile } from 'node:fs/promises';
import { kbToGB, calculatePercent } from '../../utils/unitConverter.js';

// ---------- Memória ----------
/* lê o arquivo dos processos de memória e retorna valores brutos */
async function readRawMemInfo() {
  const content = await readFile('/proc/meminfo', 'utf8');
  const lines = content.trim().split('\n');

  const raw = {};
  for (const line of lines) {
    const [key, rest] = line.split(':');
    const value = parseInt(rest.trim().split(' ')[0], 10);
    raw[key] = value;
  }
  return raw;
}

/* converte o resultaddo de KB para GB e calcula o percentual de memória usado */ 
function formatMemory(raw) {
  const totalKB = raw.MemTotal;
  const availableKB = raw.MemAvailable;
  const usedKB = totalKB - availableKB;

  return {
    totalGB: kbToGB(totalKB),
    usedGB: kbToGB(usedKB),
    availableGB: kbToGB(availableKB),
    usedPercentage: calculatePercent(usedKB, totalKB)
  }
}

// ---------- Uptime ----------
async function readRawUptime() {
  const content = await readFile('/proc/uptime', 'utf-8');
  const [uptimeSeconds] = content.trim().split(' ');
  return parseFloat(uptimeSeconds);
}

function formatUptime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return {
    available: true,
    totalSeconds: Math.floor(totalSeconds),
    formatted: `${days}d ${hours}h ${minutes}m`,
  };
}

function formatUptimeUnavailable(reason) {
  return {
    available: false,
    totalSeconds: null,
    formatted: null,
    reason,
  };
}

async function getUptimeSafe() {
  try {
    const raw = await readRawUptime();
    return formatUptime(raw);
  } catch (error) {
    if (error.code === 'EACCES') {
      return formatUptimeUnavailable('Acesso negado pelo sistema ao ler /proc/uptime — restrição comum em versões recentes do Android');
    }
    throw error; // qualquer outro erro (arquivo não existe, etc.) continua sendo um erro real
  }
}

// Export dos métodos públicos do módulo system
export default {
   getMemoryStatus: async () => {
    const raw = await readRawMemInfo();
    return formatMemory(raw);
  },

  getUptimeInfo: async () => {
    const raw = await getDeviceUptime();
    return formatUptime(raw);
  }
}