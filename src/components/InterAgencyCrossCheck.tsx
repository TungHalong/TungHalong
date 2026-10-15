import React, { useState } from 'react';
import { 
  Building2, GraduationCap, HeartPulse, ShieldAlert, CheckCircle2, 
  AlertTriangle, RefreshCw, Briefcase, FileCheck, Search, Eye,
  ArrowRight, Check, X
} from 'lucide-react';
import { CitizenRecord, UserAccount } from '../types';

interface InterAgencyCrossCheckProps {
  citizens: CitizenRecord[];
  onUpdateCitizen: (updated: CitizenRecord) => void;
  onSelectCitizen: (citizen: CitizenRecord) => void;
  currentUser: UserAccount;
}

export const InterAgencyCrossCheck: React.FC<InterAgencyCrossCheckProps> = ({
  citizens,
  onUpdateCitizen,
  onSelectCitizen,
  currentUser,
}) => {
  const [activeAgency, setActiveAgency] = useState<'ALL' | 'POLICE' | 'ENTERPRISE' | 'UNIVERSITY' | 'HEALTH' | 'POLICY'>('ALL');
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [filterOnlyDiscrepancies, setFilterOnlyDiscrepancies] = useState(true);

  // Run full cross check simulation
  const handleRunFullCrossCheck = () => {
    setIsRunningCheck(true);
    setTimeout(() => {
      setIsRunningCheck(false);
      alert('Đã hoàn tất tiến trình đối chiếu liên ngành đồng bộ với 6 cơ sở dữ liệu! Phát hiện 2 hồ sơ có sai lệch cần xử lý.');
    }, 1200);
  };

  // Filter citizens based on active agency and discrepancy filter
  const targetCitizens = citizens.filter((c) => {
    if (filterOnlyDiscrepancies && !c.hasDiscrepancy) return false;
    if (activeAgency === 'POLICE' && c.crossCheckResults.policeCitizenDb === 'CHUA_DOI_CHIEU') return false;
    if (activeAgency === 'ENTERPRISE' && c.crossCheckResults.enterpriseTaxDb === 'CHUA_DOI_CHIEU') return false;
    if (activeAgency === 'UNIVERSITY' && c.crossCheckResults.universityCollegeDb === 'CHUA_DOI_CHIEU') return false;
    if (activeAgency === 'HEALTH' && c.crossCheckResults.healthDeptDb === 'CHUA_DOI_CHIEU') return false;
    if (activeAgency === 'POLICY' && c.crossCheckResults.socialPolicyDb === 'CHUA_DOI_CHIEU') return false;
    return true;
  });

  // Action: Resolve discrepancy by converting to QUALIFIED FOR DRAFT
  const handleResolveToDraft = (citizen: CitizenRecord) => {
    const updated: CitizenRecord = {
      ...citizen,
      hasDiscrepancy: false,
      status: 'DU_DIEU_KIEN',
      statusReason: 'Đã xác minh liên ngành: Kết luận đủ điều kiện và đưa vào danh sách gọi khám NVQS',
      statusApprovedBy: currentUser.name,
      statusApprovedDate: new Date().toISOString().substring(0, 10),
      crossCheckResults: {
        ...citizen.crossCheckResults,
        universityCollegeDb: 'KHOP',
        universityNote: 'Đã lập biên bản làm việc với gia đình; công nhận thôi học và chuyển sang nguồn gọi khám.',
        policeCitizenDb: 'KHOP',
        policeNote: 'Công an xã đã lập biên bản triệu tập công dân về địa phương khám sơ tuyển.',
      },
      discrepancyDetails: [],
    };
    onUpdateCitizen(updated);
    alert(`Đã giải quyết sai lệch cho hồ sơ ${citizen.fullName} (${citizen.id}) & chuyển sang trạng thái ĐỦ ĐIỀU KIỆN GỌI KHÁM!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <Building2 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Trung Tâm Đối Chiếu Dữ Liệu Liên Ngành (6 Cơ Sở Dữ Liệu)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Trọng tâm sáng kiến kỹ thuật: Chuyển từ rà soát giấy tờ đơn lẻ sang đối chiếu chéo tự động với
            Công an (Dân cư), Trường ĐH/CĐ (Học vấn), Doanh nghiệp/BHXH (Lao động), Trạm Y tế và Lao động - TBXH.
          </p>
        </div>

        <button
          onClick={handleRunFullCrossCheck}
          disabled={isRunningCheck}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95 whitespace-nowrap self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningCheck ? 'animate-spin' : ''}`} />
          <span>{isRunningCheck ? 'Đang Chạy Đối Chiếu...' : 'Tự Động Đối Chiếu 6 CSDL'}</span>
        </button>
      </div>

      {/* 6 Agency Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveAgency('ALL')}
          className={`p-3 rounded-xl border text-left transition ${
            activeAgency === 'ALL'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-emerald-400 font-mono uppercase">Tổng hợp</div>
          <div className="text-xs font-bold mt-1">Toàn bộ 6 CSDL</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Mọi nguồn phối hợp</div>
        </button>

        <button
          onClick={() => setActiveAgency('POLICE')}
          className={`p-3 rounded-xl border text-left transition ${
            activeAgency === 'POLICE'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-amber-400 font-mono uppercase">CSDL Dân Cư</div>
          <div className="text-xs font-bold mt-1">Công An Xã/Huyện</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Nhân thân & cư trú</div>
        </button>

        <button
          onClick={() => setActiveAgency('UNIVERSITY')}
          className={`p-3 rounded-xl border text-left transition ${
            activeAgency === 'UNIVERSITY'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-sky-400 font-mono uppercase">Trường ĐH / CĐ</div>
          <div className="text-xs font-bold mt-1">Học Vấn & Sinh Viên</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Kiểm tra thôi học/bảo lưu</div>
        </button>

        <button
          onClick={() => setActiveAgency('ENTERPRISE')}
          className={`p-3 rounded-xl border text-left transition ${
            activeAgency === 'ENTERPRISE'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-purple-400 font-mono uppercase">Doanh Nghiệp / BHXH</div>
          <div className="text-xs font-bold mt-1">Lao Động & KCN</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Đi làm ăn xa</div>
        </button>

        <button
          onClick={() => setActiveAgency('HEALTH')}
          className={`p-3 rounded-xl border text-left transition ${
            activeAgency === 'HEALTH'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-rose-400 font-mono uppercase">Cơ Sở Y Tế</div>
          <div className="text-xs font-bold mt-1">Sức Khỏe & Thể Lực</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Thông tư 105 BQP</div>
        </button>

        <button
          onClick={() => setActiveAgency('POLICY')}
          className={`p-3 rounded-xl border text-left transition ${
            activeAgency === 'POLICY'
              ? 'bg-emerald-950/80 border-emerald-500 text-white font-semibold shadow'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="text-[10px] text-emerald-400 font-mono uppercase">Lao Động - TBXH</div>
          <div className="text-xs font-bold mt-1">Chính Sách Xã Hội</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Con liệt sĩ, TB, khó khăn</div>
        </button>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="onlyDiscrepancies"
            checked={filterOnlyDiscrepancies}
            onChange={(e) => setFilterOnlyDiscrepancies(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
          />
          <label htmlFor="onlyDiscrepancies" className="text-slate-300 cursor-pointer select-none font-medium">
            Chỉ hiển thị các hồ sơ <span className="text-rose-400 font-bold">CÓ CẢNH BÁO SAI LỆCH</span> cần xử lý
          </label>
        </div>

        <div className="text-slate-400">
          Tìm thấy <strong className="text-slate-200">{targetCitizens.length}</strong> hồ sơ
        </div>
      </div>

      {/* Comparison & Resolution Cards */}
      <div className="space-y-4">
        {targetCitizens.length === 0 ? (
          <div className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700/80 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">
              Không có sai lệch nào trong bộ lọc hiện tại!
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Dữ liệu thu thập từ cơ sở đã hoàn toàn trùng khớp với các nguồn dữ liệu chuyên ngành hoặc đã được cán bộ giải quyết.
            </p>
          </div>
        ) : (
          targetCitizens.map((citizen) => (
            <div
              key={citizen.id}
              className="bg-slate-800/90 rounded-2xl border border-rose-800/60 shadow-xl overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-rose-950/40 px-5 py-3 border-b border-rose-900/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center justify-center font-mono font-bold text-xs">
                    !
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{citizen.fullName}</h4>
                      <span className="font-mono text-xs text-emerald-400 font-semibold">{citizen.id}</span>
                      <span className="text-xs text-slate-400">CCCD: {citizen.cccd}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {citizen.hamlet}
                      </span>
                    </div>
                    <p className="text-xs text-rose-300 font-medium mt-0.5">
                      Cảnh báo: Phát hiện thông tin không thống nhất giữa hồ sơ thu thập và cơ sở dữ liệu xác minh
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCitizen(citizen)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Toàn Bộ Hồ Sơ</span>
                </button>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left Side: Citizen Stated / Submitted */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/80 space-y-2">
                  <div className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <span>1. Thông tin công dân khai báo / Giấy tờ nộp:</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <div>
                      <span className="text-slate-500">Học vấn / Trạng thái:</span>{' '}
                      <strong className="text-white">
                        {citizen.educationLevel} - {citizen.schoolName || 'Không'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Khai báo sinh viên:</span>{' '}
                      <span>{citizen.isStudentCurrently ? 'Đang theo học đại học chính quy' : 'Không'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Nơi cư trú khai:</span>{' '}
                      <span>{citizen.permanentAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Hiện diện thực tế:</span>{' '}
                      <span className="font-medium text-amber-300">{citizen.residenceStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Verified Database Results */}
                <div className="bg-rose-950/20 rounded-xl p-4 border border-rose-800/40 space-y-2">
                  <div className="font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-900/40 pb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>2. Kết quả đối chiếu từ CSDL cơ quan chuyên môn:</span>
                  </div>
                  <div className="space-y-2 text-rose-200">
                    {citizen.crossCheckResults.universityCollegeDb === 'LECH' && (
                      <div className="bg-rose-950/60 p-2.5 rounded-lg border border-rose-700/60">
                        <strong className="text-rose-100 block">CSDL Trường ĐH/CĐ:</strong>
                        <p className="mt-0.5 leading-relaxed">{citizen.crossCheckResults.universityNote}</p>
                      </div>
                    )}

                    {citizen.crossCheckResults.policeCitizenDb === 'LECH' && (
                      <div className="bg-rose-950/60 p-2.5 rounded-lg border border-rose-700/60">
                        <strong className="text-rose-100 block">CSDL Dân Cư (Công An Xã):</strong>
                        <p className="mt-0.5 leading-relaxed">{citizen.crossCheckResults.policeNote}</p>
                      </div>
                    )}

                    {citizen.discrepancyDetails && citizen.discrepancyDetails.length > 0 && (
                      <div className="text-[11px] text-slate-300 space-y-1">
                        <span className="font-semibold text-rose-300">Biện pháp xử lý nghiệp vụ:</span>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {citizen.discrepancyDetails.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Resolution Footer */}
              <div className="bg-slate-850 px-5 py-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-400">
                  Thẩm quyền giải quyết: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.roleTitle})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveToDraft(citizen)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Xác Nhận Sai Lệch & Chuyển Sang Gọi Khám NVQS</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
