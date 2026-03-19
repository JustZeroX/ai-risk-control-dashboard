import React from 'react';
import { Violation } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatDate } from '../utils';

interface ViolationDetailModalProps {
  violation: Violation | null;
  isOpen: boolean;
  onClose: () => void;
  onBan: (violation: Violation) => void;
}

export const ViolationDetailModal: React.FC<ViolationDetailModalProps> = ({ violation, isOpen, onClose, onBan }) => {
  if (!violation) return null;

  const renderDate = (dateString?: string) => {
    if (!dateString) return '无';
    return formatDate(dateString);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="违禁详情"
      maxWidth="max-w-4xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>关闭</Button>
          <Button variant="danger" onClick={() => onBan(violation)}>封禁该账号</Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">账号信息</div>
            <div className="text-xl font-bold text-slate-900">{violation.user.username}</div>
            <div className="text-xs text-slate-500 mt-1">{violation.user.phone}</div>
          </div>
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">命中违禁词</div>
            <div className="mt-1">
              <Badge variant="danger">{violation.hitWord}</Badge>
            </div>
          </div>
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">命中次数 (24H / 72H / 总计)</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{violation.hits24h} / {violation.hits72h} / {violation.hitsTotal}</div>
          </div>
          <div className="rounded-xl border-2 border-slate-100 p-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">最近封禁时间</div>
            <div className="text-sm md:text-base font-bold text-slate-900 mt-1 tracking-tight" title={renderDate(violation.lastBanTime)}>
              {renderDate(violation.lastBanTime)}
            </div>
          </div>
        </div>

        {/* Prompt */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">完整 Prompt</h4>
          <div className="rounded-lg bg-slate-50/50 p-3 text-sm text-slate-700 whitespace-pre-wrap font-mono border border-slate-100 shadow-sm">
            {violation.prompt}
          </div>
        </div>

        {/* History */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">历史违禁记录</h4>
          <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-medium">时间</th>
                  <th className="px-4 py-2.5 font-medium">命中词</th>
                  <th className="px-4 py-2.5 font-medium">详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {violation.history.map((h) => (
                  <tr key={h.id}>
                    <td className="px-4 py-2.5 whitespace-nowrap">{formatDate(h.time)}</td>
                    <td className="px-4 py-2.5"><Badge variant="warning">{h.hitWord}</Badge></td>
                    <td className="px-4 py-2.5">{h.detail}</td>
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
