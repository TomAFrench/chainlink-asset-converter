# chainlink-asset-converter

Easy conversion between any of the assets currently supported by [Chainlink's price feeds network](https://data.chain.link/)

## Installation

`yarn add @tomfrench/chainlink-asset-converter`

## Basic Usage

```typescript
import { exchangeRate } from '@tomfrench/chainlink-asset-converter';

// Your Ethereum JSON-RPC endpoint*
const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/ab01ab01ab01ab01ab01ab01')

const ethBtcRatio = await exchangeRate(
  'ETH',
  'BTC',
  provider,
);
```
