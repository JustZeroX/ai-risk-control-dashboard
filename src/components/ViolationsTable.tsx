import React from 'react';
import { Violation } from '../types';
import { formatDate, truncateText } from '../utils';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ViolationsTableProps {
  data: Violation[];
  onViewDetail: (violation: Violation) => void;
  onBan: (violation: Violation) => void;
}

export const ViolationsTable: React.FC<ViolationsTableProps> = ({ data, onViewDetail, onBan }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium">ID</th>
            <th className="px-6 py-4 font-medium">账号信息</th>
            <th className="px-6 py-4 font-medium">命中违禁词</th>
            <th className="px-6 py-4 font-medium">相关 Prompt</th>
            <th className="px-6 py-4 font-medium">触发时间</th>
            <th className="px-6 py-4 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">暂无违禁记录。</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.user.username}</div>
                  <div className="text-xs text-slate-500">{item.user.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="danger">{item.hitWord}</Badge>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={item.prompt}>
                  {truncateText(item.prompt, 40)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.triggerTime)}</td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => onViewDetail(item)}>详情</Button>
                  <Button variant="danger" size="sm" onClick={() => onBan(item)}>封禁</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
