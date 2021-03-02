import { SupportedAsset } from './assets';
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

const testData: readonly (readonly [readonly [SupportedAsset, SupportedAsset], Path])[] = [
  [['AAVE', 'BTC'], shortestPathFromAToB],
  [['AAVE', 'COMP'], shortestPathFromAToC],
  [['AAVE', 'DAI'], shortestPathFromAToD],
  [['DAI', 'AAVE'], shortestPathFromDToA],
  [['ETH', 'BTC'], shortestPathFromEToB],
];

describe('getShortestPath', () => {
  it.each(testData)('calculates the shortest path', ([start, end], expectedPath) => {
    expect(getShortestPath(start, end, testFeedsA)).toEqual(expectedPath);
  });
});
