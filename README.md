# Built for Pharos Season of AI


# Read Contract State

A lightweight on-chain agent built for **Pharos Season of AI** that reads live smart contract data through **Pharos Chain MCP** and transforms raw blockchain values into clear, human-readable information.


## Video Walkthrough for getting started

https://youtu.be/828hswMplqY

## Overview

Smart contracts store valuable on-chain information, but accessing it often requires technical knowledge, contract ABIs, and manual function calls.

**Read Contract State** simplifies this process by using Pharos Chain MCP to retrieve public contract state and present it in a structured, understandable format.

The goal is simple: make smart contract data accessible without requiring users to manually decode raw blockchain responses.

## Key Features

- **Live Contract Reads:** Retrieves real-time state from deployed Pharos smart contracts using Chain MCP.
- **Multiple State Values:** Reads contract properties such as token name, total supply, ownership, and balances.
- **Human-Readable Formatting:** Converts raw blockchain values into readable numbers and applies token decimals where relevant.
- **Block-Level Transparency:** Includes the contract address and block number associated with each read.
- **Address Labelling:** Clearly identifies contract and wallet addresses.
- **Structured Results:** Organizes retrieved data into an easy-to-understand summary.

## How It Works

1. **Connect:** Access the Pharos blockchain through Chain MCP.
2. **Identify:** Select a publicly deployed smart contract.
3. **Read:** Retrieve at least three different state values using contract view functions.
4. **Process:** Format raw values, apply token decimals, and label addresses.
5. **Present:** Display the results alongside the contract address and block number.

## Technology

| Component | Technology |
|---|---|
| Blockchain | Pharos Network |
| On-chain Data | Pharos Chain MCP |
| Contract Interaction | Smart Contract View Calls |
| Data Processing | State Retrieval & Formatting |
| Output | Human-Readable Contract Summary |

## Getting Started

### 1. Access Pharos AI

Visit [Pharos AI](https://ai.pharos.xyz/) and connect to the available Chain MCP tools.

### 2. Select a Contract

Choose a publicly deployed smart contract on Pharos, such as an ERC-20 token, vault, or registry.

### 3. Read Contract State

Use Chain MCP to retrieve at least three supported state values from the selected contract.

### 4. Review the Results

The agent processes the returned values and displays a readable summary with the relevant contract and block information.

## Example Output

The following illustrates the output structure:

```text
READ CONTRACT STATE
─────────────────────────────────
Network: Pharos
Contract: 0x...
Block: <block number>

CONTRACT INFORMATION
─────────────────────────────────
Token Name: <token name>
Token Symbol: <symbol>
Total Supply: <formatted supply>
Owner: <owner address>

DATA SOURCE
─────────────────────────────────
Pharos Chain MCP
Status: Read Completed
```

## Use Cases

- **Token Research:** Inspect token metadata, supply, and balances.
- **Contract Monitoring:** Retrieve public contract state without manually decoding responses.
- **On-chain Analytics:** Convert contract values into readable information for analysis.
- **Developer Debugging:** Quickly inspect deployed contract properties.
- **Blockchain Accessibility:** Make technical on-chain data easier for non-developers to understand.

## Design Principles

**Read-only by design.** The agent focuses on retrieving public contract state rather than executing transactions.

**Transparency.** Results include on-chain context so users can identify where the information originated.

**Clarity.** Raw blockchain values are formatted for readability without changing their underlying meaning.

**Simplicity.** The workflow prioritizes straightforward contract inspection over unnecessary complexity.

## Built for Pharos Season of AI

Developed as part of the **Pharos AI Agent Arena**, demonstrating how Chain MCP can bridge the gap between low-level blockchain data and accessible, human-readable insights.

**Explore Pharos AI:** https://ai.pharos.xyz/

---

**Read the contract. Understand the state. No decoding required.**
