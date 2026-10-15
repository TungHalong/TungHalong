import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, AlertTriangle, Clock, 
  Building2, GraduationCap, HeartPulse, User, Phone, MapPin, 
  Calendar, FileText, CheckCircle2
} from 'lucide-react';
import { CitizenRecord, UserAccount, MilitaryStatus, HealthGrade, ResidenceStatus } from '../types';

interface CitizenDetailModalProps {
  citizen: CitizenRecord;
  onClose: () => void;
  onUpdate: (updated: CitizenRecord) => void;
  currentUser: UserAccount;
}

export const CitizenDetailModal: React.FC<CitizenDetailModalProps> = ({
  citizen,
  onClose,
  onUpdate,
  currentUser,
}) => {
  const [formData, setFormData] = useState<CitizenRecord>({ ...citizen });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...formData,
      statusApprovedBy: currentUser.roleTitle.includes('Chỉ huy') ? currentUser.name : formData.statusApprovedBy,
      statusApprovedDate: new Date().toISOString().substring(0, 10),
    });
    setIsEditing(false);
    alert('Đã cập nhật thông tin hồ sơ thành công!');
  };

  const handleQuickApprove = (newStatus: MilitaryStatus, reason: string) => {
    const updated = {
      ...formData,
      status: newStatus,
      statusReason: reason,
      hasDiscrepancy: false,
      discrepancyDetails: [],
      statusApprovedBy: currentUser.name,
      statusApprovedDate: new Date().toISOString().substring(0, 10),
    };
    setFormData(updated);
    onUpdate(updated);
    alert(`Đã phê duyệt trạng thái: ${newStatus}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="bg-slate-850 px-6 py-4 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-sm">
              MS
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{formData.fullName}</h3>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {formData.id}
                </span>
                <span className="text-xs text-slate-400">CCCD: {formData.cccd}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {formData.hamlet} • {formData.age} tuổi (Năm sinh {formData.birthDate}) • Thu thập qua: {formData.collectedViaDevice} ({formData.ocrConfidence}%)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 space-y-6 text-xs">
          {/* Discrepancy Alert Banner if any */}
          {formData.hasDiscrepancy && (
            <div className="p-4 bg-rose-950/40 border border-rose-700 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>CẢNH BÁO SAI LỆCH CƠ SỞ DỮ LIỆU LIÊN NGÀNH:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-rose-200">
                {formData.discrepancyDetails?.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickApprove('DU_DIEU_KIEN', 'Đã xác minh và kết luận đủ điều kiện nhập ngũ')}
                  className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-semibold rounded-lg transition"
                >
                  Xác nhận sai lệch & Chuyển thành Đủ điều kiện gọi khám
                </button>
              </div>
            </div>
          )}

          {/* Section 1: Nhân thân & Cư trú */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-2">
              <User className="w-4 h-4 text-emerald-400" />
              1. Thông Tin Nhân Thân & Cư Trú (Bảng 01 & Bảng 04)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block">Họ và tên:</span>
                <strong className="text-white text-sm">{formData.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Ngày sinh:</span>
                <span className="font-mono text-slate-200">{formData.birthDate} ({formData.age} tuổi)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Số CCCD / ĐT:</span>
                <span className="font-mono text-slate-200">{formData.cccd} • {formData.phone}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block">Nơi thường trú:</span>
                <span className="text-slate-200">{formData.permanentAddress} ({formData.hamlet})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Trạng thái cư trú:</span>
                <span className="font-semibold text-amber-300">{formData.residenceStatus}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Học vấn & Chuyên môn kỹ thuật */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              2. Trình Độ Học Vấn & Chuyên Môn Kỹ Thuật (Bảng 02 & Bảng 03)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block">Trình độ đào tạo:</span>
                <strong className="text-white">{formData.educationLevel}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Cơ sở đào tạo:</span>
                <span className="text-slate-200">{formData.schoolName || 'Chưa cập nhật'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Ngành học / Chuyên môn:</span>
                <span className="text-slate-200">{formData.major || 'Phổ thông'}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Đang là sinh viên ĐH/CĐ?</span>
                <span className="font-semibold text-emerald-400">
                  {formData.isStudentCurrently ? 'CÓ (Đang học chính quy)' : 'KHÔNG (Đã tốt nghiệp hoặc thôi học)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Mã số sinh viên:</span>
                <span className="font-mono text-slate-300">{formData.studentCardId || 'Không có'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Năm tốt nghiệp:</span>
                <span className="font-mono text-slate-300">{formData.graduationYear || '2023'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Sức khỏe & Chính sách */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              3. Tình Trạng Sức Khỏe & Hoàn Cảnh Gia Đình
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block">Phân loại thể lực (TT 105):</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold inline-block mt-0.5">
                  {formData.healthGrade}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Chiều cao / Cân nặng:</span>
                <span className="text-slate-200">{formData.heightCm || 170} cm • {formData.weightKg || 60} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block">Khúc xạ mắt:</span>
                <span className="text-slate-200">
                  Trái: {formData.eyeRefractionLeft || 0}D • Phải: {formData.eyeRefractionRight || 0}D
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block">Chính sách ưu đãi:</span>
                <span className="text-amber-300 font-semibold">{formData.policyCategory || 'Bình thường'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Ghi chú sức khỏe:</span>
                <span className="text-slate-300">{formData.healthNote || 'Bình thường'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Đối chiếu liên ngành 6 nguồn */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              4. Kết Quả Đối Chiếu 6 Cơ Sở Dữ Liệu Chuyên Ngành (Bảng 05)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">CSDL Dân cư (Công An):</span>
                  <span className={`font-bold ${formData.crossCheckResults.policeCitizenDb === 'KHOP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formData.crossCheckResults.policeCitizenDb}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{formData.crossCheckResults.policeNote || 'Khớp nơi cư trú'}</p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">CSDL Trường ĐH/CĐ:</span>
                  <span className={`font-bold ${formData.crossCheckResults.universityCollegeDb === 'KHOP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formData.crossCheckResults.universityCollegeDb}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{formData.crossCheckResults.universityNote || 'Đã kiểm tra'}</p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">CSDL Doanh nghiệp & BHXH:</span>
                  <span className="font-bold text-emerald-400">
                    {formData.crossCheckResults.enterpriseTaxDb}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{formData.crossCheckResults.enterpriseNote || 'Khớp'}</p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">CSDL Y tế & Sơ tuyển:</span>
                  <span className="font-bold text-emerald-400">
                    {formData.crossCheckResults.healthDeptDb}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{formData.crossCheckResults.healthNote || 'Khớp'}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Quyết định phân loại hiện tại */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-4 rounded-xl border border-emerald-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 uppercase tracking-wider">
                Kết Luận Phân Loại Hiện Tại (Hội Đồng NVQS Cấp Xã):
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700 font-bold">
                {formData.status}
              </span>
            </div>
            <p className="text-slate-200">
              <strong>Lý do:</strong> {formData.statusReason}
            </p>
            {formData.statusApprovedBy && (
              <p className="text-slate-400 text-[11px]">
                Người phê duyệt: <strong className="text-slate-200">{formData.statusApprovedBy}</strong> ({formData.statusApprovedDate})
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-850 px-6 py-4 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickApprove('DU_DIEU_KIEN', 'Đủ tiêu chuẩn chính trị, sức khỏe và độ tuổi theo Luật NVQS')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition"
            >
              Duyệt: Đủ Điều Kiện Gọi Khám
            </button>
            <button
              type="button"
              onClick={() => handleQuickApprove('TAM_HOAN_HOC_VAN', 'Tạm hoãn theo Điểm g Khoản 1 Điều 41 Luật NVQS')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition"
            >
              Duyệt: Tạm Hoãn
            </button>
            <button
              type="button"
              onClick={() => handleQuickApprove('MIEN_GOI', 'Miễn gọi nhập ngũ theo Khoản 2 Điều 41 Luật NVQS')}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold transition"
            >
              Duyệt: Miễn Gọi
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
