export type Token = {
  rank: number;
  ticker: string;
  name: string;
  creator: string;
  marketCap: string;
  volume: string;
  change: string;
  positive?: boolean;
  art: string;
};

export const tokens: Token[] = [];

export const creators = [
  { handle: 'kaicenat', name: 'Kai Cenat', followers: '13.2M', fees: '$1,284.22', initials: 'KC' },
  { handle: 'lunalive', name: 'Luna Live', followers: '5.4M', fees: '$864.10', initials: 'LL' },
  { handle: 'riftrunner', name: 'Rift Runner', followers: '3.1M', fees: '$612.44', initials: 'RR' },
  { handle: 'novastreams', name: 'Nova Streams', followers: '2.6M', fees: '$498.08', initials: 'NS' },
  { handle: 'ggsquad', name: 'GG Squad', followers: '1.9M', fees: '$341.20', initials: 'GG' },
];

export const receipts = [
  { id: 'TW-000351', handle: '@kaicenat', amount: '$42.80', time: '2 min ago', lifetime: '$1,284.22' },
  { id: 'TW-000350', handle: '@lunalive', amount: '$28.10', time: '7 min ago', lifetime: '$864.10' },
  { id: 'TW-000349', handle: '@riftrunner', amount: '$21.42', time: '15 min ago', lifetime: '$612.44' },
  { id: 'TW-000348', handle: '@novastreams', amount: '$18.70', time: '24 min ago', lifetime: '$498.08' },
  { id: 'TW-000347', handle: '@ggsquad', amount: '$12.20', time: '31 min ago', lifetime: '$341.20' },
  { id: 'TW-000346', handle: '@clipfarm', amount: '$9.80', time: '44 min ago', lifetime: '$292.14' },
];
