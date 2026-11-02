import { handleRead } from '../mcp-reader.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(await handleRead(body));
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
