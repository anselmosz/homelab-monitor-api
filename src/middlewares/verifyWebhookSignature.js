import crypto from 'node:crypto';
import { config } from '../config/env.js';

export function verifyWebhookSignature(req, res, next) {
  const signatureHeader = req.headers['x-hub-signature-256'];

  if (!signatureHeader) {
    return res.status(401).json({error: 'Assinatura ausente'});
  }

  const expectedSignature = 'sha256=' + crypto.createHmac('sha256', config.webhookSecret).update(req.rawBody).digest('hex');

  const receivedBuffer = Buffer.from(signatureHeader, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (receivedBuffer.length !== expectedBuffer.length) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }
  
  const isValid = crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!isValid) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  next();
}