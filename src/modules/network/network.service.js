import os from 'node:os';
import dns from 'node:dns/promises';

// ---------- IP local ----------

function readRawNetworkInterfaces() {
  return os.networkInterfaces();
}

function formatLocalIP(interfaces) {
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return {
          intrfaceName: name,
          address: iface.address
        }
      }
    }
  }
  return {
    interfaceName: null,
    address: null
  }
}

// ---------- Concectividade ----------

async function checkConnectiviy() {
  try {
    await dns.lookup('cloudflare.com');
    return true;
  } catch (error) {
    return false;
  }
}

// ---------- Exports públicos ----------
export default {
  getLocalIP: async () => {
    const raw = readRawNetworkInterfaces();
    return formatLocalIP(raw);
  },

  getConnectivityStatus: async () => {
    const isConnected = await checkConnectiviy();
    return {
      status: isConnected ? 'connected' : 'disconnected',
      connected: isConnected
    };
  },
}