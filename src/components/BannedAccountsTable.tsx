import React from 'react';
import { BannedAccount } from '../types';
import { formatDate } from '../utils';
import { Button } from './ui/Button';

interface BannedAccountsTableProps {
  data: BannedAccount[];
  onViewDetail: (account: BannedAccount) => void;
  onUnban: (account: BannedAccount) => void;
}

export const BannedAccountsTable: React.FC<BannedAccountsTableProps> = ({ data, onViewDetail, onUnban }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium">ID</th>
            <th className="px-6 py-4 font-medium">账号信息</th>
            <th className="px-6 py-4 font-medium">历史总命中数</th>
            <th className="px-6 py-4 font-medium">被封禁总次数</th>
            <th className="px-6 py-4 font-medium">封禁时间</th>
            <th className="px-6 py-4 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">暂无封禁账号。</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.user.username}</div>
                  <div className="text-xs text-slate-500">{item.user.phone}</div>
                </td>
                <td className="px-6 py-4">{item.totalHits}</td>
                <td className="px-6 py-4">{item.totalBans}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.banTime)}</td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => onViewDetail(item)}>详情</Button>
                  <Button variant="success" size="sm" onClick={() => onUnban(item)}>解封</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
