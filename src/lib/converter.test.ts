import { BigNumber } from '@ethersproject/bignumber';
import * as Contracts from '@ethersproject/contracts';
import sinon from 'sinon';

import { SupportedAsset } from './assets';
import { exchangeRate } from './converter';
import { Feed } from './priceFeeds';

const testFeedsA: readonly Feed[] = [
  {
    id: 0,
    from: 'AAVE',
    to: 'BTC',
    address: '0xAB',
    decimals: 8,
  },
  {
    id: 1,
    from: 'BTC',
    to: 'COMP',
    address: '0xBC',
    decimals: 8,
  },
  {
    id: 2,
    from: 'COMP',
    to: 'DAI',
    address: '0xCD',
    decimals: 8,
  },
  {
    id: 3,
    from: 'DAI',
    to: 'ETH',
    address: '0xDE',
    decimals: 18,
  },
  {
    id: 4,
    from: 'ETH',
    to: 'FIL',
    address: '0xEF',
    decimals: 18,
  },
];

describe('exchangeRate', () => {
  /**
   * Set answers to the following:
   *   A/B: 100
   *   B/C: 0.2
   *   C/D: 0.001
   *   D/E: 999_999_999_999_999_999
   *   E/F: 0.000_000_000_000_000_001
   */
  beforeEach(() => {
    const contractConstructorStub = sinon.stub();
    contractConstructorStub.withArgs('0xAB', sinon.match.any, sinon.match.any).returns({
      latestRoundData: () => ({
        answer: BigNumber.from(10_000_000_000),
      }),
    });

    contractConstructorStub.withArgs('0xBC', sinon.match.any, sinon.match.any).returns({
      latestRoundData: () => ({
        answer: BigNumber.from(20_000_000),
      }),
    });

    contractConstructorStub.withArgs('0xCD', sinon.match.any, sinon.match.any).returns({
      latestRoundData: () => ({
        answer: BigNumber.from(100_000),
      }),
    });

    contractConstructorStub.withArgs('0xDE', sinon.match.any, sinon.match.any).returns({
      latestRoundData: () => ({
        answer: BigNumber.from('999999999999999999000000000000000000'),
      }),
    });

    contractConstructorStub.withArgs('0xEF', sinon.match.any, sinon.match.any).returns({
      latestRoundData: () => ({
        answer: BigNumber.from(1),
      }),
    });

    sinon.replace(Contracts, 'Contract', contractConstructorStub as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when passed an unknown asset', () => {
    it('returns null', async () => {
      const provider = sinon.fake();

      const result = await exchangeRate(
        'Anything' as SupportedAsset,
        'Unknown' as SupportedAsset,
        provider as any,
        testFeedsA,
      );

      expect(result).toBe(null);
    });
  });

  describe('when passed assets without a complete path between them', () => {
    const disconnectedFeeds: readonly Feed[] = [
      {
        id: 0,
        from: 'AAVE',
        to: 'BTC',
        address: '0xAB',
        decimals: 8,
      },
      {
        id: 1,
        from: 'COMP',
        to: 'DAI',
        address: '0xBC',
        decimals: 8,
      },
    ];

    it('returns null', async () => {
      const provider = sinon.fake();

      const result = await exchangeRate('AAVE', 'DAI', provider as any, disconnectedFeeds);

      expect(result).toBe(null);
    });
  });

  describe('when passed assets with a path between them', () => {
    const testData: readonly (readonly [readonly [SupportedAsset, SupportedAsset], string])[] = [
      [['AAVE', 'AAVE'], '1'],
      [['AAVE', 'BTC'], '100'],
      [['AAVE', 'COMP'], '20'],
      [['AAVE', 'DAI'], '0.02'],
      [['DAI', 'AAVE'], '50'],
      [['COMP', 'DAI'], '0.001'],
      [['DAI', 'FIL'], '0.999999999999999999'],
    ];

    it.each(testData)('Correctly calculates the exchange rate', async ([from, to], expectedExchangeRate) => {
      const provider = sinon.fake();

      const result = await exchangeRate(from, to, provider as any, testFeedsA);

      expect(result).toBe(expectedExchangeRate);
    });
  });
});
