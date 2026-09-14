import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

// ---------- Verificação genérica de processo ----------

async function checkProcessRunning(processName) {
  try {
    await execFileAsync('pgrep', ['-x', processName]);
    return true; // Se o código de saída for 0 o processo foi encontrado
  } catch (error) {
    if (error.code === 1) {
      return false; // Se o código de saída for 1 o processo não foi encontrado, mas o resultado é válido
    }
    throw error; // Qualquer outro código é um erro real, e não deve ser ignorado
  }

}

// Formatação de resultados
function formatServiceStatus(name, isRunning) {
  return {
    name,
    status: isRunning ? 'online': 'offline',
    online: isRunning
  };
}

export default {
  getSshStatus: async () => {
    const isRunning = await checkProcessRunning('sshd');
    return formatServiceStatus('SSH', isRunning);
  },
}