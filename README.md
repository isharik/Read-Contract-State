# Pharos Contract State Reader

A browser-based React app for inspecting EVM contract state on Pharos Atlantic, Pacific, and the legacy testnet. It uses read-only JSON-RPC calls and supports historical block offsets, token metadata and balances, owner checks, raw storage slots, allowance inspection, and automatic refresh.

## Run locally

```sh
npm install
npm run dev
```

## RPC and MCP

The reader sends standard JSON-RPC 2.0 requests directly to the configured Pharos RPC endpoint. Before reading contract data it calls `eth_chainId` and stops if the endpoint does not match the selected network. Browser access also depends on the RPC provider allowing cross-origin requests (CORS).

This app does not call an MCP server. No verified Pharos MCP endpoint and contract-reader tool schema is configured in this project. MCP is a separate tool protocol; an EVM JSON-RPC endpoint is the appropriate interface for these browser-based chain reads. The app reports JSON-RPC provenance and does not present an unverified MCP request as a successful connection.

## Available checks

```sh
npm run lint
npm run build
```
