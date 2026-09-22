import crypto from 'node:crypto';
import { config } from '../config/env.js';

export function verifyWebhookSignature(req, res, next) {
  const signatureHeader = req.headers['x-hub-signature-256'];

  if (!signatureHeader) {
    return res.status(401).json({error: 'Assinatura ausente'});
  }

  const expectedSignature = 'sha256=' + crypto.createHmac('sha256', config.webhookSecret).update(req.rawBody).digest('hex');

  const receivedBuffer = Buffer.from(signatureHeader);
  const expectedBuffer = Buffer.from(expectedSignature);

  const isValid = receivedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!isValid) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  next();
}