import React, { useState } from 'react';
import { 
  AlertOctagon, Scale, ShieldAlert, FileText, CheckCircle2, 
  Clock, AlertTriangle, Plus, Search, Eye, ArrowRight
} from 'lucide-react';
import { ViolationCase, UserAccount } from '../types';
import { INITIAL_VIOLATIONS } from '../data/featureCatalog';

interface ViolationsManagementProps {
  currentUser: UserAccount;
}

export const ViolationsManagement: React.FC<ViolationsManagementProps> = ({
  currentUser,
}) => {
  const [violations, setViolations] = useState<ViolationCase[]>(INITIAL_VIOLATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<ViolationCase | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Case form
  const [citizenName, setCitizenName] = useState('');
  const [citizenId, setCitizenId] = useState('');
  const [hamlet, setHamlet] = useState('Tổ dân phố 1');
  const [violationType, setViolationType] = useState<ViolationCase['violationType']>('KHONG_CHAP_HANH_LENH_KHAM');
  const [note, setNote] = useState('');

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName) return;

    let defaultFine = 25000000;
    if (violationType === 'KHONG_DANG_KY_LAN_DAU') defaultFine = 9000000;
    if (violationType === 'GIAN_DOI_SUC_KHOE') defaultFine = 17500000;
    if (violationType === 'KHONG_CHAP_HANH_LENH_NHAP_NGU') defaultFine = 35000000;

    const newCase: ViolationCase = {
      id: `VP-2026-${String(violations.length + 1).padStart(3, '0')}`,
      citizenId: citizenId || `MS-2026-${String(violations.length + 10).padStart(3, '0')}`,
      citizenName: citizenName.toUpperCase().trim(),
      hamlet,
      violationType,
      violationDate: new Date().toISOString().substring(0, 10),
      status: 'DANG_XAC_MINH',
      fineAmount: defaultFine,
      verifierName: currentUser.name,
      statuteOfLimitationsDeadline: '2027-10-14',
      note: note || 'Có dấu hiệu vi phạm lệnh triệu tập; đang xác minh lập biên bản làm rõ lý do.',
    };

    setViolations([newCase, ...violations]);
    setShowAddModal(false);
    setCitizenName('');
    setNote('');
    alert(`Đã lập hồ sơ theo dõi vụ việc ${newCase.id} cho công dân ${newCase.citizenName}!`);
  };

  const handleResolveJustification = (caseItem: ViolationCase) => {
    const updated = {
      ...caseItem,
      status: 'CO_LY_DO_CHINH_DANG' as const,
      justificationReason: 'Đã xuất trình hồ sơ bệnh án cấp cứu tại Bệnh viện đa khoa có xác nhận của bác sĩ điều trị.',
      note: 'Công nhận lý do chính đáng theo Điều 4 Nghị định 37/2022/NĐ-CP. Không xử phạt vi phạm hành chính.',
    };
    setViolations(violations.map((v) => (v.id === caseItem.id ? updated : v)));
    if (selectedCase && selectedCase.id === caseItem.id) {
      setSelectedCase(updated);
    }
    alert('Đã công nhận lý do chính đáng & đình chỉ xử phạt!');
  };

  const handleTransferCriminal = (caseItem: ViolationCase) => {
    const updated = {
      ...caseItem,
      status: 'CHUYEN_HINH_SU' as const,
      note: 'Đã bàn giao hồ sơ sang Cơ quan CSĐT Công an huyện điều tra theo Điều 332 Bộ luật Hình sự.',
    };
    setViolations(violations.map((v) => (v.id === caseItem.id ? updated : v)));
    if (selectedCase && selectedCase.id === caseItem.id) {
      setSelectedCase(updated);
    }
    alert('Đã chuyển hồ sơ sang Cơ quan Điều tra theo Điều 332 Bộ luật Hình sự!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-600/30 text-rose-400 border border-rose-500/40">
              <Scale className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Quản Lý Vi Phạm, Hồ Sơ Vụ Việc & Xử Lý Vi Phạm Hành Chính NVQS
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            (Nhóm VIII - Tính năng 66 đến 75): Áp dụng Nghị định 120/2013/NĐ-CP sửa đổi bởi Nghị định 37/2022/NĐ-CP.
            Theo dõi hành vi trốn khám, gian dối sức khỏe, kiểm tra lý do chính đáng, thời hiệu xử phạt 1 năm và chuyển hồ sơ hình sự (Điều 332 BLHS).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Lập Hồ Sơ Vụ Việc Mới</span>
        </button>
      </div>

      {/* Legal Fines Reference Card */}
      <div className="bg-slate-850 rounded-2xl p-4 border border-slate-700/80 shadow space-y-2 text-xs">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Khung Xử Phạt Vi Phạm Hành Chính Lĩnh Vực Quốc Phòng (Nghị Định 37/2022/NĐ-CP):
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Không đăng ký NVQS lần đầu:</span>
            <strong className="text-amber-300 font-mono text-sm">8.000.000 - 10.000.000 đ</strong>
            <span className="text-[10px] text-slate-500 block">Thẩm quyền: Chủ tịch UBND huyện</span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Không chấp hành lệnh gọi khám:</span>
            <strong className="text-rose-400 font-mono text-sm">25.000.000 - 35.000.000 đ</strong>
            <span className="text-[10px] text-slate-500 block">Thẩm quyền: Chủ tịch UBND huyện</span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Gian dối làm sai lệch kết quả SK:</span>
            <strong className="text-purple-400 font-mono text-sm">15.000.000 - 20.000.000 đ</strong>
            <span className="text-[10px] text-slate-500 block">Buộc thực hiện lại việc khám SK</span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Không chấp hành Lệnh nhập ngũ:</span>
            <strong className="text-red-400 font-mono text-sm">30.000.000 - 40.000.000 đ</strong>
            <span className="text-[10px] text-red-400 block font-semibold">Tái phạm: Truy cứu Điều 332 BLHS</span>
          </div>
        </div>
      </div>

      {/* Violations List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Hồ Sơ Các Vụ Việc Đang Quản Lý & Xác Minh (Năm Tuyển Quân 2026)
          </h3>
          <div className="relative w-full sm:w-64 text-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hoặc mã vụ việc..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 font-semibold">
                <th className="p-3">Mã Vụ Việc</th>
                <th className="p-3">Công Dân Vi Phạm</th>
                <th className="p-3">Hành Vi Ghi Nhận</th>
                <th className="p-3">Ngày Lập Biên Bản</th>
                <th className="p-3">Mức Tiền Phạt Dự Kiến</th>
                <th className="p-3">Trạng Thái Xử Lý</th>
                <th className="p-3">Thời Hiệu Xử Phạt</th>
                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {violations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-rose-400 whitespace-nowrap">
                    {v.id}
                  </td>
                  <td className="p-3 font-bold text-white whitespace-nowrap">
                    {v.citizenName}
                    <span className="block text-[10px] text-slate-400 font-normal">{v.hamlet}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-200">
                    {v.violationType === 'KHONG_CHAP_HANH_LENH_KHAM' && 'Không chấp hành lệnh gọi khám sức khỏe'}
                    {v.violationType === 'GIAN_DOI_SUC_KHOE' && 'Gian dối làm sai lệch kết quả hồ sơ NVQS'}
                    {v.violationType === 'KHONG_DANG_KY_LAN_DAU' && 'Không đăng ký NVQS lần đầu tuổi 17'}
                    {v.violationType === 'KHONG_CHAP_HANH_LENH_NHAP_NGU' && 'Không chấp hành lệnh gọi nhập ngũ'}
                  </td>
                  <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                    {v.violationDate}
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-300 whitespace-nowrap">
                    {v.fineAmount ? `${v.fineAmount.toLocaleString('vi-VN')} đ` : '-'}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      v.status === 'CO_LY_DO_CHINH_DANG'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : v.status === 'DA_LAP_BIEN_BAN'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : v.status === 'CHUYEN_HINH_SU'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    Hết hạn: {v.statuteOfLimitationsDeadline}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCase(v)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                    >
                      Chi Tiết & Xử Lý
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-rose-700/60 rounded-2xl max-w-2xl w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                Hồ Sơ Vụ Việc Vi Phạm: {selectedCase.id} - {selectedCase.citizenName}
              </h3>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                &times;
              </button>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-slate-300">
              <div>
                <span className="text-slate-500 block">Công dân:</span>
                <strong className="text-white text-sm">{selectedCase.citizenName}</strong> ({selectedCase.hamlet})
              </div>
              <div>
                <span className="text-slate-500 block">Hành vi vi phạm:</span>
                <span className="font-semibold text-rose-300">{selectedCase.violationType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Diễn biến & Biên bản xác minh:</span>
                <p className="mt-0.5">{selectedCase.note}</p>
              </div>
              {selectedCase.justificationReason && (
                <div className="p-2.5 bg-emerald-950/60 rounded-lg border border-emerald-800 text-emerald-200">
                  <strong>Giải trình lý do chính đáng:</strong> {selectedCase.justificationReason}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                <div>
                  <span className="text-slate-500">Mức tiền phạt quy định:</span>{' '}
                  <strong className="text-amber-300 font-mono">{selectedCase.fineAmount?.toLocaleString('vi-VN')} đ</strong>
                </div>
                <div>
                  <span className="text-slate-500">Thời hiệu xử phạt:</span>{' '}
                  <span className="font-mono text-slate-400">Đến {selectedCase.statuteOfLimitationsDeadline}</span>
                </div>
              </div>
            </div>

            {/* Actions for Case */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResolveJustification(selectedCase)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition"
                >
                  Công Nhận Lý Do Chính Đáng
                </button>
                <button
                  onClick={() => handleTransferCriminal(selectedCase)}
                  className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-semibold rounded-lg transition"
                >
                  Chuyển Cơ Quan Điều Tra (Điều 332 BLHS)
                </button>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-sm font-bold text-white">Lập Hồ Sơ Vụ Việc Vi Phạm Mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleAddCase} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Họ và tên công dân vi phạm:</label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value.toUpperCase())}
                  placeholder="NGUYỄN VĂN A"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Hành vi vi phạm:</label>
                  <select
                    value={violationType}
                    onChange={(e) => setViolationType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="KHONG_CHAP_HANH_LENH_KHAM">Không chấp hành lệnh gọi khám</option>
                    <option value="GIAN_DOI_SUC_KHOE">Gian dối làm sai lệch hồ sơ NVQS</option>
                    <option value="KHONG_DANG_KY_LAN_DAU">Không đăng ký NVQS lần đầu tuổi 17</option>
                    <option value="KHONG_CHAP_HANH_LENH_NHAP_NGU">Không chấp hành lệnh gọi nhập ngũ</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Thôn / TDP:</label>
                  <select
                    value={hamlet}
                    onChange={(e) => setHamlet(e.target.value)}
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
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Diễn biến vụ việc / Tình trạng tống đạt:</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Mô tả cụ thể biên bản tống đạt lệnh gọi, lý do vắng mặt..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-700 hover:bg-rose-600 font-bold text-white rounded-lg shadow"
                >
                  Lập Hồ Sơ Vụ Việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
