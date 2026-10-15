import React from 'react';
import { Shield, Smartphone, Monitor, UserCheck, RefreshCw, Layers } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  setCurrentUser: (user: UserAccount) => void;
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  totalCitizens: number;
  syncTime: string;
  onRefreshData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  setCurrentUser,
  deviceMode,
  setDeviceMode,
  totalCitizens,
  syncTime,
  onRefreshData,
}) => {
  return (
    <header className="bg-slate-900 border-b border-emerald-800/40 sticky top-0 z-40 shadow-xl backdrop-blur-md">
      {/* Top Banner - National / Military Banner */}
      <div className="bg-gradient-to-r from-red-800 via-amber-800 to-emerald-950 px-4 py-1.5 text-xs text-amber-200 border-b border-amber-600/30 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3 font-semibold tracking-wide uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            HỘI ĐỒNG NGHĨA VỤ QUÂN SỰ XÃ ĐẠI ĐỒNG
          </span>
          <span className="text-amber-400/50">|</span>
          <span className="text-amber-100">BAN CHỈ HUY QUÂN SỰ XÃ</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-600/50">
            NĂM TUYỂN QUÂN 2026
          </span>
          <span className="text-slate-300">
            Cơ sở dữ liệu: <strong className="text-amber-300">{totalCitizens}</strong> công dân
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Đồng bộ: {syncTime}
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* App Title & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-900 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-emerald-950/60 text-amber-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                MSMS <span className="text-xs font-normal text-emerald-400 px-1.5 py-0.5 bg-emerald-950/80 rounded border border-emerald-700/60">v2.6 Cấp Xã</span>
              </h1>
              <span className="text-xs text-amber-300 font-medium hidden md:inline">
                Sáng Kiến Cải Tiến Kỹ Thuật
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              Phần mềm thu thập bằng thiết bị thông minh, OCR & đối chiếu dữ liệu nguồn NVQS
            </p>
          </div>
        </div>

        {/* Controls: Device Mode, User Selector, Quick Sync */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Device Simulator Mode Switcher */}
          <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700 flex items-center gap-1 text-xs">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bàn Chỉ Huy (Màn hình máy tính rộng)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bàn Chỉ Huy</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Thiết bị Thông minh Cán bộ Thực địa (Điện thoại)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đầu Cuối Smartphone</span>
            </button>
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = allUsers.find((u) => u.id === e.target.value);
                if (found) setCurrentUser(found);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-slate-100">
                  {u.name} ({u.roleTitle})
                </option>
              ))}
            </select>
          </div>

          {/* Refresh / Sync Button */}
          <button
            onClick={onRefreshData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition"
            title="Đồng bộ dữ liệu"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Đồng bộ</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center border-t border-slate-800 text-xs sm:text-sm font-medium gap-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'dashboard'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Tổng Quan
        </button>

        <button
          onClick={() => setActiveTab('feature-catalog')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'feature-catalog'
              ? 'border-amber-500 text-amber-300 font-bold bg-amber-950/20'
              : 'border-transparent text-amber-400 hover:text-amber-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Đặc Tả 100 Tính Năng
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Mới
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mobile-ocr')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'mobile-ocr'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Quét OCR Smartphone
        </button>

        <button
          onClick={() => setActiveTab('registry')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'registry'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          6 Bảng Dữ Liệu
        </button>

        <button
          onClick={() => setActiveTab('registration-age17')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'registration-age17'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Đăng Ký Tuổi 17
        </button>

        <button
          onClick={() => setActiveTab('council-plan')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'council-plan'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Hội Đồng & Kế Hoạch
        </button>

        <button
          onClick={() => setActiveTab('cross-check')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'cross-check'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Đối Chiếu Liên Ngành
        </button>

        <button
          onClick={() => setActiveTab('classification')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'classification'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Phân Loại & Lệnh Khám
        </button>

        <button
          onClick={() => setActiveTab('violations')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'violations'
              ? 'border-rose-500 text-rose-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Xử Lý Vi Phạm
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Báo Cáo In Ấn
        </button>

        <button
          onClick={() => setActiveTab('legal-kb')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'legal-kb'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Kho Văn Bản Pháp Luật
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Bảo Mật
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'docs'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Thuyết Minh
        </button>
      </nav>
    </header>
  );
};
