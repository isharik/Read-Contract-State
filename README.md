# Read Contract State

A browser-based contract reader for Pharos Pacific Mainnet (chain ID 1672), built for Pharos Season of AI. It reads public contract state through the [official Pharos Chain MCP server](https://github.com/PharosNetwork/pharos-mcp) and presents decoded values with block context.

Video walkthrough: https://youtu.be/828hswMplqY

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

For a production server:

```sh
npm run build
npm start
```

For Vercel, deploy this repository with the Vite build command (`npm run build`) and `dist` as the output directory. The `api/read.js` function provides the `/api/read` route there. A static-only host such as GitHub Pages cannot run that function; use a Node host running `npm start` or a host that supports the included serverless route.

Set `PORT` to change the listening port. `PHAROS_MCP_URL` can point to a self-hosted compatible Pharos MCP server; it defaults to `https://mcp.pharos.xyz/mcp`.

## Data path

The browser sends read requests to the same-origin `/api/read` route. The Node server opens a Streamable HTTP MCP session and invokes the official server's `get_chain_info`, `get_block_number`, `get_block`, `get_code`, `get_balance`, `get_storage_at`, and `eth_call` tools. It does not send EVM JSON-RPC requests directly. The bridge checks the returned chain ID before contract reads; the hosted MCP server supports mainnet only.

The default contract is LINK at `0x51e2A24742Db77604B881d6781Ee16B5b8fcBE29`. Users can enter another mainnet contract address, choose historical block offsets, inspect storage and allowances, and enable automatic refresh. Reads are public and read-only.

## Checks

```sh
npm run lint
npm run build
```
