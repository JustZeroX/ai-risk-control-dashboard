export interface User {
  id: string;
  username: string;
  phone: string;
}

export interface ViolationHistory {
  id: string;
  time: string;
  hitWord: string;
  detail: string;
}

export interface Violation {
  id: string;
  user: User;
  hitWord: string;
  prompt: string;
  triggerTime: string;
  hits24h: number;
  hits72h: number;
  hitsTotal: number;
  lastBanTime?: string;
  history: ViolationHistory[];
}

export interface BanHistory {
  id: string;
  type: '封禁' | '解封';
  time: string;
  reason: string;
  operator: string;
}

export interface BannedAccount {
  id: string;
  user: User;
  totalHits: number;
  totalBans: number;
  banTime: string;
  history: BanHistory[];
}
