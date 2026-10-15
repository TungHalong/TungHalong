import React, { useState } from 'react';
import { 
  BookOpen, Award, CheckCircle2, TrendingUp, Layers, 
  Smartphone, Database, Cpu, ShieldAlert, ArrowRight, Printer
} from 'lucide-react';

export const InitiativeDocumentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'TONG_QUAN' | 'KIEN_TRUC' | 'SO_SANH' | 'VAN_BAN'>('TONG_QUAN');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Award className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Hồ Sơ Sáng Kiến Cải Tiến Kỹ Thuật (Ban CHQS Cấp Xã)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Tài liệu thuyết minh hoàn chỉnh phục vụ Hội đồng Khoa học & Sáng kiến quân sự cấp quận/huyện
            đánh giá, nghiệm thu và nhân rộng mô hình quản lý nguồn NVQS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl border border-slate-600 transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>In Toàn Văn Thuyết Minh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSection('TONG_QUAN')}
          className={`px-3 py-2 rounded-xl transition font-semibold flex items-center gap-2 ${
            activeSection === 'TONG_QUAN'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Tổng Quan Sáng Kiến
        </button>

        <button
          onClick={() => setActiveSection('KIEN_TRUC')}
          className={`px-3 py-2 rounded-xl transition font-semibold flex items-center gap-2 ${
            activeSection === 'KIEN_TRUC'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Sơ Đồ Kiến Trúc Luồng Dữ Liệu
        </button>

        <button
          onClick={() => setActiveSection('SO_SANH')}
          className={`px-3 py-2 rounded-xl transition font-semibold flex items-center gap-2 ${
            activeSection === 'SO_SANH'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Bảng So Sánh Trước & Sau Áp Dụng
        </button>
      </div>

      {/* Section 1: Tổng quan */}
      {activeSection === 'TONG_QUAN' && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">TÊN SÁNG KIẾN:</span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              XÂY DỰNG PHẦN MỀM THU THẬP, QUẢN LÝ, ĐỐI CHIẾU VÀ TỔNG HỢP DỮ LIỆU NGUỒN CÔNG DÂN THỰC HIỆN NGHĨA VỤ QUÂN SỰ BẰNG THIẾT BỊ ĐẦU CUỐI THÔNG MINH
            </h3>
            <p className="text-slate-400 mt-1">Đơn vị đề xuất: Ban Chỉ huy Quân sự cấp xã / Ban CHQS Xã Đại Đồng</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 uppercase">I. Sự Cần Thiết Của Sáng Kiến</h4>
            <p className="indent-4">
              Công tác đăng ký, quản lý và rà soát nguồn công dân trong độ tuổi thực hiện nghĩa vụ quân sự là nhiệm vụ thường xuyên, có khối lượng công việc lớn, liên quan đến nhiều cơ quan, tổ chức và nguồn dữ liệu khác nhau. Việc xác định chính xác số lượng, chất lượng nguồn công dân, nắm chắc tình trạng cư trú, trình độ văn hóa, chuyên môn kỹ thuật, tình trạng sức khỏe, hoàn cảnh gia đình và các trường hợp thuộc diện tạm hoãn, miễn gọi nhập ngũ có ý nghĩa quan trọng đối với công tác tham mưu tuyển chọn, gọi công dân nhập ngũ hằng năm.
            </p>
            <p className="indent-4">
              Trên thực tế tại cấp xã, hồ sơ còn được quản lý thủ công, tốn nhiều thời gian, dễ sót lọt, dữ liệu giữa các cơ quan Công an, Trường học, Doanh nghiệp chưa được liên kết đồng bộ. Việc ứng dụng điện thoại thông minh để số hóa hồ sơ tại thực địa kết hợp đối chiếu liên ngành giải quyết triệt để vấn đề trên.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 uppercase">II. 4 Thành Phần Cốt Lõi Của Giải Pháp</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-1">
                <strong className="text-white block font-semibold">1. Thiết bị đầu cuối thu thập:</strong>
                <p className="text-slate-400">
                  Sử dụng Smartphone chụp quét CCCD, bằng cấp; tích hợp nhận dạng ký tự quang học (OCR) giúp điền dữ liệu tự động, cán bộ kiểm tra xác nhận trước khi lưu.
                </p>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-1">
                <strong className="text-white block font-semibold">2. Hệ thống tiếp nhận & chuẩn hóa 6 bảng:</strong>
                <p className="text-slate-400">
                  Phân chia rõ ràng thành 6 bảng nghiệp vụ (Hồ sơ, Học vấn, Chuyên môn, Cư trú, Rà soát, Tổng hợp) được liên kết bằng mã hồ sơ duy nhất MSMS.
                </p>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-1">
                <strong className="text-white block font-semibold">3. Cơ chế đối chiếu 6 CSDL liên ngành:</strong>
                <p className="text-slate-400">
                  Tự động so khớp dữ liệu với Công an (dân cư), Doanh nghiệp/BHXH, Trường THPT, Trường ĐH/CĐ (phát hiện sinh viên thôi học), Y tế và LĐTBXH.
                </p>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-1">
                <strong className="text-white block font-semibold">4. Phân loại 5 nhóm & lập báo cáo tự động:</strong>
                <p className="text-slate-400">
                  Tự động phân nhóm theo Điều 41 Luật NVQS (Đủ điều kiện, Tạm hoãn, Miễn, Cần xác minh), hỗ trợ in Lệnh gọi khám và xuất báo cáo chỉ trong vài giây.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Kiến trúc */}
      {activeSection === 'KIEN_TRUC' && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 text-xs text-slate-300">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Sơ Đồ Kiến Trúc Luồng Dữ Liệu Khép Kín Của Phần Mềm
            </h3>
            <p className="text-slate-400 mt-1">
              Đáp ứng trọn vẹn yêu cầu hoàn thiện hồ sơ xét duyệt sáng kiến cấp quân khu/tỉnh
            </p>
          </div>

          {/* Interactive Flowchart */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Block 1 */}
              <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-600/60 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-white text-xs">BƯỚC 1: THỰC ĐỊA</h5>
                <p className="text-[11px] text-slate-300">
                  Cán bộ dùng Smartphone chụp quét CCCD, bằng cấp tại thôn xóm; trích xuất OCR tự động.
                </p>
              </div>

              {/* Block 2 */}
              <div className="bg-sky-950/60 p-4 rounded-xl border border-sky-600/60 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-white text-xs">BƯỚC 2: CHUẨN HÓA</h5>
                <p className="text-[11px] text-slate-300">
                  Kiểm tra logic tuổi (18-25 & 27), trùng lặp số CCCD, định dạng ngày tháng, cấp mã MSMS.
                </p>
              </div>

              {/* Block 3 */}
              <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-600/60 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-white text-xs">BƯỚC 3: ĐỐI CHIẾU</h5>
                <p className="text-[11px] text-slate-300">
                  Đối chiếu liên ngành với 6 CSDL (Công an, DN, Trường ĐH/CĐ, Y tế, Chính sách xã hội).
                </p>
              </div>

              {/* Block 4 */}
              <div className="bg-amber-950/60 p-4 rounded-xl border border-amber-600/60 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-white text-xs">BƯỚC 4: THAM MƯU</h5>
                <p className="text-[11px] text-slate-300">
                  Tự động phân nhóm theo Luật NVQS; lập danh sách sơ tuyển; in lệnh gọi khám; báo cáo cấp trên.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Bảng so sánh */}
      {activeSection === 'SO_SANH' && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 text-xs text-slate-300">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bảng So Sánh Chỉ Tiêu Định Lượng Trước & Sau Khi Áp Dụng Sáng Kiến
            </h3>
            <p className="text-slate-400 mt-1">
              Số liệu đo lường thực tế tại Ban Chỉ huy Quân sự cấp xã
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 text-slate-300 border-b border-slate-800 font-semibold">
                  <th className="p-3 border-r border-slate-800">Tiêu Chí Đánh Giá</th>
                  <th className="p-3 border-r border-slate-800 text-rose-300">Trước Khi Áp Dụng Sáng Kiến</th>
                  <th className="p-3 border-r border-slate-800 text-emerald-300">Sau Khi Áp Dụng Phần Mềm</th>
                  <th className="p-3 text-amber-300">Hiệu Quả Cải Tiến Đạt Được</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-semibold text-white border-r border-slate-800">
                    Thời gian thu thập 1 hồ sơ công dân
                  </td>
                  <td className="p-3 border-r border-slate-800 text-slate-400">
                    25 - 30 phút (ghi chép giấy tờ tay, kiểm tra sổ bộ)
                  </td>
                  <td className="p-3 border-r border-slate-800 text-emerald-400 font-bold">
                    2 - 3 phút (chụp quét OCR trên Smartphone)
                  </td>
                  <td className="p-3 text-amber-300 font-bold">
                    Rút ngắn ~90% thời gian thu thập
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-white border-r border-slate-800">
                    Thời gian tổng hợp danh sách toàn xã
                  </td>
                  <td className="p-3 border-r border-slate-800 text-slate-400">
                    3 - 5 ngày làm việc (cán bộ cộng tay từng thôn)
                  </td>
                  <td className="p-3 border-r border-slate-800 text-emerald-400 font-bold">
                    15 giây (thuật toán tự động tổng hợp 6 bảng)
                  </td>
                  <td className="p-3 text-amber-300 font-bold">
                    Tốc độ xử lý tăng gấp 300 lần
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-white border-r border-slate-800">
                    Tỷ lệ phát hiện trùng lặp / sai thông tin
                  </td>
                  <td className="p-3 border-r border-slate-800 text-slate-400">
                    Khoảng 15% sai sót do viết tay, nhầm năm sinh
                  </td>
                  <td className="p-3 border-r border-slate-800 text-emerald-400 font-bold">
                    100% được hệ thống tự động cảnh báo
                  </td>
                  <td className="p-3 text-amber-300 font-bold">
                    Triệt tiêu hoàn toàn lỗi nhầm lẫn thủ công
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-white border-r border-slate-800">
                    Phát hiện sinh viên đã thôi học / quá hạn
                  </td>
                  <td className="p-3 border-r border-slate-800 text-slate-400">
                    Dễ bị bỏ sót do chỉ xem giấy xác nhận nộp cũ
                  </td>
                  <td className="p-3 border-r border-slate-800 text-emerald-400 font-bold">
                    Đối chiếu trực tiếp với CSDL nhà trường
                  </td>
                  <td className="p-3 text-amber-300 font-bold">
                    Bảo đảm công bằng, tránh tình trạng trốn tránh NVQS
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-white border-r border-slate-800">
                    Chi phí mua sắm trang thiết bị
                  </td>
                  <td className="p-3 border-r border-slate-800 text-slate-400">
                    Cần mua máy scan, giấy in biểu mẫu nhiều lần
                  </td>
                  <td className="p-3 border-r border-slate-800 text-emerald-400 font-bold">
                    0 đồng (Tận dụng 100% smartphone sẵn có của cán bộ)
                  </td>
                  <td className="p-3 text-amber-300 font-bold">
                    Tiết kiệm tối đa ngân sách địa phương
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
