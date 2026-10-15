import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, ShieldCheck, AlertCircle, Printer, 
  Download, Eye, CheckSquare, Square, FileText, Send
} from 'lucide-react';
import { CitizenRecord, MilitaryStatus, UserAccount } from '../types';

interface ClassificationDraftListProps {
  citizens: CitizenRecord[];
  onSelectCitizen: (citizen: CitizenRecord) => void;
  currentUser: UserAccount;
}

export const ClassificationDraftList: React.FC<ClassificationDraftListProps> = ({
  citizens,
  onSelectCitizen,
  currentUser,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<MilitaryStatus | 'ALL'>('DU_DIEU_KIEN');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCallingOrderModal, setShowCallingOrderModal] = useState(false);
  const [draftLocation, setDraftLocation] = useState('Trạm Y tế Xã Đại Đồng');
  const [draftDate, setDraftDate] = useState('2026-11-15 07:30');

  // Filter citizens by group
  const filteredCitizens = citizens.filter((c) => {
    if (selectedGroup === 'ALL') return true;
    if (selectedGroup === 'DU_DIEU_KIEN') return c.status === 'DU_DIEU_KIEN';
    if (selectedGroup === 'TAM_HOAN_HOC_VAN') return c.status.startsWith('TAM_HOAN');
    if (selectedGroup === 'MIEN_GOI') return c.status === 'MIEN_GOI';
    if (selectedGroup === 'CHUA_XAC_MINH') return c.status === 'CHUA_XAC_MINH' || c.hasDiscrepancy;
    return c.status === selectedGroup;
  });

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCitizens.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCitizens.map((c) => c.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Cơ Chế Phân Loại 5 Nhóm Nghiệp Vụ & Lập Danh Sách Gọi Khám NVQS
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Tự động phân nhóm công dân theo Luật Nghĩa vụ quân sự (Điều 41 về Tạm hoãn & Miễn).
            Hỗ trợ Hội đồng NVQS xã lập danh sách điều động khám sức khỏe, in Lệnh gọi và niêm yết công khai.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setShowCallingOrderModal(true)}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Lập Lệnh Gọi Khám ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* 5 Group Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* Group 1: Đủ điều kiện */}
        <button
          onClick={() => {
            setSelectedGroup('DU_DIEU_KIEN');
            setSelectedIds([]);
          }}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedGroup === 'DU_DIEU_KIEN'
              ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Nhóm I</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold mt-1 text-emerald-300">Đủ điều kiện gọi khám</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {citizens.filter((c) => c.status === 'DU_DIEU_KIEN').length} công dân sẵn sàng
          </div>
        </button>

        {/* Group 2: Tạm hoãn */}
        <button
          onClick={() => {
            setSelectedGroup('TAM_HOAN_HOC_VAN');
            setSelectedIds([]);
          }}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedGroup === 'TAM_HOAN_HOC_VAN'
              ? 'bg-amber-950/90 border-amber-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">Nhóm II</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold mt-1 text-amber-300">Tạm hoãn nhập ngũ</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {citizens.filter((c) => c.status.startsWith('TAM_HOAN')).length} công dân (ĐH/CĐ, SK, gia cảnh)
          </div>
        </button>

        {/* Group 3: Miễn gọi */}
        <button
          onClick={() => {
            setSelectedGroup('MIEN_GOI');
            setSelectedIds([]);
          }}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedGroup === 'MIEN_GOI'
              ? 'bg-sky-950/90 border-sky-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">Nhóm III</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold mt-1 text-sky-300">Miễn gọi nhập ngũ</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {citizens.filter((c) => c.status === 'MIEN_GOI').length} công dân (Con liệt sĩ, TB)
          </div>
        </button>

        {/* Group 4: Chưa xác minh / Có sai lệch */}
        <button
          onClick={() => {
            setSelectedGroup('CHUA_XAC_MINH');
            setSelectedIds([]);
          }}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedGroup === 'CHUA_XAC_MINH'
              ? 'bg-rose-950/90 border-rose-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Nhóm IV</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-sm font-bold mt-1 text-rose-300">Chờ xác minh / Sai lệch</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {citizens.filter((c) => c.status === 'CHUA_XAC_MINH' || c.hasDiscrepancy).length} công dân cần đối chiếu
          </div>
        </button>

        {/* All view */}
        <button
          onClick={() => {
            setSelectedGroup('ALL');
            setSelectedIds([]);
          }}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            selectedGroup === 'ALL'
              ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Toàn Bộ</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-sm font-bold mt-1 text-white">Toàn bộ danh sách</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {citizens.length} công dân trong độ tuổi
          </div>
        </button>
      </div>

      {/* Main Table for Current Group */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden">
        {/* Table Header Controls */}
        <div className="bg-slate-850 px-4 py-3 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-2 text-slate-300 hover:text-white font-medium"
            >
              {selectedIds.length > 0 && selectedIds.length === filteredCitizens.length ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Chọn tất cả ({filteredCitizens.length})</span>
            </button>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              Đã chọn: <strong className="text-emerald-400">{selectedIds.length}</strong> công dân
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>In Danh Sách Niêm Yết</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-400 border-b border-slate-700 font-semibold select-none">
                <th className="p-3 w-10 text-center"></th>
                <th className="p-3">Mã Hồ Sơ</th>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Ngày Sinh</th>
                <th className="p-3">Số CCCD</th>
                <th className="p-3">Thôn / TDP</th>
                <th className="p-3">Trình Độ Học Vấn</th>
                <th className="p-3">Sức Khỏe</th>
                <th className="p-3">Căn Cứ Pháp Lý & Lý Do Phân Loại</th>
                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCitizens.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-800/60 transition ${isSelected ? 'bg-emerald-950/20' : ''}`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(c.id)}
                        className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      {c.fullName}
                    </td>
                    <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                      {c.birthDate} ({c.age}t)
                    </td>
                    <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                      {c.cccd}
                    </td>
                    <td className="p-3 text-slate-300 whitespace-nowrap">
                      {c.hamlet}
                    </td>
                    <td className="p-3 text-slate-300 whitespace-nowrap">
                      <span className="font-semibold">{c.educationLevel}</span>
                      {c.major ? ` (${c.major})` : ''}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-semibold text-slate-200">
                        {c.healthGrade}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-sm">
                      <p className="text-[11px] leading-relaxed line-clamp-2">
                        {c.statusReason || 'Theo Luật Nghĩa vụ quân sự 2015'}
                      </p>
                      {c.statusApprovedBy && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Duyệt bởi: {c.statusApprovedBy} ({c.statusApprovedDate})
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectCitizen(c)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Calling Order Modal (Lệnh gọi khám sức khỏe NVQS) */}
      {showCallingOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-emerald-700/60 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Lệnh Điều Động Khám Sức Khỏe Nghĩa Vụ Quân Sự Năm 2026
              </h3>
              <button
                onClick={() => setShowCallingOrderModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Official Military Document Template */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 text-xs font-serif leading-relaxed text-slate-200">
              <div className="text-center space-y-1">
                <div className="font-bold text-slate-400 uppercase tracking-widest text-[11px]">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="font-semibold text-slate-300 text-[10px]">
                  Độc lập - Tự do - Hạnh phúc
                </div>
                <div className="w-24 h-[1px] bg-slate-700 mx-auto my-1"></div>
                <div className="font-bold text-amber-300 text-sm mt-3 uppercase tracking-wide">
                  LỆNH GỌI KHÁM SỨC KHỎE NGHĨA VỤ QUÂN SỰ
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Số: 142/L-CHQS - Năm tuyển quân 2026
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p>
                  <strong>CHỈ HUY TRƯỞNG BAN CHỈ HUY QUÂN SỰ XÃ ĐẠI ĐỒNG</strong>
                </p>
                <p>
                  - Căn cứ Luật Nghĩa vụ quân sự ngày 19 tháng 6 năm 2015;
                </p>
                <p>
                  - Căn cứ Kế hoạch tuyển chọn và gọi công dân nhập ngũ năm 2026 của Hội đồng Nghĩa vụ quân sự;
                </p>
                <p>
                  <strong>ĐIỀU ĐỘNG:</strong> <strong>{selectedIds.length}</strong> công dân có tên trong danh sách đính kèm.
                </p>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 font-sans text-xs">
                  <div>
                    <span className="text-slate-400">Thời gian có mặt:</span>{' '}
                    <input
                      type="text"
                      value={draftDate}
                      onChange={(e) => setDraftDate(e.target.value)}
                      className="bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-white font-mono ml-1"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400">Địa điểm khám:</span>{' '}
                    <input
                      type="text"
                      value={draftLocation}
                      onChange={(e) => setDraftLocation(e.target.value)}
                      className="bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-white ml-1 w-72"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-end">
                  <div className="text-[10px] text-slate-500">
                    Nơi nhận:<br />
                    - Ban CHQS Huyện (b/c);<br />
                    - UBND xã Đại Đồng;<br />
                    - Công dân thực hiện;<br />
                    - Lưu: VT, QS.
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-[11px] font-semibold text-slate-300">
                      CHỈ HUY TRƯỞNG
                    </div>
                    <div className="text-[10px] text-slate-500 italic">(Ký, ghi rõ họ tên và đóng dấu)</div>
                    <div className="pt-8 font-bold text-slate-200">
                      {currentUser.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCallingOrderModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowCallingOrderModal(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Lệnh Gọi Chính Thức</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
