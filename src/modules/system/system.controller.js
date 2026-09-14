import storageService from './storage.service.js';
import systemService from './system.service.js';

export default {
  showMemUsage: async (req, res) => {
    const memInfo = await systemService.getMemoryStatus();
    return res.status(200).json({memInfo});
  },
  
  showUptimeInfo: async (req, res) => {
    const uptimeInfo = await systemService.getUptimeInfo();
    return res.status(200).json({uptimeInfo});
  },

  showStorageUsage: async (req, res) => {
    const storageInfo = await storageService.getStorageStatus();
    return res.status(200).json({storageInfo});
  }
}