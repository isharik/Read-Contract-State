import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const endpoint = process.env.PHAROS_MCP_URL || 'https://mcp.pharos.xyz/mcp';
const port = Number(process.env.PORT || 5173);
const isDev = process.argv.includes('--dev');
const vite = isDev ? await (await import('vite')).createServer({ server: { middlewareMode: true }, appType: 'spa' }) : null;
let clientPromise;

async function getClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      const client = new Client({ name: 'pharos-read-state', version: '1.0.0' });
      await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
      return client;
    })().catch((error) => { clientPromise = null; throw error; });
  }
  return clientPromise;
}

const toolFor = {
  eth_chainId: () => ['get_chain_info', {}, ({ chainIdHex }) => chainIdHex],
  eth_blockNumber: () => ['get_block_number', {}, ({ blockNumberHex, latestBlockHex, blockNumber }) => blockNumberHex || latestBlockHex || `0x${Number(blockNumber).toString(16)}`],
  eth_getBlockByNumber: ([block, includeTransactions]) => ['get_block', { block, includeTransactions }, (value) => value],
  eth_getCode: ([address, block]) => ['get_code', { address, block }, ({ code }) => code],
  eth_getBalance: ([address, block]) => ['get_balance', { address, block }, ({ balanceWei, balanceHex, result }) => balanceHex || result || `0x${BigInt(balanceWei).toString(16)}`],
  eth_getStorageAt: ([address, position, block]) => ['get_storage_at', { address, position, block }, ({ value }) => value],
  eth_call: ([transaction, block]) => ['eth_call', { transaction, block }, ({ result }) => result]
};

async function readThroughMcp(method, params) {
  if (!Object.hasOwn(toolFor, method) || !Array.isArray(params)) throw new Error('Unsupported read method');
  const [name, args, extract] = toolFor[method](params);
  const result = await (await getClient()).callTool({ name, arguments: args });
  if (result.isError) throw new Error(result.content?.find((item) => item.type === 'text')?.text || `${name} failed`);
  const value = JSON.parse(result.content?.find((item) => item.type === 'text')?.text || '{}');
  const extracted = extract(value);
  if (extracted === undefined || extracted === null) throw new Error(`${name} returned no result`);
  return extracted;
}

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
      const { id, method, params } = JSON.parse(body);
      const result = await readThroughMcp(method, params);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end(JSON.stringify({ jsonrpc: '2.0', id, result }));
    } catch (error) {
      res.writeHead(502, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (vite) { vite.middlewares(req, res); return; }
  try {
    const requested = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^[/\\]+/, '');
    const path = join(process.cwd(), 'dist', requested || 'index.html');
    if (requested.split(/[\\/]/).includes('..')) throw new Error('Invalid path');
    const file = await readFile((await stat(path)).isDirectory() ? join(path, 'index.html') : path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }).end(file);
  } catch {
    try { res.writeHead(200, { 'Content-Type': 'text/html' }).end(await readFile('dist/index.html')); }
    catch { res.writeHead(404).end('Build the app first with npm run build'); }
  }
}).listen(port, () => console.log(`Pharos MCP reader listening on http://localhost:${port}`));
