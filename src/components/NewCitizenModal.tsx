import React, { useState } from 'react';
import { X, Check, UserPlus } from 'lucide-react';
import { CitizenRecord, UserAccount, EducationLevel, HealthGrade, ResidenceStatus } from '../types';

interface NewCitizenModalProps {
  onClose: () => void;
  onSave: (citizen: CitizenRecord) => void;
  currentUser: UserAccount;
  existingCount: number;
}

export const NewCitizenModal: React.FC<NewCitizenModalProps> = ({
  onClose,
  onSave,
  currentUser,
  existingCount,
}) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('2005-01-01');
  const [cccd, setCccd] = useState('');
  const [phone, setPhone] = useState('');
  const [hamlet, setHamlet] = useState('Tổ dân phố 1');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('THPT_12_12');
  const [schoolName, setSchoolName] = useState('THPT Đại Đồng');
  const [major, setMajor] = useState('');
  const [isStudentCurrently, setIsStudentCurrently] = useState(false);
  const [residenceStatus, setResidenceStatus] = useState<ResidenceStatus>('THUONG_TRU_CO_MAT');
  const [healthGrade, setHealthGrade] = useState<HealthGrade>('LOAI_1');
  const [policyCategory, setPolicyCategory] = useState<'BinhThuong' | 'ConLietSi' | 'ConThuongBinh' | 'LaoDongDuyNhat'>('BinhThuong');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !cccd) {
      alert('Vui lòng nhập Họ tên và Số CCCD!');
      return;
    }

    const birthYear = new Date(birthDate).getFullYear();
    const age = 2026 - birthYear;
    const newId = `MS-2026-${String(existingCount + 1).padStart(3, '0')}`;

    let autoStatus: CitizenRecord['status'] = 'DU_DIEU_KIEN';
    let autoReason = 'Đủ tiêu chuẩn văn hóa, sức khỏe và độ tuổi theo quy định';

    if (isStudentCurrently) {
      autoStatus = 'TAM_HOAN_HOC_VAN';
      autoReason = 'Tạm hoãn học vấn theo Điểm g Khoản 1 Điều 41 Luật NVQS';
    } else if (healthGrade === 'LOAI_4' || healthGrade === 'LOAI_5' || healthGrade === 'LOAI_6') {
      autoStatus = 'TAM_HOAN_SUC_KHOE';
      autoReason = 'Tạm hoãn sức khỏe theo Điểm a Khoản 1 Điều 41 Luật NVQS';
    } else if (policyCategory === 'ConLietSi') {
      autoStatus = 'MIEN_GOI';
      autoReason = 'Miễn gọi nhập ngũ theo Điểm a Khoản 2 Điều 41 Luật NVQS';
    }

    const newCitizen: CitizenRecord = {
      id: newId,
      fullName: fullName.toUpperCase().trim(),
      birthDate,
      age,
      gender: 'Nam',
      cccd,
      phone: phone || '0912000000',
      ethnicity: 'Kinh',
      religion: 'Không',
      hamlet,
      ward: 'Xã Đại Đồng',
      permanentAddress: permanentAddress || `Xã Đại Đồng, ${hamlet}`,
      educationLevel,
      schoolName,
      major,
      graduationYear: 2024,
      isStudentCurrently,
      residenceStatus,
      residenceVerifiedDate: '2026-10-14',
      residenceVerifier: currentUser.name,
      healthGrade,
      heightCm: 172,
      weightKg: 63,
      policyCategory,
      status: autoStatus,
      statusReason: autoReason,
      collectedViaDevice: 'Desktop',
      collectorName: currentUser.name,
      collectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ocrConfidence: 100,
      syncStatus: 'DA_DONG_BO',
      crossCheckResults: {
        policeCitizenDb: 'KHOP',
        policeNote: 'Nhân thân chuẩn xác',
        enterpriseTaxDb: 'KHOP',
        highSchoolDb: 'KHOP',
        universityCollegeDb: isStudentCurrently ? 'CHUA_DOI_CHIEU' : 'KHOP',
        healthDeptDb: 'KHOP',
        socialPolicyDb: 'KHOP',
      },
      hasDiscrepancy: false,
    };

    onSave(newCitizen);
    alert(`Đã thêm thành công hồ sơ ${newCitizen.fullName} (${newCitizen.id})!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            Nhập Thủ Công Hồ Sơ Công Dân NVQS Mới
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Họ và tên công dân (viết hoa): *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value.toUpperCase())}
                placeholder="VD: TRẦN VĂN AN"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Ngày sinh: *</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Số CCCD: *</label>
              <input
                type="text"
                required
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                placeholder="001205xxxxxx"
                maxLength={12}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Số điện thoại:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912xxxxxx"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Thôn / Tổ dân phố:</label>
              <select
                value={hamlet}
                onChange={(e) => setHamlet(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Tổ dân phố 1">Tổ dân phố 1</option>
                <option value="Tổ dân phố 2">Tổ dân phố 2</option>
                <option value="Tổ dân phố 3">Tổ dân phố 3</option>
                <option value="Thôn Thượng">Thôn Thượng</option>
                <option value="Thôn Trung">Thôn Trung</option>
                <option value="Thôn Hạ">Thôn Hạ</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Trình độ học vấn:</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="THPT_12_12">12/12 THPT</option>
                <option value="DAI_HOC">Đại học</option>
                <option value="CAO_DANG">Cao đẳng</option>
                <option value="TRUNG_CAP">Trung cấp nghề</option>
                <option value="DUOI_12">Dưới lớp 12</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-300 font-medium">Nơi thường trú đầy đủ:</label>
              <input
                type="text"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder="Số nhà, ngõ xóm..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Sức khỏe TT 105:</label>
              <select
                value={healthGrade}
                onChange={(e) => setHealthGrade(e.target.value as HealthGrade)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="LOAI_1">Loại 1 (Rất tốt)</option>
                <option value="LOAI_2">Loại 2 (Tốt)</option>
                <option value="LOAI_3">Loại 3 (Khá)</option>
                <option value="LOAI_4">Loại 4 (Tật khúc xạ / Chưa đạt)</option>
                <option value="LOAI_5">Loại 5</option>
                <option value="LOAI_6">Loại 6</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Chính sách ưu đãi:</label>
              <select
                value={policyCategory}
                onChange={(e) => setPolicyCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="BinhThuong">Bình thường</option>
                <option value="ConLietSi">Con Liệt sĩ (Miễn gọi)</option>
                <option value="ConThuongBinh">Con Thương binh</option>
                <option value="LaoDongDuyNhat">Lao động duy nhất</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition"
            >
              Thêm Vào CSDL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
