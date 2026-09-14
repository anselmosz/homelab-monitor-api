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
async function getDeviceUptime() {
  try {
    const content = await readFile('/proc/uptime', 'utf-8');
    const [uptimeSeconds] = content.trim().split(' ');
    return { available: true, ...formatUptime(parseFloat(uptimeSeconds)) };
  } catch (error) {
    if (error.code === 'EACCES') {
      return { available: false, reason: 'Acesso restrito pelo sistema Android' };
    }
    throw error;
  }
}

function formatUptime(totalSeconds) { /* faz a conversão do tempo em segundos para dias, horas e minutos */
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return {
    totalSeconds: Math.floor(totalSeconds),
    formatted: `${days}d ${hours}h ${minutes}m`,
  };
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