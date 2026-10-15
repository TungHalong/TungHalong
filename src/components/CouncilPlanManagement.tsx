import React, { useState } from 'react';
import { 
  Users, Calendar, CheckCircle2, MapPin, Award, 
  Building, Shield, FileCheck, Target, Clock, Phone
} from 'lucide-react';
import { CouncilMember, UserAccount } from '../types';
import { INITIAL_COUNCIL_MEMBERS } from '../data/featureCatalog';

interface CouncilPlanManagementProps {
  currentUser: UserAccount;
}

export const CouncilPlanManagement: React.FC<CouncilPlanManagementProps> = ({
  currentUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'HOI_DONG' | 'LICH_CONG_TAC' | 'BINH_CU' | 'HIEP_DONG'>('HOI_DONG');
  const [members] = useState<CouncilMember[]>(INITIAL_COUNCIL_MEMBERS);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Hội Đồng Nghĩa Vụ Quân Sự, Kế Hoạch & Tổ Chức Tuyển Quân Cấp Xã
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            (Nhóm V - Tính năng 36 đến 45): Quản lý cơ cấu thành viên Hội đồng NVQS xã, phân công địa bàn,
            lịch công tác các giai đoạn, quản lý quy trình bình cử dân chủ tại khu dân cư (3 cử, 4 công khai) và hiệp đồng với đơn vị nhận quân.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
          <span>Chỉ tiêu tuyển quân 2026: <strong>25 Thanh Niên</strong></span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubTab('HOI_DONG')}
          className={`px-3 py-2 rounded-xl transition font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'HOI_DONG'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Hội Đồng NVQS Xã (Tính năng 36 & 39)
        </button>

        <button
          onClick={() => setActiveSubTab('LICH_CONG_TAC')}
          className={`px-3 py-2 rounded-xl transition font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'LICH_CONG_TAC'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Lịch Công Tác Tuyển Quân (Tính năng 37 & 38)
        </button>

        <button
          onClick={() => setActiveSubTab('BINH_CU')}
          className={`px-3 py-2 rounded-xl transition font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'BINH_CU'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          Bình Cử Dân Cư "3 Cử, 4 Công Khai" (Tính năng 41)
        </button>

        <button
          onClick={() => setActiveSubTab('HIEP_DONG')}
          className={`px-3 py-2 rounded-xl transition font-semibold flex items-center gap-1.5 ${
            activeSubTab === 'HIEP_DONG'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          Chỉ Tiêu & Đơn Vị Nhận Quân (Tính năng 42-45)
        </button>
      </div>

      {/* Sub Tab 1: Hội Đồng NVQS Xã */}
      {activeSubTab === 'HOI_DONG' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-slate-850 p-4 rounded-2xl border border-slate-700/80 shadow space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold text-[10px] uppercase">
                    {m.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.councilRole.includes('Chủ tịch') ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {m.councilRole}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{m.fullName}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{m.officialPosition}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Phụ trách: {m.assignedHamlets.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono">{m.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 2: Lịch công tác tuyển quân */}
      {activeSubTab === 'LICH_CONG_TAC' && (
        <div className="bg-slate-850 rounded-2xl p-5 border border-slate-700/80 shadow space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Lịch Trình Công Tác Tuyển Chọn & Gọi Công Dân Nhập Ngũ Năm 2026
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </span>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Tháng 04/2026: Đăng ký nghĩa vụ quân sự lần đầu (Tuổi 17)</span>
                  <span className="text-emerald-400 font-mono">ĐÃ HOÀN THÀNH</span>
                </div>
                <p className="text-slate-400 mt-0.5">Tổ chức đăng ký và cấp Giấy chứng nhận NVQS cho nam công dân sinh năm 2009.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </span>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Tháng 08 - 09/2026: Rà soát nguồn & Số hóa bằng Smartphone</span>
                  <span className="text-emerald-400 font-mono">ĐÃ HOÀN THÀNH</span>
                </div>
                <p className="text-slate-400 mt-0.5">Xuống từng thôn xóm chụp quét CCCD, đối chiếu 6 CSDL liên ngành.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-amber-600/60 bg-amber-950/20 flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                3
              </span>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-amber-200">
                  <span>Tháng 10 - 11/2026: Sơ tuyển tại xã & Khám sức khỏe tại Huyện</span>
                  <span className="text-amber-400 font-mono">ĐANG TRIỂN KHAI</span>
                </div>
                <p className="text-slate-300 mt-0.5">Trạm y tế xã đo thể lực, khúc xạ; phát Lệnh gọi khám sức khỏe tập trung.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                4
              </span>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Tháng 12/2026: Bình cử tại khu dân cư & Xét duyệt chính trị 4 cấp</span>
                  <span className="text-slate-500 font-mono">SẮP DIỄN RA</span>
                </div>
                <p className="text-slate-500 mt-0.5">Họp thôn bình cử, xác minh lai lịch chính trị, niêm yết công khai danh sách 20 ngày.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                5
              </span>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Tháng 01/2027: Phát Lệnh gọi nhập ngũ & Cấp phát quân trang</span>
                  <span className="text-slate-500 font-mono">CHƯA BẮT ĐẦU</span>
                </div>
                <p className="text-slate-500 mt-0.5">Phát lệnh trước 15 ngày, tổ chức gặp mặt tặng quà động viên thanh niên trúng tuyển.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                6
              </span>
              <div className="flex-1">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Tháng 02/2027: Ngày hội Tòng quân - Lễ Giao Nhận Quân</span>
                  <span className="text-slate-500 font-mono">NGÀY HỘI GIAO QUÂN</span>
                </div>
                <p className="text-slate-500 mt-0.5">Bàn giao 100% chỉ tiêu cho các đơn vị Quân đội và Công an nhân dân.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Bình cử khu dân cư */}
      {activeSubTab === 'BINH_CU' && (
        <div className="bg-slate-850 rounded-2xl p-5 border border-slate-700/80 shadow space-y-4 text-xs text-slate-300">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quy Trình Bình Cử & Công Khai Dân Chủ "3 Cử, 4 Công Khai" Tại Thôn Xóm
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Bảo đảm công bằng, minh bạch, tạo sự đồng thuận cao trong nhân dân</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 uppercase text-xs">Nguyên Tắc "3 Cử" (Đề Cử Dân Chủ):</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>Cử 1:</strong> Thôn, khu dân cư bình cử thanh niên tiêu biểu sẵn sàng nhập ngũ.</li>
                <li><strong>Cử 2:</strong> Các đoàn thể (Đoàn thanh niên, Hội phụ nữ, Hội CCB) giới thiệu đoàn viên ưu tú.</li>
                <li><strong>Cử 3:</strong> Hội đồng Nghĩa vụ quân sự xã thẩm tra và quyết định danh sách đề nghị gọi khám.</li>
              </ul>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 uppercase text-xs">Nguyên Tắc "4 Công Khai" (Minh Bạch):</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>Công khai 1:</strong> Danh sách công dân trong độ tuổi thực hiện nghĩa vụ quân sự.</li>
                <li><strong>Công khai 2:</strong> Danh sách công dân thuộc diện tạm hoãn và miễn gọi nhập ngũ (rõ lý do).</li>
                <li><strong>Công khai 3:</strong> Danh sách công dân đủ điều kiện gọi khám sức khỏe.</li>
                <li><strong>Công khai 4:</strong> Danh sách công dân trúng tuyển chính thức phát Lệnh nhập ngũ.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 4: Hiệp đồng đơn vị nhận quân */}
      {activeSubTab === 'HIEP_DONG' && (
        <div className="bg-slate-850 rounded-2xl p-5 border border-slate-700/80 shadow space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Phân Bổ Chỉ Tiêu & Đơn Vị Hiệp Đồng Nhận Quân Năm 2026
          </h3>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 font-semibold">
                  <th className="p-3">Đơn Vị Quân Đội / Công An Nhận Quân</th>
                  <th className="p-3">Chỉ Tiêu Xã (Người)</th>
                  <th className="p-3">Yêu Cầu Tiêu Chuẩn Chuyên Môn</th>
                  <th className="p-3">Cán Bộ Phụ Trách Hiệp Đồng</th>
                  <th className="p-3">Trạng Thái Hiệp Đồng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-white">Sư đoàn Bộ binh 301 (Bộ Tư lệnh Thủ đô)</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">14</td>
                  <td className="p-3 text-slate-300">Sức khỏe Loại 1, 2; Văn hóa 12/12</td>
                  <td className="p-3 text-slate-300">Đ/c Trần Quốc Tuấn</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Đã hiệp đồng chốt hồ sơ</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-white">Lữ đoàn Phòng không 280 (Quân chủng PK-KQ)</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">6</td>
                  <td className="p-3 text-slate-300">Ưu tiên tốt nghiệp CĐ, ĐH Kỹ thuật, Cơ khí</td>
                  <td className="p-3 text-slate-300">Đ/c Nguyễn Văn Hùng</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Đã hiệp đồng chốt hồ sơ</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-white">Công an Nhân dân (Nghĩa vụ CAND)</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">5</td>
                  <td className="p-3 text-slate-300">Tiêu chuẩn chính trị theo Thông tư 44/BCA</td>
                  <td className="p-3 text-slate-300">Đ/c Lê Hoàng Minh (Trưởng CA xã)</td>
                  <td className="p-3 text-emerald-400 font-semibold">✓ Đã thẩm tra lý lịch 3 đời</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
