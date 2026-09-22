import { runDeploy } from "./deploy.service.js";

export async function handleWebhook(req, res) {
  try {
    const result = await runDeploy();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error: 'Falha ao processar deploy', details: error.message});
  }
}