/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ShieldAlert, Search, ShieldCheck } from 'lucide-react';
import { initialViolations, initialBannedAccounts } from './data';
import { Violation, BannedAccount } from './types';
import { ViolationsTable } from './components/ViolationsTable';
import { BannedAccountsTable } from './components/BannedAccountsTable';
import { ViolationDetailModal } from './components/ViolationDetailModal';
import { BannedAccountDetailModal } from './components/BannedAccountDetailModal';
import { PRDModal } from './components/PRDModal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { Pagination } from './components/ui/Pagination';

type TabType = 'violations' | 'banned';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('violations');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [violations, setViolations] = useState<Violation[]>(initialViolations);
  const [bannedAccounts, setBannedAccounts] = useState<BannedAccount[]>(initialBannedAccounts);

  // Modals state
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [selectedBannedAccount, setSelectedBannedAccount] = useState<BannedAccount | null>(null);

  // Confirm Dialogs state
  const [banConfirmOpen, setBanConfirmOpen] = useState(false);
  const [violationToBan, setViolationToBan] = useState<Violation | null>(null);
  
  const [unbanConfirmOpen, setUnbanConfirmOpen] = useState(false);
  const [accountToUnban, setAccountToUnban] = useState<BannedAccount | null>(null);

  // PRD Modal state
  const [prdModalOpen, setPrdModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page on tab or search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Filtering
  const filteredViolations = useMemo(() => {
    return violations.filter(v => 
      v.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.user.phone.includes(searchQuery)
    );
  }, [violations, searchQuery]);

  const filteredBannedAccounts = useMemo(() => {
    return bannedAccounts.filter(b => 
      b.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.user.phone.includes(searchQuery)
    );
  }, [bannedAccounts, searchQuery]);

  // Pagination
  const paginatedViolations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredViolations.slice(start, start + itemsPerPage);
  }, [filteredViolations, currentPage]);

  const paginatedBannedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBannedAccounts.slice(start, start + itemsPerPage);
  }, [filteredBannedAccounts, currentPage]);

  // Handlers
  const handleBanClick = (violation: Violation) => {
    setViolationToBan(violation);
    setBanConfirmOpen(true);
  };

  const executeBan = () => {
    if (!violationToBan) return;
    
    // Remove from violations
    setViolations(prev => prev.filter(v => v.id !== violationToBan.id));
    
    // Add to banned accounts
    const newBannedAccount: BannedAccount = {
      id: `B-${Date.now()}`,
      user: violationToBan.user,
      totalHits: violationToBan.hitsTotal,
      totalBans: 1, // Simplified for mock
      banTime: new Date().toISOString(),
      history: [
        {
          id: `BH-${Date.now()}`,
          type: '封禁',
          time: new Date().toISOString(),
          reason: `管理员手动封禁（命中违禁词：${violationToBan.hitWord}）`,
          operator: '当前管理员'
        }
      ]
    };
    setBannedAccounts(prev => [newBannedAccount, ...prev]);
    
    // Close modals
    setSelectedViolation(null);
    setViolationToBan(null);
  };

  const handleUnbanClick = (account: BannedAccount) => {
    setAccountToUnban(account);
    setUnbanConfirmOpen(true);
  };

  const executeUnban = () => {
    if (!accountToUnban) return;
    
    // Remove from banned accounts
    setBannedAccounts(prev => prev.filter(b => b.id !== accountToUnban.id));
    
    // Close modals
    setSelectedBannedAccount(null);
    setAccountToUnban(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-end gap-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <ShieldAlert size={24} />
              <h1 className="text-xl font-bold tracking-tight leading-none">大模型风控后台</h1>
            </div>
            <button
              onClick={() => setPrdModalOpen(true)}
              className="text-sm text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer leading-none mb-[2px]"
            >
              查看需求文档.md
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">管理员</div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              管
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-200 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('violations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'violations' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'
              }`}
            >
              <ShieldAlert size={16} />
              违禁记录
              <span className="ml-1.5 inline-flex items-center justify-center bg-slate-100 text-slate-600 text-xs rounded-full px-2 py-0.5">
                {violations.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('banned')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'banned' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'
              }`}
            >
              <ShieldCheck size={16} />
              封禁账号
              <span className="ml-1.5 inline-flex items-center justify-center bg-slate-100 text-slate-600 text-xs rounded-full px-2 py-0.5">
                {bannedAccounts.length}
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="搜索用户名或手机号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'violations' ? (
            <div className="flex flex-col shadow-sm rounded-lg border border-slate-200 bg-white">
              <ViolationsTable 
                data={paginatedViolations} 
                onViewDetail={setSelectedViolation} 
                onBan={handleBanClick} 
              />
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(filteredViolations.length / itemsPerPage)} 
                onPageChange={setCurrentPage} 
              />
            </div>
          ) : (
            <div className="flex flex-col shadow-sm rounded-lg border border-slate-200 bg-white">
              <BannedAccountsTable 
                data={paginatedBannedAccounts} 
                onViewDetail={setSelectedBannedAccount} 
                onUnban={handleUnbanClick} 
              />
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(filteredBannedAccounts.length / itemsPerPage)} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ViolationDetailModal
        violation={selectedViolation}
        isOpen={!!selectedViolation}
        onClose={() => setSelectedViolation(null)}
        onBan={handleBanClick}
      />

      <BannedAccountDetailModal
        account={selectedBannedAccount}
        isOpen={!!selectedBannedAccount}
        onClose={() => setSelectedBannedAccount(null)}
        onUnban={handleUnbanClick}
      />

      <PRDModal
        isOpen={prdModalOpen}
        onClose={() => setPrdModalOpen(false)}
      />

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={banConfirmOpen}
        onClose={() => setBanConfirmOpen(false)}
        onConfirm={executeBan}
        title="封禁账号"
        message={`确定要封禁账号 ${violationToBan?.user.username} 吗？此操作将限制其访问权限。`}
        confirmText="确认封禁"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={unbanConfirmOpen}
        onClose={() => setUnbanConfirmOpen(false)}
        onConfirm={executeUnban}
        title="解封账号"
        message={`确定要解封账号 ${accountToUnban?.user.username} 吗？他们将恢复系统访问权限。`}
        confirmText="确认解封"
        variant="success"
      />
    </div>
  );
}
