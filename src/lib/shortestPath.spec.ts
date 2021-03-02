import test from 'ava';

import { Feed } from './priceFeeds';
import { getShortestPath, Path } from './shortestPath';

const testFeedsA: readonly Feed[] = [
  {
    id: 0,
    from: 'AAVE',
    to: 'BTC',
    address: '',
    decimals: 1,
  },
  {
    id: 1,
    from: 'BTC',
    to: 'COMP',
    address: '',
    decimals: 1,
  },
  {
    id: 2,
    from: 'COMP',
    to: 'DAI',
    address: '',
    decimals: 1,
  },
  {
    id: 3,
    from: 'DAI',
    to: 'ETH',
    address: '',
    decimals: 1,
  },
  {
    id: 4,
    from: 'ETH',
    to: 'FIL',
    address: '',
    decimals: 1,
  },
  {
    id: 5,
    from: 'BTC',
    to: 'FIL',
    address: '',
    decimals: 1,
  },
];

const shortestPathFromAToB: Path = [
  {
    feedId: 0,
    inverse: false,
  },
];

test('shortestPathAToB', (t) => {
  t.deepEqual(getShortestPath('AAVE', 'BTC', testFeedsA), shortestPathFromAToB);
});

const shortestPathFromAToC: Path = [
  {
    feedId: 0,
    inverse: false,
  },
  {
    feedId: 1,
    inverse: false,
  },
];

test('shortestPathAToC', (t) => {
  t.deepEqual(
    getShortestPath('AAVE', 'COMP', testFeedsA),
    shortestPathFromAToC
  );
});

const shortestPathFromAToD: Path = [
  {
    feedId: 0,
    inverse: false,
  },
  {
    feedId: 1,
    inverse: false,
  },
  {
    feedId: 2,
    inverse: false,
  },
];

test('shortestPathAToD', (t) => {
  t.deepEqual(getShortestPath('AAVE', 'DAI', testFeedsA), shortestPathFromAToD);
});

const shortestPathFromDToA: Path = [
  {
    feedId: 2,
    inverse: true,
  },
  {
    feedId: 1,
    inverse: true,
  },
  {
    feedId: 0,
    inverse: true,
  },
];

test('shortestPathDToA', (t) => {
  t.deepEqual(getShortestPath('DAI', 'AAVE', testFeedsA), shortestPathFromDToA);
});

const shortestPathFromEToB: Path = [
  {
    feedId: 4,
    inverse: false,
  },
  {
    feedId: 5,
    inverse: true,
  },
];

test('shortestPathEToB', (t) => {
  t.deepEqual(getShortestPath('ETH', 'BTC', testFeedsA), shortestPathFromEToB);
});
