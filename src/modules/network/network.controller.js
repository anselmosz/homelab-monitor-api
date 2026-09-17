import networkService from "./network.service.js";

export async function getConnectionStatus(req, res) {
  const status = await networkService.getConnectivityStatus();
  res.status(200).json({status});
}
export async function getDeviceLocalIP(req, res) {
  const IP = await networkService.getLocalIP();
  res.status(200).json({IP});
}