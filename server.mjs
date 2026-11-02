import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { handleRead } from './mcp-reader.mjs';

const port = Number(process.env.PORT || 5173);
const isDev = process.argv.includes('--dev');
const vite = isDev ? await (await import('vite')).createServer({ server: { middlewareMode: true }, appType: 'spa' }) : null;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

createServer(async (req, res) => {
  if (req.url === '/api/read') {
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 8192) throw new Error('Request too large');
      }
      const result = await handleRead(JSON.parse(body));
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(502, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (vite) { vite.middlewares(req, res); return; }
  try {
    const requested = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^[/\\]+/, '');
    if (requested.split(/[\\/]/).includes('..')) throw new Error('Invalid path');
    const path = join(process.cwd(), 'dist', requested || 'index.html');
    const file = await readFile((await stat(path)).isDirectory() ? join(path, 'index.html') : path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }).end(file);
  } catch {
    try { res.writeHead(200, { 'Content-Type': 'text/html' }).end(await readFile('dist/index.html')); }
    catch { res.writeHead(404).end('Build the app first with npm run build'); }
  }
}).listen(port, () => console.log(`Pharos MCP reader listening on http://localhost:${port}`));
