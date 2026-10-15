import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, Search, Filter, Download, Plus, 
  ExternalLink, CheckCircle2, Clock, ShieldCheck, AlertTriangle, 
  ChevronRight, ArrowUpDown, Eye, Trash2
} from 'lucide-react';
import { CitizenRecord, UserAccount, MilitaryStatus } from '../types';

interface CentralDataRegistryProps {
  citizens: CitizenRecord[];
  onSelectCitizen: (citizen: CitizenRecord) => void;
  onOpenNewCitizen: () => void;
  currentUser: UserAccount;
  onDeleteCitizen?: (id: string) => void;
}

export const CentralDataRegistry: React.FC<CentralDataRegistryProps> = ({
  citizens,
  onSelectCitizen,
  onOpenNewCitizen,
  currentUser,
  onDeleteCitizen,
}) => {
  // Current active table view: Bảng 01 -> Bảng 06
  const [activeTable, setActiveTable] = useState<'BANG_01' | 'BANG_02' | 'BANG_03' | 'BANG_04' | 'BANG_05' | 'BANG_06'>('BANG_01');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHamlet, setFilterHamlet] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterAge, setFilterAge] = useState<string>('ALL');

  // Filtered citizens
  const filteredCitizens = useMemo(() => {
    return citizens.filter((c) => {
      // Search
      const matchSearch =
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cccd.includes(searchTerm) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      // Hamlet
      if (filterHamlet !== 'ALL' && c.hamlet !== filterHamlet) return false;

      // Status
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'DISCREPANCY' && !c.hasDiscrepancy) return false;
        if (filterStatus !== 'DISCREPANCY' && c.status !== filterStatus) return false;
      }

      // Age
      if (filterAge === '18-25' && (c.age < 18 || c.age > 25)) return false;
      if (filterAge === '26-27' && (c.age < 26 || c.age > 27)) return false;

      return true;
    });
  }, [citizens, searchTerm, filterHamlet, filterStatus, filterAge]);

  // Export to CSV / Sheets format
  const handleExportCSV = () => {
    const headers = [
      'Mã hồ sơ',
      'Họ và tên',
      'Ngày sinh',
      'Tuổi',
      'Số CCCD',
      'Điện thoại',
      'Thôn/TDP',
      'Nơi thường trú',
      'Trình độ học vấn',
      'Trường học/Chuyên môn',
      'Cư trú',
      'Sức khỏe',
      'Chính sách',
      'Phân loại NVQS',
      'Lý do phân loại',
      'Trạng thái đối chiếu',
    ];

    const rows = filteredCitizens.map((c) => [
      `"${c.id}"`,
      `"${c.fullName}"`,
      `"${c.birthDate}"`,
      c.age,
      `'${c.cccd}`,
      `'${c.phone}'`,
      `"${c.hamlet}"`,
      `"${c.permanentAddress}"`,
      `"${c.educationLevel}"`,
      `"${c.schoolName || ''} ${c.major || ''}"`,
      `"${c.residenceStatus}"`,
      `"${c.healthGrade}"`,
      `"${c.policyCategory || ''}"`,
      `"${c.status}"`,
      `"${c.statusReason || ''}"`,
      c.hasDiscrepancy ? '"CÓ SAI LỆCH"' : '"KHỚP ĐỐI CHIẾU"',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DS_NGUON_NVQS_${activeTable}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hamlets = Array.from(new Set(citizens.map((c) => c.hamlet)));

  const renderStatusBadge = (status: MilitaryStatus, hasDiscrepancy: boolean) => {
    if (hasDiscrepancy) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-700/80">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          Sai lệch CSDL
        </span>
      );
    }
    switch (status) {
      case 'DU_DIEU_KIEN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/80">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Đủ điều kiện
          </span>
        );
      case 'TAM_HOAN_HOC_VAN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-700/80">
            <Clock className="w-3 h-3 text-amber-400" />
            Hoãn: Học vấn ĐH/CĐ
          </span>
        );
      case 'TAM_HOAN_SUC_KHOE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-700/80">
            <Clock className="w-3 h-3 text-amber-400" />
            Hoãn: Sức khỏe
          </span>
        );
      case 'TAM_HOAN_HOAN_CANH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-700/80">
            <Clock className="w-3 h-3 text-amber-400" />
            Hoãn: Hoàn cảnh
          </span>
        );
      case 'MIEN_GOI':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950 text-sky-300 border border-sky-700/80">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            Miễn gọi NVQS
          </span>
        );
      case 'CHUA_XAC_MINH':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Chờ xác minh
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Hệ Thống Quản Lý Tập Trung 6 Bảng Dữ Liệu Nghiệp Vụ
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Tổ chức theo cấu trúc chuẩn sáng kiến kỹ thuật: Bảng 01 (Hồ sơ) &rarr; Bảng 06 (Tổng hợp).
            Mỗi công dân được gắn mã duy nhất MSMS để liên kết đồng bộ các cơ sở dữ liệu.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onOpenNewCitizen}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Hồ Sơ Mới</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-medium rounded-xl border border-slate-600 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Table Navigation Buttons: Bảng 01 -> Bảng 06 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveTable('BANG_01')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            activeTable === 'BANG_01'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow-md'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Bảng 01</div>
          <div className="text-xs font-bold mt-1 line-clamp-1">Hồ sơ công dân</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Nhân thân & cư trú</div>
        </button>

        <button
          onClick={() => setActiveTable('BANG_02')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            activeTable === 'BANG_02'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow-md'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Bảng 02</div>
          <div className="text-xs font-bold mt-1 line-clamp-1">Trình độ học vấn</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Phổ thông & tốt nghiệp</div>
        </button>

        <button
          onClick={() => setActiveTable('BANG_03')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            activeTable === 'BANG_03'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow-md'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Bảng 03</div>
          <div className="text-xs font-bold mt-1 line-clamp-1">Chuyên môn KT</div>
          <div className="text-[10px] text-slate-400 mt-0.5">ĐH, CĐ, Văn bằng nghề</div>
        </button>

        <button
          onClick={() => setActiveTable('BANG_04')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            activeTable === 'BANG_04'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow-md'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Bảng 04</div>
          <div className="text-xs font-bold mt-1 line-clamp-1">Cư trú & Biến động</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Đi làm xa, tạm vắng</div>
        </button>

        <button
          onClick={() => setActiveTable('BANG_05')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            activeTable === 'BANG_05'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow-md'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Bảng 05</div>
          <div className="text-xs font-bold mt-1 line-clamp-1">Rà soát nghiệp vụ</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Đối chiếu & sai lệch</div>
        </button>

        <button
          onClick={() => setActiveTable('BANG_06')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
            activeTable === 'BANG_06'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow-md'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Bảng 06</div>
          <div className="text-xs font-bold mt-1 line-clamp-1">Tổng hợp báo cáo</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Phân loại theo luật</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Tên, CCCD, Mã hồ sơ..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          {/* Hamlet Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400">Thôn/Tổ:</span>
            <select
              value={filterHamlet}
              onChange={(e) => setFilterHamlet(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Tất cả địa bàn</option>
              {hamlets.map((h) => (
                <option key={h} value={h} className="bg-slate-900">{h}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400">Phân loại:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Tất cả trạng thái</option>
              <option value="DU_DIEU_KIEN" className="bg-slate-900">Đủ điều kiện</option>
              <option value="TAM_HOAN_HOC_VAN" className="bg-slate-900">Tạm hoãn học vấn</option>
              <option value="TAM_HOAN_SUC_KHOE" className="bg-slate-900">Tạm hoãn sức khỏe</option>
              <option value="TAM_HOAN_HOAN_CANH" className="bg-slate-900">Tạm hoãn hoàn cảnh</option>
              <option value="MIEN_GOI" className="bg-slate-900">Miễn gọi</option>
              <option value="DISCREPANCY" className="bg-slate-900">Có sai lệch đối chiếu</option>
            </select>
          </div>

          {/* Age Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400">Độ tuổi:</span>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">18 - 27 tuổi</option>
              <option value="18-25" className="bg-slate-900">18 - 25 tuổi</option>
              <option value="26-27" className="bg-slate-900">26 - 27 tuổi (ĐH/CĐ)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spreadsheet / Grid Table Container */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden">
        {/* Table info bar */}
        <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-emerald-400">
              {activeTable === 'BANG_01' && 'BẢNG 01: HỒ SƠ ĐỊNH DANH & CÔNG DÂN NGHĨA VỤ QUÂN SỰ'}
              {activeTable === 'BANG_02' && 'BẢNG 02: TRÌNH ĐỘ HỌC VẤN PHỔ THÔNG & CƠ SỞ GIÁO DỤC'}
              {activeTable === 'BANG_03' && 'BẢNG 03: CHUYÊN MÔN KỸ THUẬT & VĂN BẰNG ĐÀO TẠO'}
              {activeTable === 'BANG_04' && 'BẢNG 04: TÌNH TRẠNG CƯ TRÚ & BIẾN ĐỘNG NƠI Ở'}
              {activeTable === 'BANG_05' && 'BẢNG 05: KẾT QUẢ RÀ SOÁT NGHIỆP VỤ & ĐỐI CHIẾU LIÊN NGÀNH'}
              {activeTable === 'BANG_06' && 'BẢNG 06: BẢNG TỔNG HỢP & PHÂN LOẠI THEO LUẬT NVQS'}
            </span>
            <span>(Hiển thị {filteredCitizens.length} / {citizens.length} hồ sơ)</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Chế độ: Đọc/Ghi tập trung
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-300 border-b border-slate-700 font-semibold select-none">
                <th className="p-3 w-12 text-center border-r border-slate-800">STT</th>
                <th className="p-3 border-r border-slate-800">Mã Hồ Sơ</th>
                <th className="p-3 border-r border-slate-800">Họ và Tên</th>
                <th className="p-3 border-r border-slate-800">Ngày Sinh (Tuổi)</th>
                <th className="p-3 border-r border-slate-800">Số CCCD</th>
                <th className="p-3 border-r border-slate-800">Địa Bàn (Thôn/Tổ)</th>

                {/* Specific Columns based on active table */}
                {activeTable === 'BANG_01' && (
                  <>
                    <th className="p-3 border-r border-slate-800">Địa Chỉ Thường Trú</th>
                    <th className="p-3 border-r border-slate-800">Điện Thoại</th>
                    <th className="p-3 border-r border-slate-800">Thu Thập Qua</th>
                    <th className="p-3 border-r border-slate-800">Trạng Thái NVQS</th>
                  </>
                )}

                {activeTable === 'BANG_02' && (
                  <>
                    <th className="p-3 border-r border-slate-800">Trình Độ Phổ Thông</th>
                    <th className="p-3 border-r border-slate-800">Trường THPT</th>
                    <th className="p-3 border-r border-slate-800">Năm Tốt Nghiệp</th>
                    <th className="p-3 border-r border-slate-800">Đối Chiếu Sở GD&ĐT</th>
                  </>
                )}

                {activeTable === 'BANG_03' && (
                  <>
                    <th className="p-3 border-r border-slate-800">Trình Độ Chuyên Môn</th>
                    <th className="p-3 border-r border-slate-800">Tên Cơ Sở Đào Tạo</th>
                    <th className="p-3 border-r border-slate-800">Chuyên Ngành</th>
                    <th className="p-3 border-r border-slate-800">Đang Là SV?</th>
                    <th className="p-3 border-r border-slate-800">Nguồn Quân Nhân</th>
                  </>
                )}

                {activeTable === 'BANG_04' && (
                  <>
                    <th className="p-3 border-r border-slate-800">Trạng Thái Cư Trú</th>
                    <th className="p-3 border-r border-slate-800">Nơi Ở Hiện Tại</th>
                    <th className="p-3 border-r border-slate-800">Ngày Công An Xác Minh</th>
                    <th className="p-3 border-r border-slate-800">Biến Động Ghi Nhận</th>
                  </>
                )}

                {activeTable === 'BANG_05' && (
                  <>
                    <th className="p-3 border-r border-slate-800">CSDL Dân Cư</th>
                    <th className="p-3 border-r border-slate-800">CSDL Doanh Nghiệp</th>
                    <th className="p-3 border-r border-slate-800">CSDL ĐH/CĐ</th>
                    <th className="p-3 border-r border-slate-800">CSDL Sơ Tuyển Y Tế</th>
                    <th className="p-3 border-r border-slate-800">Phát Hiện Sai Lệch</th>
                  </>
                )}

                {activeTable === 'BANG_06' && (
                  <>
                    <th className="p-3 border-r border-slate-800">Sức Khỏe TT 105</th>
                    <th className="p-3 border-r border-slate-800">Chính Sách</th>
                    <th className="p-3 border-r border-slate-800">Kết Luận Phân Loại</th>
                    <th className="p-3 border-r border-slate-800">Căn Cứ Pháp Lý</th>
                    <th className="p-3 border-r border-slate-800">Người Duyệt</th>
                  </>
                )}

                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredCitizens.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                    Không tìm thấy hồ sơ nào khớp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredCitizens.map((citizen, idx) => (
                  <tr
                    key={citizen.id}
                    onClick={() => onSelectCitizen(citizen)}
                    className="hover:bg-slate-800/60 cursor-pointer transition select-none group"
                  >
                    <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-800">
                      {idx + 1}
                    </td>

                    <td className="p-3 font-mono font-bold text-emerald-400 border-r border-slate-800 whitespace-nowrap">
                      {citizen.id}
                    </td>

                    <td className="p-3 font-bold text-white border-r border-slate-800 whitespace-nowrap group-hover:text-emerald-300">
                      {citizen.fullName}
                    </td>

                    <td className="p-3 border-r border-slate-800 whitespace-nowrap">
                      <span className="font-mono text-slate-300">{citizen.birthDate}</span>
                      <span className="ml-1.5 px-1.5 py-0.2 rounded bg-slate-800 text-[11px] text-slate-300">
                        {citizen.age}t
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-300 border-r border-slate-800 whitespace-nowrap">
                      {citizen.cccd}
                    </td>

                    <td className="p-3 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                      {citizen.hamlet}
                    </td>

                    {/* Table 1 Cells */}
                    {activeTable === 'BANG_01' && (
                      <>
                        <td className="p-3 border-r border-slate-800 text-slate-300 max-w-xs truncate">
                          {citizen.permanentAddress}
                        </td>
                        <td className="p-3 border-r border-slate-800 font-mono text-slate-400 whitespace-nowrap">
                          {citizen.phone}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 border border-slate-700">
                            {citizen.collectedViaDevice} ({citizen.ocrConfidence}%)
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-800 whitespace-nowrap">
                          {renderStatusBadge(citizen.status, citizen.hasDiscrepancy)}
                        </td>
                      </>
                    )}

                    {/* Table 2 Cells */}
                    {activeTable === 'BANG_02' && (
                      <>
                        <td className="p-3 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                          {citizen.educationLevel === 'THPT_12_12' ? '12/12' : citizen.educationLevel}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                          {citizen.schoolName || 'THPT Đại Đồng'}
                        </td>
                        <td className="p-3 border-r border-slate-800 font-mono text-slate-300">
                          {citizen.graduationYear || '2023'}
                        </td>
                        <td className="p-3 border-r border-slate-800">
                          <span className="text-[11px] text-emerald-400 font-medium">✓ Đã xác thực học bạ</span>
                        </td>
                      </>
                    )}

                    {/* Table 3 Cells */}
                    {activeTable === 'BANG_03' && (
                      <>
                        <td className="p-3 border-r border-slate-800 font-semibold text-slate-200 whitespace-nowrap">
                          {citizen.educationLevel}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                          {citizen.schoolName || '-'}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                          {citizen.major || 'Chưa qua đào tạo nghề'}
                        </td>
                        <td className="p-3 border-r border-slate-800 whitespace-nowrap">
                          {citizen.isStudentCurrently ? (
                            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[11px]">
                              Đang học ĐH/CĐ
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Đã tốt nghiệp / Không</span>
                          )}
                        </td>
                        <td className="p-3 border-r border-slate-800 whitespace-nowrap text-[11px]">
                          {citizen.educationLevel === 'DAI_HOC' ? (
                            <span className="text-amber-300 font-medium">Nguồn SQ dự bị</span>
                          ) : (
                            <span className="text-slate-400">Hạ sĩ quan - binh sĩ</span>
                          )}
                        </td>
                      </>
                    )}

                    {/* Table 4 Cells */}
                    {activeTable === 'BANG_04' && (
                      <>
                        <td className="p-3 border-r border-slate-800 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            citizen.residenceStatus === 'THUONG_TRU_CO_MAT'
                              ? 'bg-emerald-950 text-emerald-300'
                              : citizen.residenceStatus === 'DI_LAM_XA'
                              ? 'bg-amber-950 text-amber-300'
                              : citizen.residenceStatus === 'TAM_VANG'
                              ? 'bg-red-950 text-red-300'
                              : 'bg-sky-950 text-sky-300'
                          }`}>
                            {citizen.residenceStatus}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-800 text-slate-300 max-w-xs truncate">
                          {citizen.temporaryAddress || citizen.permanentAddress}
                        </td>
                        <td className="p-3 border-r border-slate-800 font-mono text-slate-400 whitespace-nowrap">
                          {citizen.residenceVerifiedDate || '2026-09-15'}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-slate-300 text-[11px] max-w-xs truncate">
                          {citizen.residenceNote || 'Bình thường'}
                        </td>
                      </>
                    )}

                    {/* Table 5 Cells */}
                    {activeTable === 'BANG_05' && (
                      <>
                        <td className="p-3 border-r border-slate-800 text-[11px]">
                          {citizen.crossCheckResults.policeCitizenDb === 'KHOP' ? (
                            <span className="text-emerald-400">✓ Khớp</span>
                          ) : (
                            <span className="text-rose-400 font-bold">⚠ Lệch</span>
                          )}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-[11px]">
                          {citizen.crossCheckResults.enterpriseTaxDb === 'KHOP' ? (
                            <span className="text-emerald-400">✓ Khớp</span>
                          ) : citizen.crossCheckResults.enterpriseTaxDb === 'LECH' ? (
                            <span className="text-rose-400 font-bold">⚠ Lệch</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-[11px]">
                          {citizen.crossCheckResults.universityCollegeDb === 'KHOP' ? (
                            <span className="text-emerald-400">✓ Khớp</span>
                          ) : citizen.crossCheckResults.universityCollegeDb === 'LECH' ? (
                            <span className="text-rose-400 font-bold">⚠ Buộc thôi học</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-[11px]">
                          {citizen.crossCheckResults.healthDeptDb === 'KHOP' ? (
                            <span className="text-emerald-400">✓ Đạt sơ tuyển</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-3 border-r border-slate-800">
                          {citizen.hasDiscrepancy ? (
                            <span className="text-rose-400 font-bold text-[11px] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              CÓ SAI LỆCH
                            </span>
                          ) : (
                            <span className="text-emerald-400 text-[11px]">Không</span>
                          )}
                        </td>
                      </>
                    )}

                    {/* Table 6 Cells */}
                    {activeTable === 'BANG_06' && (
                      <>
                        <td className="p-3 border-r border-slate-800 text-[11px] whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                            {citizen.healthGrade}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-800 text-[11px] text-slate-300 whitespace-nowrap">
                          {citizen.policyCategory || 'Bình thường'}
                        </td>
                        <td className="p-3 border-r border-slate-800 whitespace-nowrap">
                          {renderStatusBadge(citizen.status, citizen.hasDiscrepancy)}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-[11px] text-slate-300 max-w-xs truncate">
                          {citizen.statusReason || 'Theo Luật NVQS'}
                        </td>
                        <td className="p-3 border-r border-slate-800 text-[11px] text-slate-400 whitespace-nowrap">
                          {citizen.statusApprovedBy || 'Đang thẩm định'}
                        </td>
                      </>
                    )}

                    {/* Actions */}
                    <td className="p-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectCitizen(citizen)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Xem chi tiết hồ sơ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteCitizen && currentUser.canApprove && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${citizen.fullName} (${citizen.id})?`)) {
                                onDeleteCitizen(citizen.id);
                              }
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition"
                            title="Xóa hồ sơ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
