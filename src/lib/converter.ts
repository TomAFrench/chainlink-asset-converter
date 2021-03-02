import { Provider } from '@ethersproject/providers';
import { BigNumber } from 'bignumber.js';

import { SupportedAsset } from './assets';
import { Feed, mainnetPriceFeeds } from './priceFeeds';
import { getLatestQuote } from './quotes';
import { getShortestPath, Path, PathSection } from './shortestPath';

type PathSectionQuote = {
  readonly inverse: boolean;
  readonly quote: BigNumber;
  readonly decimals: number;
};

/**
 *
 * @param path - path array linking two assets
 * @param feeds - array of feeds which contains the path of interest
 * @param provider - provider from which to query feed quotes
 */
const getPathQuotes = (
  path: Path,
  feeds: readonly Feed[],
  provider: Provider
): Promise<readonly PathSectionQuote[]> =>
  Promise.all(
    path.map(
      async (pathSection: PathSection): Promise<PathSectionQuote> => {
        const { feedId, inverse } = pathSection;
        const { address: feedAddress, decimals } = feeds.find(
          (feed: Feed) => feed.id === feedId
        );

        // Decorate the path section with the feed's current quote
        const { answer } = await getLatestQuote(feedAddress, provider);
        return {
          quote: answer,
          decimals,
          inverse,
        };
      }
    )
  );

/**
 * Calculate the exchange rate over a path of intermediate rates between two assets
 * @param pathQuotes - an array of quotes for each path section between two assets
 */
const calculateExchangeRate = (
  pathQuotes: readonly PathSectionQuote[]
): BigNumber =>
  pathQuotes.reduce(
    (_newAmount: BigNumber, pathSection: PathSectionQuote): BigNumber => {
      const { decimals, inverse, quote } = pathSection;

      const exchangeRate = new BigNumber(quote.toString()).dividedBy(
        new BigNumber(10).exponentiatedBy(decimals)
      );

      return inverse
        ? _newAmount.dividedBy(exchangeRate)
        : _newAmount.multipliedBy(exchangeRate);
    },
    new BigNumber('1')
  );

/**
 * Calculate the exchange rate between one asset and another.
 *
 * ### Example
 * ``` typescript
 * await exchangeRate(
 *  'ETH',
 *  'BTC',
 *  new JsonRpcProvider('https://mainnet.infura.io/v3/ab01ab01ab01ab01ab01ab01')
 * );
 * // => '0.2'
 * ```
 * @param from - the ticker symbol of the input asset
 * @param to - the ticker symbol of the output asset
 * @param provider - provider from which to query feed quotes
 * @param feeds - array of Chainlink price feeds to query (defaults to mainnet price feeds)
 * @returns {string | null} returns the exchange rate `from`:`to`, if this cannot be calculated then returns null
 */
export const exchangeRate = async (
  from: SupportedAsset,
  to: SupportedAsset,
  provider: Provider,
  feeds: readonly Feed[] = mainnetPriceFeeds
): Promise<string | null> => {
  if (from === to) return '1';

  const shortestPath: Path = getShortestPath(from, to, feeds);

  // Could not find a path between provided assets
  if (shortestPath.length === 0) return null;

  const pathQuotes = await getPathQuotes(shortestPath, feeds, provider);

  return calculateExchangeRate(pathQuotes).toString();
};
