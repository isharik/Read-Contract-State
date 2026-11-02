import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const endpoint = process.env.PHAROS_MCP_URL || 'https://mcp.pharos.xyz/mcp';
let clientPromise;

async function getClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      const client = new Client({ name: 'pharos-read-state', version: '1.0.0' });
      await Promise.race([
        client.connect(new StreamableHTTPClientTransport(new URL(endpoint))),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Chain MCP connection timed out')), 15000))
      ]);
      return client;
    })().catch((error) => { clientPromise = null; throw error; });
  }
  return clientPromise;
}

const toolFor = {
  eth_chainId: () => ['get_chain_info', {}, ({ chainIdHex }) => chainIdHex],
  eth_blockNumber: () => ['get_block_number', {}, ({ blockNumberHex }) => blockNumberHex],
  eth_getBlockByNumber: ([block, includeTransactions]) => ['get_block', { block, includeTransactions }, (value) => value],
  eth_getCode: ([address, block]) => ['get_code', { address, block }, ({ code }) => code],
  eth_getBalance: ([address, block]) => ['get_balance', { address, block }, ({ balanceHex }) => balanceHex],
  eth_getStorageAt: ([address, position, block]) => ['get_storage_at', { address, position, block }, ({ value }) => value],
  eth_call: ([transaction, block]) => ['eth_call', { transaction, block }, ({ result }) => result]
};

export async function readThroughMcp(method, params) {
  if (!Object.hasOwn(toolFor, method) || !Array.isArray(params)) throw new Error('Unsupported read method');
  const [name, args, extract] = toolFor[method](params);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await (await getClient()).callTool({ name, arguments: args }, undefined, { timeout: 15000 });
      if (result.isError) throw new Error(result.content?.find((item) => item.type === 'text')?.text || `${name} failed`);
      const value = JSON.parse(result.content?.find((item) => item.type === 'text')?.text || '{}');
      const extracted = extract(value);
      if (extracted === undefined || extracted === null) throw new Error(`${name} returned no result`);
      return extracted;
    } catch (error) {
      if (attempt === 1 || !/session|connection|transport/i.test(error.message)) throw error;
      clientPromise = null;
    }
  }
}

export async function handleRead(body) {
  const { id, method, params } = body;
  if (!Number.isSafeInteger(id)) throw new Error('Invalid request ID');
  return { jsonrpc: '2.0', id, result: await readThroughMcp(method, params) };
}
