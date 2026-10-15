import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Search, Filter, Download, ArrowRight, CheckCircle2, 
  Layers, Shield, FileText, ExternalLink, BookOpen, AlertCircle
} from 'lucide-react';
import { FeatureItem } from '../types';
import { FULL_100_FEATURES } from '../data/featureCatalog';

interface FeatureCatalogExplorerProps {
  onNavigateTab: (tab: string) => void;
}

export const FeatureCatalogExplorer: React.FC<FeatureCatalogExplorerProps> = ({
  onNavigateTab,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<number | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Group definitions
  const groups = [
    { id: 1, name: 'Nhóm I. Quản lý hệ thống & danh mục dùng chung (1-5)' },
    { id: 2, name: 'Nhóm II. Thu thập, số hóa & quản lý hồ sơ (6-15)' },
    { id: 3, name: 'Nhóm III. Đối chiếu, xác minh & biến động (16-25)' },
    { id: 4, name: 'Nhóm IV. Quản lý đăng ký & nguồn NVQS (26-35)' },
    { id: 5, name: 'Nhóm V. Kế hoạch & tổ chức tuyển quân (36-45)' },
    { id: 6, name: 'Nhóm VI. Sơ tuyển, khám sức khỏe & xét duyệt (46-55)' },
    { id: 7, name: 'Nhóm VII. Tạm hoãn, miễn gọi nhập ngũ (56-65)' },
    { id: 8, name: 'Nhóm VIII. Quản lý vi phạm & xử lý vụ việc (66-75)' },
    { id: 9, name: 'Nhóm IX. Thẩm quyền & trách nhiệm giải trình (76-85)' },
    { id: 10, name: 'Nhóm X. Báo cáo, thống kê & tham mưu (86-93)' },
    { id: 11, name: 'Nhóm XI. Cảnh báo & kho văn bản pháp luật (94-97)' },
    { id: 12, name: 'Nhóm XII. Bảo mật & duy trì hệ thống (98-100)' },
  ];

  // Filtering
  const filteredFeatures = useMemo(() => {
    return FULL_100_FEATURES.filter((f) => {
      if (selectedGroup !== 'ALL' && f.groupId !== selectedGroup) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = f.name.toLowerCase().includes(term);
        const matchDesc = f.description.toLowerCase().includes(term);
        const matchLegal = f.legalBasis.toLowerCase().includes(term);
        const matchId = String(f.id).includes(term);
        if (!matchName && !matchDesc && !matchLegal && !matchId) return false;
      }
      return true;
    });
  }, [selectedGroup, searchTerm]);

  // Export full 100 features specification to CSV
  const handleExportMatrixCSV = () => {
    const headers = [
      'STT',
      'Tên Tính Năng',
      'Nhóm Nghiệp Vụ',
      'Thuyết Minh Ngắn Gọn',
      'Dữ Liệu Đầu Vào',
      'Kết Quả Đầu Ra',
      'Người Sử Dụng / Phụ Trách',
      'Căn Cứ Pháp Lý',
      'Tiêu Chí Nghiệm Thu',
      'Trạng Thái',
    ];

    const rows = FULL_100_FEATURES.map((f) => [
      f.id,
      `"${f.name}"`,
      `"${f.groupName}"`,
      `"${f.description}"`,
      `"${f.inputData}"`,
      `"${f.outputData}"`,
      `"${f.responsibleRole}"`,
      `"${f.legalBasis}"`,
      `"${f.acceptanceCriteria}"`,
      `"${f.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BANG_DAC_TA_100_TINH_NANG_MSMS_CAP_XA.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-2xl p-6 border border-emerald-800/60 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Đặc Tả Kỹ Thuật 100 Tính Năng
              </span>
              <span className="text-xs text-emerald-400 font-semibold font-mono">
                100/100 Tính Năng Đã Tích Hợp
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Danh Mục & Bảng Đặc Tả Nghiệp Vụ 100 Tính Năng Hệ Thống (MSMS Cấp Xã)
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Hệ thống hóa toàn bộ 100 tính năng theo 12 nhóm nghiệp vụ quy định, bổ sung chi tiết:
              <strong> Dữ liệu đầu vào</strong>, <strong>Kết quả đầu ra</strong>, <strong>Căn cứ pháp lý</strong>, 
              <strong> Thẩm quyền xử lý</strong> và <strong>Tiêu chí nghiệm thu</strong>. Có thể xuất làm phụ lục hồ sơ sáng kiến cải tiến kỹ thuật.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportMatrixCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition shadow"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Xuất Bảng Đặc Tả Excel (100 Tính Năng)</span>
            </button>
          </div>
        </div>

        {/* 4 Core Principles Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <strong className="text-amber-300 block">1. Đúng thẩm quyền:</strong>
            <span className="text-slate-400 text-[11px]">Hỗ trợ tổng hợp, tham mưu; không tự quy kết vi phạm.</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <strong className="text-emerald-300 block">2. Đúng thời điểm pháp lý:</strong>
            <span className="text-slate-400 text-[11px]">Lưu căn cứ và trạng thái tại thời điểm xử lý hồ sơ.</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <strong className="text-sky-300 block">3. Đúng quy trình:</strong>
            <span className="text-slate-400 text-[11px]">Kiểm tra điều kiện, phê duyệt, lưu vết trách nhiệm 8 bước.</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <strong className="text-purple-300 block">4. Đúng phạm vi dữ liệu:</strong>
            <span className="text-slate-400 text-[11px]">Tuân thủ bảo vệ dữ liệu cá nhân theo Nghị định 13/2023.</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo STT (1-100), Tên tính năng, Luật, Từ khóa..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Group Selector Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-slate-400 whitespace-nowrap">Nhóm nghiệp vụ:</span>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl focus:outline-none cursor-pointer max-w-xs truncate"
          >
            <option value="ALL">Tất cả 12 Nhóm (100 Tính Năng)</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Hiển thị <strong className="text-white">{filteredFeatures.length}</strong> / 100 tính năng
        </span>
        <span className="text-emerald-400 font-medium">
          ✓ Nhấn vào tính năng để xem chi tiết đặc tả & chạy thử nghiệm
        </span>
      </div>

      {/* Feature Cards Grid */}
      <div className="space-y-3">
        {filteredFeatures.map((f) => {
          const isExpanded = expandedId === f.id;
          return (
            <div
              key={f.id}
              className={`bg-slate-850 rounded-2xl border transition overflow-hidden ${
                isExpanded ? 'border-emerald-500/80 shadow-xl' : 'border-slate-700/70 hover:border-slate-600'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : f.id)}
                className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 flex-shrink-0">
                    {f.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white hover:text-emerald-300 transition">
                        {f.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                        {f.groupName.split('.')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                    ✓ Đã Tích Hợp
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab(f.actionTab);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition"
                  >
                    <span>Mở Tính Năng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded Detailed Specification */}
              {isExpanded && (
                <div className="bg-slate-900/90 p-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                        1. Dữ liệu đầu vào (Input):
                      </span>
                      <p className="text-slate-200 mt-0.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {f.inputData}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                        2. Kết quả đầu ra (Output):
                      </span>
                      <p className="text-slate-200 mt-0.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {f.outputData}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                        3. Người thực hiện / Phụ trách:
                      </span>
                      <p className="text-emerald-300 font-medium mt-0.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {f.responsibleRole}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                        4. Căn cứ pháp lý:
                      </span>
                      <p className="text-amber-300 font-mono text-[11px] mt-0.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {f.legalBasis}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                        5. Tiêu chí nghiệm thu (Acceptance Criteria):
                      </span>
                      <p className="text-slate-200 mt-0.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {f.acceptanceCriteria}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onNavigateTab(f.actionTab)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg transition active:scale-95"
                      >
                        <span>Mở Trực Tiếp Màn Hình Chức Năng</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
