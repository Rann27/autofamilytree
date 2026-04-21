import type { NextApiRequest, NextApiResponse } from 'next';
import { getMemberById, updateMember, deleteMember } from '../../../lib/members';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    const member = getMemberById(id);
    if (!member) return res.status(404).json({ error: 'Tidak ditemukan' });
    return res.status(200).json({ member });
  }

  if (req.method === 'PUT') {
    const updated = updateMember(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Tidak ditemukan' });
    return res.status(200).json({ member: updated });
  }

  if (req.method === 'DELETE') {
    const success = deleteMember(id);
    if (!success) return res.status(404).json({ error: 'Tidak ditemukan' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
