export const supportedAssets = [
  'USD',
  'ETH',
  'BTC',
  'LINK',
  'XAU',
  'SNX',
  'DAI',
  'COMP',
  'DASH',
  'AUD',
  'LTC',
  'GBP',
  'ETC',
  'BCH',
  'XRP',
  'EOS',
  'XAG',
  'KNC',
  'SDEFI',
  'FIL',
  'MCAP',
  'XMR',
  'BNT',
  'SXP',
  'TRX',
  'N225',
  'UNI',
  'XTZ',
  'DOT',
  'JPY',
  'EUR',
  'BNB',
  'OXT',
  'ADX',
  'YFI',
  'SCEX',
  'REN',
  'FNX',
  'BRENT',
  'AAVE',
  'FTSE',
  'CHF',
  'ADA',
  'USDC',
  'USDT',
  'SUSD',
  'TUSD',
  'ZRX',
  'BAT',
  'LRC',
  'MKR',
  'MANA',
  'BUSD',
  'REP',
  'ENJ',
  'CRV',
  'PAX',
  'XDR',
  'CRO',
  'DMG',
  'RCN',
  'BZRX',
  'WOM',
  'BAL',
  'BAND',
  'CEL',
  'COVER',
  'CREAM',
  'DPI',
  'FTT',
  'HEGIC',
  'KP3R',
  'MLN',
  'MTA',
  'NMR',
  'OMG',
  'RLC',
  'RUNE',
  'SRM',
  'SUSHI',
  'UMA',
  'USDK',
  'UST',
  'WNXM',
  'YFII',
  'ARS',
  'CNY',
  'IOST',
  'TSLA',
  'XHV',
  '1INCH',
  'ANT',
  'AMPL',
  'BADGER',
] as const;

export type SupportedAsset = typeof supportedAssets[number];
