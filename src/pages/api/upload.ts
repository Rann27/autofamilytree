import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { photo } = req.body as { photo?: string };

    if (!photo || !photo.startsWith('data:')) {
      return res.status(400).json({ error: 'No valid photo data' });
    }

    // Extract mime type and data
    const matches = photo.match(/^data:image\/(jpeg|png);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : 'png';
    const buffer = Buffer.from(matches[2], 'base64');

    const filename = `${uuidv4()}.${ext}`;
    const photosDir = path.join(process.cwd(), 'public', 'photos');

    if (!fs.existsSync(photosDir)) {
      fs.mkdirSync(photosDir, { recursive: true });
    }

    const filepath = path.join(photosDir, filename);
    fs.writeFileSync(filepath, buffer);

    return res.status(200).json({ path: `/photos/${filename}` });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload gagal' });
  }
}
