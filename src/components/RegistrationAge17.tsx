import React, { useState } from 'react';
import { 
  UserCheck, Plus, Search, Filter, Download, FileText, 
  Printer, CheckCircle2, AlertTriangle, ArrowRight, X
} from 'lucide-react';
import { Age17RegistrationRecord, UserAccount } from '../types';
import { INITIAL_AGE17_REGISTRATIONS } from '../data/featureCatalog';

interface RegistrationAge17Props {
  currentUser: UserAccount;
}

export const RegistrationAge17: React.FC<RegistrationAge17Props> = ({
  currentUser,
}) => {
  const [registrations, setRegistrations] = useState<Age17RegistrationRecord[]>(INITIAL_AGE17_REGISTRATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecordForCert, setSelectedRecordForCert] = useState<Age17RegistrationRecord | null>(null);

  // New Form
  const [newFullName, setNewFullName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('2009-04-15');
  const [newCccd, setNewCccd] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newHamlet, setNewHamlet] = useState('Tổ dân phố 1');

  // Filter
  const filtered = registrations.filter((r) => {
    if (filterStatus !== 'ALL' && r.registrationStatus !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!r.fullName.toLowerCase().includes(term) && !r.cccd.includes(term) && !r.id.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newCccd) {
      alert('Vui lòng nhập Họ tên và Số CCCD!');
      return;
    }
    const newRecord: Age17RegistrationRecord = {
      id: `DK17-2026-${String(registrations.length + 1).padStart(3, '0')}`,
      fullName: newFullName.toUpperCase().trim(),
      birthDate: newBirthDate,
      cccd: newCccd,
      phone: newPhone || '0912000000',
      hamlet: newHamlet,
      registrationStatus: 'DA_DANG_KY',
      registrationDate: new Date().toISOString().substring(0, 10),
      certificateNumber: `CN-17/2026/${registrations.length + 1}`,
      note: 'Đã hoàn thành thủ tục đăng ký nghĩa vụ quân sự lần đầu tuổi 17',
    };
    setRegistrations([newRecord, ...registrations]);
    setShowAddModal(false);
    setNewFullName('');
    setNewCccd('');
    alert(`Đã hoàn thành đăng ký tuổi 17 cho công dân ${newRecord.fullName} & cấp Giấy chứng nhận ${newRecord.certificateNumber}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <UserCheck className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Quản Lý Đăng Ký Nghĩa Vụ Quân Sự Lần Đầu (Tuổi 17) & Chuyển Đăng Ký
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            (Nhóm IV - Tính năng 26 đến 35): Quản lý công dân nam đủ 17 tuổi trong năm (sinh năm 2009),
            cấp Giấy chứng nhận đăng ký NVQS, theo dõi công dân chưa đăng ký, miễn đăng ký, không được đăng ký và di chuyển nơi cư trú.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Ký Tuổi 17 Mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
          <span className="text-[11px] text-slate-400">Tổng nguồn nam tuổi 17:</span>
          <div className="text-2xl font-bold text-white mt-1">{registrations.length}</div>
          <span className="text-[10px] text-emerald-400">Sinh năm 2009</span>
        </div>
        <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
          <span className="text-[11px] text-emerald-400">Đã đăng ký & cấp CN:</span>
          <div className="text-2xl font-bold text-emerald-300 mt-1">
            {registrations.filter((r) => r.registrationStatus === 'DA_DANG_KY').length}
          </div>
          <span className="text-[10px] text-slate-400">Đạt 80% chỉ tiêu</span>
        </div>
        <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
          <span className="text-[11px] text-amber-400">Chưa đến đăng ký:</span>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {registrations.filter((r) => r.registrationStatus === 'CHUA_DANG_KY').length}
          </div>
          <span className="text-[10px] text-slate-400">Đang đôn đốc</span>
        </div>
        <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
          <span className="text-[11px] text-sky-400">Chuyển đến / Chuyển đi:</span>
          <div className="text-2xl font-bold text-sky-300 mt-1">
            {registrations.filter((r) => r.registrationStatus === 'CHUYEN_DEN' || r.registrationStatus === 'CHUYEN_DI').length}
          </div>
          <span className="text-[10px] text-slate-400">Cập nhật biến động</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Tên, CCCD tuổi 17..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Trạng thái:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DA_DANG_KY">Đã đăng ký</option>
            <option value="CHUA_DANG_KY">Chưa đăng ký</option>
            <option value="MIEN_DANG_KY">Miễn đăng ký</option>
            <option value="CHUYEN_DEN">Chuyển đến</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-300 border-b border-slate-700 font-semibold select-none">
                <th className="p-3">Mã Hồ Sơ</th>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Ngày Sinh (Năm 2009)</th>
                <th className="p-3">Số CCCD</th>
                <th className="p-3">Thôn / TDP</th>
                <th className="p-3">Trạng Thái Đăng Ký</th>
                <th className="p-3">Số Giấy Chứng Nhận</th>
                <th className="p-3">Ghi Chú Nghiệp Vụ</th>
                <th className="p-3 text-center">In Giấy CN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {r.id}
                  </td>
                  <td className="p-3 font-bold text-white whitespace-nowrap">
                    {r.fullName}
                  </td>
                  <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                    {r.birthDate}
                  </td>
                  <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                    {r.cccd}
                  </td>
                  <td className="p-3 text-slate-300 whitespace-nowrap">
                    {r.hamlet}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      r.registrationStatus === 'DA_DANG_KY'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : r.registrationStatus === 'CHUA_DANG_KY'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : r.registrationStatus === 'MIEN_DANG_KY'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-sky-950 text-sky-300 border border-sky-800'
                    }`}>
                      {r.registrationStatus}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-amber-300 font-semibold whitespace-nowrap">
                    {r.certificateNumber || '-'}
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">
                    {r.note || '-'}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {r.certificateNumber ? (
                      <button
                        onClick={() => setSelectedRecordForCert(r)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700 transition flex items-center gap-1 mx-auto"
                      >
                        <Printer className="w-3 h-3" />
                        <span>In CN</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Chưa cấp</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-sm font-bold text-white">Đăng Ký Nghĩa Vụ Quân Sự Lần Đầu (Tuổi 17)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Họ và tên công dân:</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value.toUpperCase())}
                  placeholder="NGUYỄN VĂN A"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Ngày sinh (Năm 2009):</label>
                  <input
                    type="date"
                    required
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Số CCCD (12 số):</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={newCccd}
                    onChange={(e) => setNewCccd(e.target.value)}
                    placeholder="001209xxxxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Thôn / TDP:</label>
                  <select
                    value={newHamlet}
                    onChange={(e) => setNewHamlet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Tổ dân phố 1">Tổ dân phố 1</option>
                    <option value="Tổ dân phố 2">Tổ dân phố 2</option>
                    <option value="Tổ dân phố 3">Tổ dân phố 3</option>
                    <option value="Thôn Thượng">Thôn Thượng</option>
                    <option value="Thôn Trung">Thôn Trung</option>
                    <option value="Thôn Hạ">Thôn Hạ</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Số điện thoại liên hệ:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0912xxxxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-lg shadow"
                >
                  Cấp Giấy Chứng Nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Print Preview Modal */}
      {selectedRecordForCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 text-xs font-serif leading-relaxed">
            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-semibold">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-[9px] text-slate-300 font-sans">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="w-20 h-[1px] bg-slate-700 mx-auto my-1"></div>
              <h3 className="text-base font-bold text-amber-300 uppercase font-sans mt-2">
                GIẤY CHỨNG NHẬN ĐĂNG KÝ NGHĨA VỤ QUÂN SỰ
              </h3>
              <div className="text-[10px] text-slate-400 font-mono">
                Số: {selectedRecordForCert.certificateNumber}
              </div>
            </div>

            <div className="space-y-2 py-2">
              <p>
                <strong>CHỈ HUY TRƯỞNG BAN CHỈ HUY QUÂN SỰ XÃ ĐẠI ĐỒNG</strong>
              </p>
              <p>
                Chứng nhận công dân: <strong className="text-white text-sm uppercase">{selectedRecordForCert.fullName}</strong>
              </p>
              <p>
                Sinh ngày: <span className="font-mono">{selectedRecordForCert.birthDate}</span> • Số CCCD: <span className="font-mono">{selectedRecordForCert.cccd}</span>
              </p>
              <p>
                Nơi cư trú: <strong>{selectedRecordForCert.hamlet}, Xã Đại Đồng</strong>
              </p>
              <p>
                ĐÃ ĐĂNG KÝ NGHĨA VỤ QUÂN SỰ LẦN ĐẦU (TUỔI 17) VÀO SỔ QUẢN LÝ QUÂN SỰ CỦA ĐỊA PHƯƠNG.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
              <div className="text-[10px] text-slate-500 font-sans">
                Đăng ký ngày: {selectedRecordForCert.registrationDate || '14/10/2026'}
              </div>
              <div className="text-center space-y-1 font-sans">
                <div className="text-[10px] font-semibold text-slate-300 uppercase">
                  CHỈ HUY TRƯỞNG
                </div>
                <div className="text-[9px] text-slate-500 italic">(Ký, đóng dấu)</div>
                <div className="pt-8 font-bold text-slate-200">
                  {currentUser.name}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 font-sans">
              <button
                onClick={() => setSelectedRecordForCert(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  setSelectedRecordForCert(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Giấy Chứng Nhận</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
