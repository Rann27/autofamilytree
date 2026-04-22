import type { NextApiRequest, NextApiResponse } from 'next';
import { readConfig, writeConfig } from '../../../lib/config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const config = readConfig();
    return res.status(200).json(config);
  }

  if (req.method === 'PUT') {
    const updated = writeConfig(req.body);
    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
