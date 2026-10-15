import React from 'react';
import { 
  Users, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  Smartphone, ArrowRight, TrendingUp, Sparkles, FileSpreadsheet,
  AlertOctagon, UserPlus
} from 'lucide-react';
import { CitizenRecord, OperationalStep, UserAccount } from '../types';

interface DashboardProps {
  citizens: CitizenRecord[];
  operationalSteps: OperationalStep[];
  onNavigateTab: (tab: string) => void;
  currentUser: UserAccount;
  onOpenNewCitizen: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  citizens,
  operationalSteps,
  onNavigateTab,
  currentUser,
  onOpenNewCitizen,
}) => {
  const total = citizens.length;
  const qualified = citizens.filter((c) => c.status === 'DU_DIEU_KIEN').length;
  const deferred = citizens.filter((c) => c.status.startsWith('TAM_HOAN')).length;
  const exempt = citizens.filter((c) => c.status === 'MIEN_GOI').length;
  const unverifiedOrDiscrepant = citizens.filter(
    (c) => c.status === 'CHUA_XAC_MINH' || c.hasDiscrepancy
  ).length;
  const scannedViaMobile = citizens.filter((c) => c.collectedViaDevice === 'SmartPhone').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/50 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Sáng kiến cấp Xã/Phường
              </span>
              <span className="text-xs text-slate-400">
                Đăng nhập: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.roleTitle})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Trung Tâm Chỉ Huy & Rà Soát Nguồn Nghĩa Vụ Quân Sự Năm 2026
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              Hệ thống áp dụng thiết bị đầu cuối thông minh thu thập dữ liệu hồ sơ công dân, kết hợp nhận dạng OCR,
              đối chiếu liên ngành với 6 cơ sở dữ liệu và tự động phân loại theo Luật Nghĩa vụ quân sự.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('mobile-ocr')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-900/40 transition active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>Quét OCR Hồ Sơ Mới</span>
            </button>
            <button
              onClick={onOpenNewCitizen}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Nhập Thủ Công</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Tổng nguồn quản lý</span>
            <Users className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{total}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Độ tuổi 18 - 27</span>
              <span className="text-emerald-400 font-medium">100%</span>
            </div>
          </div>
        </div>

        {/* Mobile Scanned */}
        <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Số hóa qua Smartphone</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{scannedViaMobile}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>OCR chính xác cao</span>
              <span className="text-emerald-300 font-medium">{Math.round((scannedViaMobile / total) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Qualified */}
        <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-700/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-medium">Đủ điều kiện gọi khám</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{qualified}</div>
            <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center justify-between">
              <span>Nguồn sẵn sàng nhập ngũ</span>
              <span className="font-semibold">{Math.round((qualified / total) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Deferred */}
        <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-700/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-xs font-medium">Tạm hoãn gọi nhập ngũ</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{deferred}</div>
            <div className="text-[11px] text-amber-400/80 mt-1 flex items-center justify-between">
              <span>Học vấn / Sức khỏe / Gia cảnh</span>
              <span className="font-semibold">{Math.round((deferred / total) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Exempt */}
        <div className="bg-sky-950/30 rounded-xl p-4 border border-sky-700/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-300 mb-2">
            <span className="text-xs font-medium">Miễn gọi nhập ngũ</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-300">{exempt}</div>
            <div className="text-[11px] text-sky-400/80 mt-1 flex items-center justify-between">
              <span>Chính sách / Con liệt sĩ</span>
              <span className="font-semibold">{Math.round((exempt / total) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Discrepancy Alert */}
        <div 
          onClick={() => onNavigateTab('cross-check')}
          className="bg-rose-950/40 hover:bg-rose-950/60 cursor-pointer rounded-xl p-4 border border-rose-700/60 shadow-md flex flex-col justify-between transition group"
        >
          <div className="flex items-center justify-between text-rose-300 mb-2">
            <span className="text-xs font-medium">Cảnh báo sai lệch</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{unverifiedOrDiscrepant}</div>
            <div className="text-[11px] text-rose-400/80 mt-1 flex items-center justify-between">
              <span>Cần xác minh đối chiếu</span>
              <span className="underline">Xem ngay &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Highlight Box if any */}
      {unverifiedOrDiscrepant > 0 && (
        <div className="bg-rose-900/20 border border-rose-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-rose-200">
                Phát hiện {unverifiedOrDiscrepant} trường hợp có sai lệch liên ngành cần xác minh
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Ví dụ: Công dân <strong className="text-rose-100">Vũ Đức Minh</strong> nộp giấy hoãn ĐH nhưng nhà trường báo đã thôi học;
                công dân <strong className="text-rose-100">Nguyễn Tiến Dũng</strong> vắng mặt nơi cư trú quá 6 tháng.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('cross-check')}
            className="px-3.5 py-1.5 bg-rose-800/80 hover:bg-rose-700 text-rose-100 text-xs font-medium rounded-lg border border-rose-600 transition flex items-center gap-1.5 whitespace-nowrap self-end sm:self-auto"
          >
            <span>Mở Bàn Đối Chiếu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: 8-Step Lifecycle & Comparative Efficiency Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: 8-Step Operational Workflow (Quy trình 8 bước) */}
        <div className="lg:col-span-2 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Quy Trình 8 Bước Vận Hành Thực Tế (Sáng Kiến Ban CHQS Cấp Xã)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tiến độ đợt rà soát nguồn tuyển quân năm 2026 theo kế hoạch Hội đồng NVQS xã
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded-lg border border-emerald-700/60">
              Đang hoàn thiện (85%)
            </span>
          </div>

          <div className="space-y-2.5">
            {operationalSteps.map((step) => {
              const isCompleted = step.status === 'HOAN_THANH';
              const isInProgress = step.status === 'DANG_THUC_HIEN';

              return (
                <div
                  key={step.stepNumber}
                  className={`p-3 rounded-xl border transition flex items-start gap-3.5 ${
                    isCompleted
                      ? 'bg-slate-900/50 border-emerald-900/60'
                      : isInProgress
                      ? 'bg-amber-950/20 border-amber-600/50 shadow-sm'
                      : 'bg-slate-900/30 border-slate-800 text-slate-500'
                  }`}
                >
                  {/* Step Number Circle */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.stepNumber}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-semibold truncate ${isCompleted ? 'text-slate-200' : isInProgress ? 'text-amber-200' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isInProgress
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? 'Hoàn thành' : isInProgress ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{step.completionRate}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>Phụ trách: <strong className="text-slate-300">{step.assignedRole}</strong></span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-amber-400' : 'bg-slate-700'
                        }`}
                        style={{ width: `${step.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Bảng So Sánh Trước & Sau Áp Dụng Sáng Kiến */}
        <div className="space-y-4">
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg space-y-4">
            <div className="border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                Đánh Giá Hiệu Quả Thực Tế
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                So Sánh Trước & Sau Khi Áp Dụng
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Căn cứ thực nghiệm theo yêu cầu hồ sơ sáng kiến cải tiến kỹ thuật
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Item 1: Thời gian số hóa */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/70 space-y-1.5">
                <div className="font-semibold text-slate-200">1. Thời gian thu thập 1 hồ sơ công dân:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-red-950/40 p-2 rounded border border-red-900/40">
                    <span className="text-red-400 block font-medium">Trước áp dụng:</span>
                    <span className="text-slate-300 font-bold">25 - 30 phút</span> (ghi chép thủ công giấy tờ)
                  </div>
                  <div className="bg-emerald-950/50 p-2 rounded border border-emerald-800/50">
                    <span className="text-emerald-400 block font-medium">Sau áp dụng:</span>
                    <span className="text-emerald-300 font-bold">2 - 3 phút</span> (chụp OCR trên Smartphone)
                  </div>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium text-right">&rarr; Rút ngắn 90% thời gian</div>
              </div>

              {/* Item 2: Lập báo cáo tổng hợp */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/70 space-y-1.5">
                <div className="font-semibold text-slate-200">2. Thời gian tổng hợp danh sách cấp xã:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-red-950/40 p-2 rounded border border-red-900/40">
                    <span className="text-red-400 block font-medium">Trước áp dụng:</span>
                    <span className="text-slate-300 font-bold">3 - 5 ngày</span> (cán bộ cộng tay từng thôn)
                  </div>
                  <div className="bg-emerald-950/50 p-2 rounded border border-emerald-800/50">
                    <span className="text-emerald-400 block font-medium">Sau áp dụng:</span>
                    <span className="text-emerald-300 font-bold">15 giây</span> (tổng hợp 6 bảng tự động)
                  </div>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium text-right">&rarr; Nhanh gấp 300 lần</div>
              </div>

              {/* Item 3: Độ chính xác & Phát hiện sai lệch */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/70 space-y-1.5">
                <div className="font-semibold text-slate-200">3. Phát hiện sinh viên thôi học / tạm vắng:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-red-950/40 p-2 rounded border border-red-900/40">
                    <span className="text-red-400 block font-medium">Trước áp dụng:</span>
                    <span className="text-slate-300">Dễ bỏ sót</span> do chỉ nhìn giấy nộp ban đầu
                  </div>
                  <div className="bg-emerald-950/50 p-2 rounded border border-emerald-800/50">
                    <span className="text-emerald-400 block font-medium">Sau áp dụng:</span>
                    <span className="text-emerald-300 font-bold">Đối chiếu trực tiếp</span> CSDL trường học
                  </div>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium text-right">&rarr; Nâng cao chất lượng tuyển quân</div>
              </div>

              {/* Item 4: Chi phí đầu tư */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/70 space-y-1.5">
                <div className="font-semibold text-slate-200">4. Chi phí đầu tư trang thiết bị:</div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  Tận dụng <strong className="text-emerald-300">100% điện thoại thông minh sẵn có</strong> của cán bộ quân sự, công an, tổ trưởng TDP. Không cần trang bị thêm máy scan chuyên dụng đắt tiền.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigator */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700/80 shadow space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Truy Cập Nhanh Nhóm Chức Năng
              </h4>
              <span className="text-[10px] text-amber-300 font-mono">100/100 Tính Năng</span>
            </div>

            <button
              onClick={() => onNavigateTab('feature-catalog')}
              className="w-full p-2.5 bg-gradient-to-r from-amber-600/30 to-amber-950/40 hover:from-amber-600/40 hover:to-amber-950/60 rounded-xl border border-amber-600/50 text-left transition flex items-center justify-between text-amber-200 text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Xem Bảng Đặc Tả 100 Tính Năng</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('registration-age17')}
                className="p-2 bg-slate-850 hover:bg-slate-750 rounded-xl border border-slate-700 text-left transition text-slate-200"
              >
                <div className="text-emerald-400 font-semibold text-[11px]">Nhóm IV</div>
                <div className="font-bold text-xs">Đăng Ký Tuổi 17</div>
              </button>

              <button
                onClick={() => onNavigateTab('council-plan')}
                className="p-2 bg-slate-850 hover:bg-slate-750 rounded-xl border border-slate-700 text-left transition text-slate-200"
              >
                <div className="text-sky-400 font-semibold text-[11px]">Nhóm V</div>
                <div className="font-bold text-xs">Hội Đồng & Kế Hoạch</div>
              </button>

              <button
                onClick={() => onNavigateTab('violations')}
                className="p-2 bg-slate-850 hover:bg-slate-750 rounded-xl border border-slate-700 text-left transition text-slate-200"
              >
                <div className="text-rose-400 font-semibold text-[11px]">Nhóm VIII</div>
                <div className="font-bold text-xs">Xử Lý Vi Phạm</div>
              </button>

              <button
                onClick={() => onNavigateTab('legal-kb')}
                className="p-2 bg-slate-850 hover:bg-slate-750 rounded-xl border border-slate-700 text-left transition text-slate-200"
              >
                <div className="text-purple-400 font-semibold text-[11px]">Nhóm XI</div>
                <div className="font-bold text-xs">Kho Văn Bản Luật</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
