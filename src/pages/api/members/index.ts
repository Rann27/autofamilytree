import type { NextApiRequest, NextApiResponse } from 'next';
import { readMembers, addMember, addChild, addSpouse } from '../../../lib/members';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const members = readMembers();
    return res.status(200).json({ members });
  }

  if (req.method === 'POST') {
    const { addType, name, nickname, photo, gender, birthYear, isAlive, fatherId, motherId, partnerId } = req.body;

    if (!name || !gender) {
      return res.status(400).json({ error: 'Nama dan jenis kelamin wajib diisi' });
    }

    const id = uuidv4();
    const baseMember = {
      id,
      name: name.trim(),
      nickname: nickname?.trim() || undefined,
      photo: photo || undefined,
      gender,
      birthYear: birthYear ? parseInt(birthYear) : undefined,
      isAlive: isAlive !== false,
    };

    let newMember;
    if (addType === 'punjer') {
      const existing = readMembers();
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Punjer sudah ada. Pohon keluarga sudah diinisialisasi.' });
      }
      newMember = addMember(baseMember);
    } else if (addType === 'spouse') {
      if (!partnerId) {
        return res.status(400).json({ error: 'Pasangan wajib dipilih' });
      }
      newMember = addSpouse(baseMember, partnerId);
    } else if (addType === 'child') {
      if (!fatherId && !motherId) {
        return res.status(400).json({ error: 'Minimal salah satu orang tua harus dipilih' });
      }
      newMember = addChild(baseMember, fatherId || undefined, motherId || undefined);
    } else {
      newMember = addMember(baseMember);
    }

    return res.status(201).json({ member: newMember });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
