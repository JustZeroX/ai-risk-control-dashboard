import React from 'react';
import { BannedAccount } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatDate } from '../utils';

interface BannedAccountDetailModalProps {
  account: BannedAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onUnban: (account: BannedAccount) => void;
}

export const BannedAccountDetailModal: React.FC<BannedAccountDetailModalProps> = ({ account, isOpen, onClose, onUnban }) => {
  if (!account) return null;

  const renderDate = (dateString?: string) => {
    if (!dateString) return '无';
    return formatDate(dateString);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="封禁账号详情"
      maxWidth="max-w-4xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>关闭</Button>
          <Button variant="success" onClick={() => onUnban(account)}>解封该账号</Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">账号信息</div>
            <div className="text-xl font-bold text-slate-900">{account.user.username}</div>
            <div className="text-xs text-slate-500 mt-1">{account.user.phone}</div>
          </div>
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">总命中数</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{account.totalHits}</div>
          </div>
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">封禁次数</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{account.totalBans}</div>
          </div>
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">封禁时间</div>
            <div className="text-sm md:text-base font-bold text-slate-900 mt-1 tracking-tight" title={renderDate(account.banTime)}>
              {renderDate(account.banTime)}
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">历史封禁记录</h4>
          <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-medium">操作时间</th>
                  <th className="px-4 py-2.5 font-medium">操作类型</th>
                  <th className="px-4 py-2.5 font-medium">原因</th>
                  <th className="px-4 py-2.5 font-medium">操作人</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {account.history.map((h) => (
                  <tr key={h.id}>
                    <td className="px-4 py-2.5 whitespace-nowrap">{formatDate(h.time)}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={h.type === '封禁' ? 'danger' : 'success'}>{h.type}</Badge>
                    </td>
                    <td className="px-4 py-2.5">{h.reason}</td>
                    <td className="px-4 py-2.5">{h.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
