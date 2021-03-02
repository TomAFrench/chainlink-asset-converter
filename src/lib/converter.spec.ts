import { BigNumber } from '@ethersproject/bignumber';
import * as Contracts from '@ethersproject/contracts';
import test from 'ava';
import sinon from 'sinon';

import { exchangeRate } from './converter';
import { Feed } from './priceFeeds';

const testFeedsA: readonly Feed[] = [
  {
    id: 0,
    from: 'A',
    to: 'B',
    address: '0xAB',
    decimals: 8,
  },
  {
    id: 1,
    from: 'B',
    to: 'C',
    address: '0xBC',
    decimals: 8,
  },
  {
    id: 2,
    from: 'C',
    to: 'D',
    address: '0xCD',
    decimals: 8,
  },
  {
    id: 3,
    from: 'D',
    to: 'E',
    address: '0xDE',
    decimals: 18,
  },
  {
    id: 4,
    from: 'E',
    to: 'F',
    address: '0xEF',
    decimals: 18,
  },
];

/**
 * Set answers to the following:
 *   A/B: 100
 *   B/C: 0.2
 *   C/D: 0.001
 *   D/E: 999_999_999_999_999_999
 *   E/F: 0.000_000_000_000_000_001
 */
test.before(() => {
  const contractConstructorStub = sinon.stub();
  contractConstructorStub
    .withArgs('0xAB', sinon.match.any, sinon.match.any)
    .returns({
      latestRoundData: () => ({
        answer: BigNumber.from(10_000_000_000),
      }),
    });

  contractConstructorStub
    .withArgs('0xBC', sinon.match.any, sinon.match.any)
    .returns({
      latestRoundData: () => ({
        answer: BigNumber.from(20_000_000),
      }),
    });

  contractConstructorStub
    .withArgs('0xCD', sinon.match.any, sinon.match.any)
    .returns({
      latestRoundData: () => ({
        answer: BigNumber.from(100_000),
      }),
    });

  contractConstructorStub
    .withArgs('0xDE', sinon.match.any, sinon.match.any)
    .returns({
      latestRoundData: () => ({
        answer: BigNumber.from('999999999999999999000000000000000000'),
      }),
    });

  contractConstructorStub
    .withArgs('0xEF', sinon.match.any, sinon.match.any)
    .returns({
      latestRoundData: () => ({
        answer: BigNumber.from(1),
      }),
    });

  sinon.replace(Contracts, 'Contract', contractConstructorStub);
});

test.after.always(() => {
  sinon.restore();
});

test('0Anything to 0Unknown', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate(
    'Anything',
    'Unknown',
    provider,
    testFeedsA
  );

  t.deepEqual(result, null);
});

test('A to A', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate('A', 'A', provider, testFeedsA);

  t.deepEqual(result, '1');
});

test('A to B', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate('A', 'B', provider, testFeedsA);

  t.deepEqual(result, '100');
});

test('A to C', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate('A', 'C', provider, testFeedsA);

  t.deepEqual(result, '20');
});

test('A to D', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate('A', 'D', provider, testFeedsA);

  t.deepEqual(result, '0.02');
});

test('D to A', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate('D', 'A', provider, testFeedsA);

  t.deepEqual(result, '50');
});

test('C to D', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate('C', 'D', provider, testFeedsA);

  t.deepEqual(result, '0.001');
});

test('D to F', async (t) => {
  const provider = sinon.fake();

  const result = await exchangeRate('D', 'F', provider, testFeedsA);

  t.deepEqual(result, '0.999999999999999999');
});
