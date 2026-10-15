import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, UserCheck, Key, FileText, 
  EyeOff, HardDrive, CheckCircle2, AlertTriangle, Search
} from 'lucide-react';
import { AuditLogItem, UserAccount } from '../types';

interface SecurityAuditLogProps {
  auditLogs: AuditLogItem[];
  allUsers: UserAccount[];
  currentUser: UserAccount;
}

export const SecurityAuditLog: React.FC<SecurityAuditLogProps> = ({
  auditLogs,
  allUsers,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [maskDataEnabled, setMaskDataEnabled] = useState(true);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              An Toàn Thông Tin, Phân Quyền (RBAC) & Nhật Ký Kiểm Toán (Audit Trail)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Tuân thủ nghiêm ngặt quy định bảo vệ bí mật quân sự và dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.
            Không đưa dữ liệu mật lên đám mây cá nhân; ghi nhận đầy đủ nhật ký truy cập và sửa đổi.
          </p>
        </div>

        {/* Data Masking Switch */}
        <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700">
          <EyeOff className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300 font-medium">Che số CCCD/Bệnh án nhạy cảm:</span>
          <button
            onClick={() => setMaskDataEnabled(!maskDataEnabled)}
            className={`px-2.5 py-0.5 rounded text-xs font-bold transition ${
              maskDataEnabled
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {maskDataEnabled ? 'BẬT' : 'TẮT'}
          </button>
        </div>
      </div>

      {/* Security Pillars Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold">1. Mã Hóa Dữ Liệu</span>
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-white">AES-256 Bit & TLS 1.3</div>
          <p className="text-[11px] text-slate-400">
            Dữ liệu truyền từ Smartphone về hệ thống được mã hóa đầu cuối an toàn.
          </p>
        </div>

        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-xs font-semibold">2. Bảo Mật Thiết Bị Đầu Cuối</span>
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-white">Quy Trình Xóa Ảnh Thô</div>
          <p className="text-[11px] text-slate-400">
            Ảnh chụp CCCD tự động xóa khỏi bộ nhớ điện thoại sau khi đồng bộ thành công.
          </p>
        </div>

        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold">3. Phân Quyền Vai Trò (RBAC)</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-white">Định Danh Trách Nhiệm</div>
          <p className="text-[11px] text-slate-400">
            Mỗi cán bộ chỉ được cấp quyền trong phạm vi thẩm quyền được phân công.
          </p>
        </div>

        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold">4. Nhật Ký Bất Biến</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-sm font-bold text-white">Audit Trail 100%</div>
          <p className="text-[11px] text-slate-400">
            Ghi vết từng thao tác tra cứu, sửa đổi, xuất khẩu dữ liệu phục vụ thanh kiểm tra.
          </p>
        </div>
      </div>

      {/* Role Assignment Table */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Ma Trận Phân Quyền Khai Thác Dữ Liệu Nguồn Cấp Xã
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 font-semibold">
                <th className="p-3">Họ và Tên Cán Bộ</th>
                <th className="p-3">Chức Danh / Đơn Vị</th>
                <th className="p-3">Vai Trò Hệ Thống</th>
                <th className="p-3 text-center">Thu Thập & OCR</th>
                <th className="p-3 text-center">Đối Chiếu Dân Cư</th>
                <th className="p-3 text-center">Phê Duyệt Phân Loại</th>
                <th className="p-3 text-center">Xuất Báo Cáo / In Ấn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-white">{u.name}</td>
                  <td className="p-3 text-slate-300">{u.roleTitle} ({u.department})</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                      {u.badge}
                    </span>
                  </td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">
                    {u.department.includes('Công an') || u.canApprove ? '✓' : '-'}
                  </td>
                  <td className="p-3 text-center">
                    {u.canApprove ? (
                      <span className="text-emerald-400 font-bold">✓ Toàn quyền</span>
                    ) : (
                      <span className="text-slate-500">Chỉ đề xuất</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {u.canExport ? (
                      <span className="text-emerald-400 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-500">Bị giới hạn</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Nhật Ký Thao Tác Hệ Thống (Audit Trail Log)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Thời gian thực: Ghi nhận mọi hoạt động thêm, sửa, đối chiếu và xuất dữ liệu
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Lọc nhật ký..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 font-semibold">
                <th className="p-2.5">Thời Gian</th>
                <th className="p-2.5">Cán Bộ Thực Hiện</th>
                <th className="p-2.5">Hành Động</th>
                <th className="p-2.5">Đối Tượng</th>
                <th className="p-2.5">Nội Dung Chi Tiết</th>
                <th className="p-2.5">Địa Chỉ Máy Trạm (IP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-mono text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-2.5 font-semibold text-white whitespace-nowrap">
                    {log.userName}
                    <span className="block text-[10px] text-slate-500">{log.userRole}</span>
                  </td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px] border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-emerald-400 font-bold whitespace-nowrap">
                    {log.targetId}
                  </td>
                  <td className="p-2.5 text-slate-300 leading-relaxed">
                    {log.details}
                  </td>
                  <td className="p-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
