import React, { useState } from 'react';
import { 
  FileText, Printer, Download, BarChart3, PieChart, 
  MapPin, GraduationCap, ShieldCheck, Clock
} from 'lucide-react';
import { CitizenRecord, UserAccount } from '../types';

interface ReportsAndPrintProps {
  citizens: CitizenRecord[];
  currentUser: UserAccount;
}

export const ReportsAndPrint: React.FC<ReportsAndPrintProps> = ({
  citizens,
  currentUser,
}) => {
  const [selectedReport, setSelectedReport] = useState<'MAU_01' | 'MAU_02' | 'MAU_03' | 'MAU_04'>('MAU_01');

  // Aggregations
  const total = citizens.length;
  const hamlets = Array.from(new Set(citizens.map((c) => c.hamlet)));

  // By Hamlet
  const hamletStats = hamlets.map((hamlet) => {
    const list = citizens.filter((c) => c.hamlet === hamlet);
    return {
      hamlet,
      total: list.length,
      qualified: list.filter((c) => c.status === 'DU_DIEU_KIEN').length,
      deferred: list.filter((c) => c.status.startsWith('TAM_HOAN')).length,
      exempt: list.filter((c) => c.status === 'MIEN_GOI').length,
      discrepancy: list.filter((c) => c.hasDiscrepancy || c.status === 'CHUA_XAC_MINH').length,
    };
  });

  // By Education
  const eduStats = {
    daiHoc: citizens.filter((c) => c.educationLevel === 'DAI_HOC').length,
    caoDang: citizens.filter((c) => c.educationLevel === 'CAO_DANG').length,
    trungCap: citizens.filter((c) => c.educationLevel === 'TRUNG_CAP').length,
    thpt: citizens.filter((c) => c.educationLevel === 'THPT_12_12').length,
    duoi12: citizens.filter((c) => c.educationLevel === 'DUOI_12').length,
  };

  // By Age
  const ageStats = {
    age18to25: citizens.filter((c) => c.age >= 18 && c.age <= 25).length,
    age26to27: citizens.filter((c) => c.age >= 26 && c.age <= 27).length,
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
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Trung Tâm Thống Kê & Báo Cáo Chuẩn Hành Chính Quân Sự
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Tự động trích xuất các biểu mẫu báo cáo tổng hợp nguồn công dân sẵn sàng nhập ngũ
            phục vụ giao ban Đảng ủy, HĐND, UBND và báo cáo Ban CHQS cấp quận/huyện.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo Chính Thức</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          onClick={() => setSelectedReport('MAU_01')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedReport === 'MAU_01'
              ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-emerald-400 font-mono uppercase font-semibold">Mẫu 01 / BC-QS</div>
          <div className="text-xs font-bold mt-1">Tổng Hợp Nguồn Theo Địa Bàn</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Thống kê từng Thôn, Tổ dân phố</div>
        </button>

        <button
          onClick={() => setSelectedReport('MAU_02')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedReport === 'MAU_02'
              ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-sky-400 font-mono uppercase font-semibold">Mẫu 02 / BC-HV</div>
          <div className="text-xs font-bold mt-1">Cơ Cấu Học Vấn & Chuyên Môn</div>
          <div className="text-[10px] text-slate-400 mt-0.5">ĐH, CĐ, Trung cấp, SQ Dự bị</div>
        </button>

        <button
          onClick={() => setSelectedReport('MAU_03')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedReport === 'MAU_03'
              ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-amber-400 font-mono uppercase font-semibold">Mẫu 03 / BC-TH</div>
          <div className="text-xs font-bold mt-1">Danh Sách Tạm Hoãn & Miễn</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Căn cứ Điều 41 Luật NVQS</div>
        </button>

        <button
          onClick={() => setSelectedReport('MAU_04')}
          className={`p-3.5 rounded-xl border text-left transition ${
            selectedReport === 'MAU_04'
              ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-purple-400 font-mono uppercase font-semibold">Mẫu 04 / BC-DC</div>
          <div className="text-xs font-bold mt-1">Biến Động Cư Trú & Sai Lệch</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Lao động xa, tạm vắng, học xa</div>
        </button>
      </div>

      {/* The Printable Official Document Paper */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0 print:text-black print:bg-white">
        {/* National Banner Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 pb-5">
          <div className="text-center sm:text-left space-y-1">
            <div className="font-bold text-xs text-slate-300 uppercase">
              ỦY BAN NHÂN DÂN XÃ ĐẠI ĐỒNG
            </div>
            <div className="font-bold text-xs text-emerald-400 uppercase">
              HỘI ĐỒNG NGHĨA VỤ QUÂN SỰ
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Số: 28/BC-HĐNVQS
            </div>
          </div>

          <div className="text-center space-y-1 self-center sm:self-auto">
            <div className="font-bold text-xs text-slate-200 uppercase tracking-wider">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="font-medium text-xs text-slate-400">
              Độc lập - Tự do - Hạnh phúc
            </div>
            <div className="w-28 h-[1px] bg-slate-700 mx-auto my-1"></div>
            <div className="text-[10px] text-slate-400 italic">
              Đại Đồng, ngày 14 tháng 10 năm 2026
            </div>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center space-y-1 py-2">
          <h3 className="text-base sm:text-lg font-bold text-amber-300 uppercase tracking-wide">
            {selectedReport === 'MAU_01' && 'BÁO CÁO TỔNG HỢP NGUỒN CÔNG DÂN SẴN SÀNG NHẬP NGŨ NĂM 2026'}
            {selectedReport === 'MAU_02' && 'BÁO CÁO CƠ CẤU TRÌNH ĐỘ HỌC VẤN & CHUYÊN MÔN KỸ THUẬT'}
            {selectedReport === 'MAU_03' && 'DANH SÁCH CÔNG DÂN THUỘC DIỆN TẠM HOÃN VÀ MIỄN GỌI NHẬP NGŨ'}
            {selectedReport === 'MAU_04' && 'BÁO CÁO KẾT QUẢ ĐỐI CHIẾU LIÊN NGÀNH & BIẾN ĐỘNG CƯ TRÚ'}
          </h3>
          <p className="text-xs text-slate-400 italic">
            (Áp dụng công nghệ số hóa thiết bị đầu cuối thông minh & chuẩn hóa dữ liệu 6 bảng)
          </p>
        </div>

        {/* Report Content based on selection */}
        {selectedReport === 'MAU_01' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Kính gửi: <strong>Ban Chỉ huy Quân sự Huyện</strong>; Thường trực Hội đồng NVQS Huyện.
            </p>
            <p className="text-slate-300 leading-relaxed indent-6">
              Thực hiện Luật Nghĩa vụ quân sự năm 2015 và Kế hoạch tuyển chọn, gọi công dân nhập ngũ năm 2026;
              Hội đồng NVQS xã Đại Đồng đã triển khai ứng dụng phần mềm số hóa thu thập dữ liệu nguồn bằng thiết bị thông minh,
              kết quả tổng hợp nguồn trên toàn địa bàn như sau:
            </p>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 font-semibold">
                    <th className="p-2.5 border-r border-slate-800 text-center">STT</th>
                    <th className="p-2.5 border-r border-slate-800">Địa bàn (Thôn / TDP)</th>
                    <th className="p-2.5 border-r border-slate-800 text-center">Tổng Nguồn</th>
                    <th className="p-2.5 border-r border-slate-800 text-center">Đủ Điều Kiện</th>
                    <th className="p-2.5 border-r border-slate-800 text-center">Tạm Hoãn</th>
                    <th className="p-2.5 border-r border-slate-800 text-center">Miễn Gọi</th>
                    <th className="p-2.5 text-center">Cần Xác Minh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {hamletStats.map((item, idx) => (
                    <tr key={item.hamlet} className="hover:bg-slate-900/50">
                      <td className="p-2.5 text-center font-mono text-slate-400 border-r border-slate-800">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 font-bold text-white border-r border-slate-800">
                        {item.hamlet}
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-200 border-r border-slate-800">
                        {item.total}
                      </td>
                      <td className="p-2.5 text-center font-bold text-emerald-400 border-r border-slate-800">
                        {item.qualified}
                      </td>
                      <td className="p-2.5 text-center font-bold text-amber-400 border-r border-slate-800">
                        {item.deferred}
                      </td>
                      <td className="p-2.5 text-center font-bold text-sky-400 border-r border-slate-800">
                        {item.exempt}
                      </td>
                      <td className="p-2.5 text-center font-bold text-rose-400">
                        {item.discrepancy}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-900 font-bold text-white border-t-2 border-slate-700">
                    <td colSpan={2} className="p-2.5 text-center border-r border-slate-800 uppercase">
                      Tổng Cộng Toàn Xã
                    </td>
                    <td className="p-2.5 text-center border-r border-slate-800 text-amber-300">
                      {total}
                    </td>
                    <td className="p-2.5 text-center border-r border-slate-800 text-emerald-400">
                      {citizens.filter((c) => c.status === 'DU_DIEU_KIEN').length}
                    </td>
                    <td className="p-2.5 text-center border-r border-slate-800 text-amber-400">
                      {citizens.filter((c) => c.status.startsWith('TAM_HOAN')).length}
                    </td>
                    <td className="p-2.5 text-center border-r border-slate-800 text-sky-400">
                      {citizens.filter((c) => c.status === 'MIEN_GOI').length}
                    </td>
                    <td className="p-2.5 text-center text-rose-400">
                      {citizens.filter((c) => c.hasDiscrepancy || c.status === 'CHUA_XAC_MINH').length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'MAU_02' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              Cơ cấu trình độ học vấn và chuyên môn kỹ thuật của nguồn công dân trong độ tuổi nhập ngũ (18-27):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <div className="text-slate-400">Đại học</div>
                <div className="text-xl font-bold text-sky-400 mt-1">{eduStats.daiHoc}</div>
                <div className="text-[10px] text-slate-500">Nguồn tạo nguồn Sĩ quan dự bị</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <div className="text-slate-400">Cao đẳng</div>
                <div className="text-xl font-bold text-purple-400 mt-1">{eduStats.caoDang}</div>
                <div className="text-[10px] text-slate-500">Chuyên môn kỹ thuật</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <div className="text-slate-400">Trung cấp nghề</div>
                <div className="text-xl font-bold text-amber-400 mt-1">{eduStats.trungCap}</div>
                <div className="text-[10px] text-slate-500">Thợ kỹ thuật tay nghề cao</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
                <div className="text-slate-400">THPT (12/12)</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{eduStats.thpt}</div>
                <div className="text-[10px] text-slate-500">Đạt chuẩn văn hóa</div>
              </div>
            </div>
          </div>
        )}

        {/* Signatures Footer */}
        <div className="pt-8 border-t border-slate-800 flex justify-between items-start text-xs">
          <div className="text-center space-y-1">
            <div className="font-semibold text-slate-300 uppercase">
              NGƯỜI LẬP BIỂU
            </div>
            <div className="text-[10px] text-slate-500 italic">(Ký, ghi rõ họ tên)</div>
            <div className="pt-12 font-bold text-slate-200">
              {currentUser.name}
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="font-semibold text-slate-300 uppercase">
              CHỦ TỊCH HỘI ĐỒNG NVQS XÃ
            </div>
            <div className="text-[10px] text-slate-500 italic">(Ký, đóng dấu)</div>
            <div className="pt-12 font-bold text-slate-200">
              CHỦ TỊCH UBND XÃ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
