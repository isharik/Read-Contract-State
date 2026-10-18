# Read Contract State

A browser-based contract reader built for Pharos Season of AI. It inspects public contract state and presents decoded values with their network and block context.

Video walkthrough: https://youtu.be/828hswMplqY

## Features

- Read contract metadata, total supply, balances, owner state, native balance, and raw storage slots.
- Inspect historical block offsets and ERC-20 allowance values.
- Refresh reads automatically and inspect raw JSON-RPC results.
- Support Pharos Atlantic, Pacific, and legacy testnet network settings.

## Run locally

```sh
npm install
npm run dev
```

## RPC and MCP

The browser app uses read-only EVM JSON-RPC requests against the selected Pharos endpoint. It checks `eth_chainId` before reading contract state and reports the block used for the snapshot. Browser access depends on the RPC provider allowing cross-origin requests (CORS).

This repository does not configure or call an MCP server. No verified Pharos MCP endpoint and contract-reader tool schema is configured here. Pharos AI / Chain MCP is a separate integration surface; this browser app uses EVM JSON-RPC and does not claim an MCP connection.

## Validation

```sh
npm run lint
npm run build
```

## Project context

This project was developed as part of the Pharos AI Agent Arena / Season of AI. The interface focuses on read-only inspection: it does not submit transactions or modify on-chain state.
