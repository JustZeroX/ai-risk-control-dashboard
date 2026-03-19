import { Violation, BannedAccount } from './types';

export const initialViolations: Violation[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `V-10${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
  user: { id: `U-00${i + 1}`, username: `user_${i + 1}`, phone: `138001380${i < 10 ? '0' + i : i}` },
  hitWord: i % 3 === 0 ? '暴力' : i % 3 === 1 ? '色情' : '政治敏感',
  prompt: `这是一个测试的违规Prompt，包含了不当的内容，编号 ${i + 1}。`,
  triggerTime: new Date(Date.now() - i * 3600000).toISOString(),
  hits24h: (i % 5) + 1,
  hits72h: (i % 5) + 3,
  hitsTotal: (i % 5) + 10,
  lastBanTime: i % 4 === 0 ? new Date(Date.now() - i * 86400000 - 86400000).toISOString() : undefined,
  history: [
    { id: `H-${i}-1`, time: new Date(Date.now() - i * 3600000).toISOString(), hitWord: '暴力', detail: `这是一个测试的违规Prompt，包含了不当的内容，编号 ${i + 1}。` }
  ]
}));

export const initialBannedAccounts: BannedAccount[] = Array.from({ length: 12 }).map((_, i) => {
  const now = Date.now();
  const banTime1 = new Date(now - i * 86400000 - 172800000).toISOString();
  const unbanTime1 = new Date(now - i * 86400000 - 86400000).toISOString();
  const banTime2 = new Date(now - i * 86400000).toISOString();

  return {
    id: `B-20${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
    user: { id: `U-10${i + 1}`, username: `banned_user_${i + 1}`, phone: `139001390${i < 10 ? '0' + i : i}` },
    totalHits: (i % 10) + 20,
    totalBans: 2,
    banTime: banTime2,
    history: [
      { 
        id: `BH-${i}-3`, 
        type: '封禁', 
        time: banTime2, 
        reason: i % 2 === 0 ? '管理员手动封禁' : '24h 违禁 10 次，系统自动封禁', 
        operator: i % 2 === 0 ? `admin_0${(i % 3) + 1}` : '系统' 
      },
      { 
        id: `BH-${i}-2`, 
        type: '解封', 
        time: unbanTime1, 
        reason: '管理员手动解封', 
        operator: `admin_0${(i % 3) + 1}` 
      },
      { 
        id: `BH-${i}-1`, 
        type: '封禁', 
        time: banTime1, 
        reason: '24h 违禁 10 次，系统自动封禁', 
        operator: '系统' 
      }
    ]
  };
});
