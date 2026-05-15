export const ARENA_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_ARENA_CONTRACT_ADDRESS as `0x${string}`) ??
  '0x0000000000000000000000000000000000000000';

export const ARENA_NFT_ADDRESS =
  (process.env.NEXT_PUBLIC_ARENA_NFT_ADDRESS as `0x${string}`) ??
  '0x0000000000000000000000000000000000000000';

export const BASE_ARENA_ABI = [
  {
    name: 'createTournament',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'asset', type: 'string' },
      { name: 'duration', type: 'uint256' },
      { name: 'entryFee', type: 'uint256' },
      { name: 'maxParticipants', type: 'uint256' },
    ],
    outputs: [{ name: 'tournamentId', type: 'uint256' }],
  },
  {
    name: 'enterTournament',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'tournamentId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'submitPrediction',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tournamentId', type: 'uint256' },
      { name: 'predictedPrice', type: 'uint256' },
      { name: 'direction', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'claimReward',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tournamentId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getTournament',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tournamentId', type: 'uint256' }],
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'asset', type: 'string' },
      { name: 'entryFee', type: 'uint256' },
      { name: 'prizePool', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'participantCount', type: 'uint256' },
      { name: 'maxParticipants', type: 'uint256' },
      { name: 'resolved', type: 'bool' },
    ],
  },
  {
    name: 'getTournamentCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'TournamentCreated',
    type: 'event',
    inputs: [
      { name: 'tournamentId', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'asset', type: 'string', indexed: false },
    ],
  },
] as const;

export const MOCK_TOURNAMENTS = [
  {
    id: 1,
    asset: 'ETH',
    creator: '0x1234...5678',
    entryFee: 0.01,
    prizePool: 2.5,
    endTime: Date.now() + 3600000 * 6,
    participantCount: 47,
    maxParticipants: 100,
    resolved: false,
    direction: 'UP' as const,
  },
  {
    id: 2,
    asset: 'BTC',
    creator: '0xabcd...ef01',
    entryFee: 0.005,
    prizePool: 1.2,
    endTime: Date.now() + 3600000 * 12,
    participantCount: 23,
    maxParticipants: 50,
    resolved: false,
    direction: 'DOWN' as const,
  },
  {
    id: 3,
    asset: 'ETH',
    creator: '0x9876...5432',
    entryFee: 0.025,
    prizePool: 5.0,
    endTime: Date.now() + 3600000 * 2,
    participantCount: 89,
    maxParticipants: 100,
    resolved: false,
    direction: 'UP' as const,
  },
  {
    id: 4,
    asset: 'cbBTC',
    creator: '0xfedc...ba98',
    entryFee: 0.015,
    prizePool: 3.8,
    endTime: Date.now() + 3600000 * 24,
    participantCount: 12,
    maxParticipants: 200,
    resolved: false,
    direction: 'UP' as const,
  },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, address: '0x4A3b...c2D1', username: 'CryptoKing', points: 12480, wins: 47, totalPnl: 18.4, badge: 'Diamond' },
  { rank: 2, address: '0x8B7c...a4F2', username: 'BaseWhale', points: 11230, wins: 41, totalPnl: 15.2, badge: 'Platinum' },
  { rank: 3, address: '0x2C9d...e3G8', username: 'ArenaGod', points: 9870, wins: 38, totalPnl: 12.8, badge: 'Gold' },
  { rank: 4, address: '0x6D5e...h7I9', username: 'PredictorX', points: 8540, wins: 31, totalPnl: 9.6, badge: 'Gold' },
  { rank: 5, address: '0x3E1f...j2K4', username: 'BluePill', points: 7210, wins: 28, totalPnl: 7.3, badge: 'Silver' },
  { rank: 6, address: '0x9F8g...m5N6', username: 'OnChainSage', points: 6890, wins: 25, totalPnl: 6.1, badge: 'Silver' },
  { rank: 7, address: '0x5G4h...p8Q7', username: 'BaseMaxi', points: 5670, wins: 22, totalPnl: 4.9, badge: 'Silver' },
  { rank: 8, address: '0x1H2i...s1T3', username: 'WavRider', points: 4320, wins: 18, totalPnl: 3.2, badge: 'Bronze' },
  { rank: 9, address: '0x7I6j...v4U2', username: 'DegenX', points: 3150, wins: 14, totalPnl: 2.1, badge: 'Bronze' },
  { rank: 10, address: '0x0J9k...y7W5', username: 'NewArena', points: 2480, wins: 11, totalPnl: 1.4, badge: 'Bronze' },
];
