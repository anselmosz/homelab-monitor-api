import servicesStatusService from "./services-status.service.js";

export async function getSshStatus(req, res) {
  try {
    const status = await servicesStatusService.getSshStatus();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({error: 'Erro ao verificar status do SSH', details: error.message});
  }
}