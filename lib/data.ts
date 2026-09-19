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

export const tokens: Token[] = [
  { rank: 1, ticker: '$KAI', name: 'Kai Coin', creator: 'kaicenat', marketCap: '$28.6K', volume: '$334K', change: '+35.5%', positive: true, art: 'KC' },
  { rank: 2, ticker: '$LUNA', name: 'Luna Live', creator: 'lunalive', marketCap: '$19.4K', volume: '$181K', change: '+18.7%', positive: true, art: 'LL' },
  { rank: 3, ticker: '$CLIP', name: 'Clip Farm', creator: 'clipfarm', marketCap: '$16.8K', volume: '$128K', change: '-8.9%', art: 'CF' },
  { rank: 4, ticker: '$RIFT', name: 'Rift Run', creator: 'riftrunner', marketCap: '$14.3K', volume: '$111K', change: '+12.4%', positive: true, art: 'RR' },
  { rank: 5, ticker: '$NOVA', name: 'Nova Chat', creator: 'novastreams', marketCap: '$11.8K', volume: '$92K', change: '+6.1%', positive: true, art: 'NC' },
  { rank: 6, ticker: '$GGS', name: 'Good Games', creator: 'ggsquad', marketCap: '$10.9K', volume: '$88K', change: '-3.7%', art: 'GG' },
  { rank: 7, ticker: '$VIBE', name: 'Vibe Check', creator: 'vibecaster', marketCap: '$9.7K', volume: '$77K', change: '+21.3%', positive: true, art: 'VC' },
  { rank: 8, ticker: '$RAID', name: 'Raid Party', creator: 'raidparty', marketCap: '$8.9K', volume: '$65K', change: '+9.5%', positive: true, art: 'RP' },
];

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
