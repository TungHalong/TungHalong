import React, { useState } from 'react';
import { 
  Camera, Upload, Check, AlertCircle, RefreshCw, FileText, 
  Smartphone, Eye, ShieldCheck, Sparkles, CheckCircle2,
  HardDrive, AlertTriangle, ArrowRight
} from 'lucide-react';
import { CitizenRecord, UserAccount, EducationLevel, HealthGrade, ResidenceStatus } from '../types';
import { SAMPLE_OCR_TEMPLATES } from '../data/mockData';

interface MobileTerminalOCRProps {
  onSaveCitizen: (citizen: CitizenRecord) => void;
  existingCitizens: CitizenRecord[];
  currentUser: UserAccount;
  onNavigateTab: (tab: string) => void;
}

export const MobileTerminalOCR: React.FC<MobileTerminalOCRProps> = ({
  onSaveCitizen,
  existingCitizens,
  currentUser,
  onNavigateTab,
}) => {
  // Scanner state
  const [docType, setDocType] = useState<'CCCD' | 'GIAY_SINH_VIEN' | 'BANG_CAP' | 'Y_TE'>('CCCD');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<CitizenRecord[]>([]);

  // Form Fields
  const [formData, setFormData] = useState<{
    fullName: string;
    birthDate: string;
    cccd: string;
    phone: string;
    ethnicity: string;
    religion: string;
    hamlet: string;
    permanentAddress: string;
    temporaryAddress: string;
    educationLevel: EducationLevel;
    schoolName: string;
    major: string;
    graduationYear: number;
    isStudentCurrently: boolean;
    studentCardId: string;
    residenceStatus: ResidenceStatus;
    residenceNote: string;
    healthGrade: HealthGrade;
    heightCm: number;
    weightKg: number;
    eyeRefractionLeft: number;
    eyeRefractionRight: number;
    healthNote: string;
    policyCategory: 'BinhThuong' | 'ConLietSi' | 'ConThuongBinh' | 'LaoDongDuyNhat' | 'HoNgheo' | 'KhuyetTat';
    familyNote: string;
  }>({
    fullName: '',
    birthDate: '',
    cccd: '',
    phone: '',
    ethnicity: 'Kinh',
    religion: 'Không',
    hamlet: 'Tổ dân phố 1',
    permanentAddress: '',
    temporaryAddress: '',
    educationLevel: 'THPT_12_12',
    schoolName: '',
    major: '',
    graduationYear: 2024,
    isStudentCurrently: false,
    studentCardId: '',
    residenceStatus: 'THUONG_TRU_CO_MAT',
    residenceNote: 'Thường trú tại địa phương',
    healthGrade: 'LOAI_1',
    heightCm: 170,
    weightKg: 62,
    eyeRefractionLeft: 0,
    eyeRefractionRight: 0,
    healthNote: '',
    policyCategory: 'BinhThuong',
    familyNote: '',
  });

  // Calculate age
  const calculateAge = (bDate: string) => {
    if (!bDate) return 0;
    const birthYear = new Date(bDate).getFullYear();
    const currentYear = 2026; // Assessment year
    return currentYear - birthYear;
  };

  const calculatedAge = calculateAge(formData.birthDate);

  // Check duplicate CCCD
  const duplicateCitizen = existingCitizens.find((c) => c.cccd && c.cccd === formData.cccd);

  // Trigger OCR with sample template
  const handleLoadSample = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      const template = SAMPLE_OCR_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          ...template.data,
          temporaryAddress: template.data.permanentAddress,
        }));
        setOcrConfidence(98);
        setScanSuccess(true);
      }
      setIsScanning(false);
    }, 1200);
  };

  // Mock Camera Scanning
  const handleSimulateCameraCapture = () => {
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      // Create realistic Vietnamese citizen info
      const randomId = Math.floor(100000 + Math.random() * 900000);
      setFormData({
        fullName: 'TRẦN VĂN ANH TUẤN',
        birthDate: '2005-05-14',
        cccd: `001205${randomId}`,
        phone: '0978' + Math.floor(100000 + Math.random() * 900000),
        ethnicity: 'Kinh',
        religion: 'Không',
        hamlet: 'Thôn Thượng',
        permanentAddress: 'Xóm 2, Thôn Thượng, Xã Đại Đồng',
        temporaryAddress: 'Xóm 2, Thôn Thượng, Xã Đại Đồng',
        educationLevel: 'THPT_12_12',
        schoolName: 'THPT Đại Đồng',
        major: '',
        graduationYear: 2023,
        isStudentCurrently: false,
        studentCardId: '',
        residenceStatus: 'THUONG_TRU_CO_MAT',
        residenceNote: 'Đã xác minh có mặt tại địa phương',
        healthGrade: 'LOAI_1',
        heightCm: 172,
        weightKg: 64,
        eyeRefractionLeft: 0,
        eyeRefractionRight: 0,
        healthNote: 'Thể lực tốt, mắt 10/10',
        policyCategory: 'BinhThuong',
        familyNote: '',
      });
      setOcrConfidence(96);
      setScanSuccess(true);
      setIsScanning(false);
    }, 1500);
  };

  // Save Record
  const handleSave = () => {
    if (!formData.fullName || !formData.cccd) {
      alert('Vui lòng điền đủ Họ và tên và Số Căn cước công dân!');
      return;
    }

    if (duplicateCitizen) {
      if (!confirm(`Cảnh báo: Số CCCD ${formData.cccd} đã tồn tại trong CSDL cho công dân ${duplicateCitizen.fullName}. Bạn có chắc chắn muốn lưu tiếp?`)) {
        return;
      }
    }

    const nextIdNumber = existingCitizens.length + 1;
    const newId = `MS-2026-${String(nextIdNumber).padStart(3, '0')}`;

    // Determine default status
    let autoStatus: CitizenRecord['status'] = 'DU_DIEU_KIEN';
    let autoReason = 'Đủ tiêu chuẩn văn hóa, sức khỏe và độ tuổi theo quy định';

    if (formData.isStudentCurrently && formData.educationLevel === 'DAI_HOC') {
      autoStatus = 'TAM_HOAN_HOC_VAN';
      autoReason = 'Tạm hoãn học vấn theo Điểm g Khoản 1 Điều 41 Luật NVQS';
    } else if (formData.healthGrade === 'LOAI_4' || formData.healthGrade === 'LOAI_5' || formData.healthGrade === 'LOAI_6') {
      autoStatus = 'TAM_HOAN_SUC_KHOE';
      autoReason = 'Tạm hoãn sức khỏe theo Điểm a Khoản 1 Điều 41 Luật NVQS';
    } else if (formData.policyCategory === 'ConLietSi') {
      autoStatus = 'MIEN_GOI';
      autoReason = 'Miễn gọi nhập ngũ theo Điểm a Khoản 2 Điều 41 Luật NVQS';
    } else if (formData.policyCategory === 'LaoDongDuyNhat') {
      autoStatus = 'TAM_HOAN_HOAN_CANH';
      autoReason = 'Tạm hoãn theo Điểm b Khoản 1 Điều 41 Luật NVQS';
    }

    const newCitizen: CitizenRecord = {
      id: newId,
      fullName: formData.fullName.toUpperCase().trim(),
      birthDate: formData.birthDate,
      age: calculatedAge,
      gender: 'Nam',
      cccd: formData.cccd,
      phone: formData.phone,
      ethnicity: formData.ethnicity,
      religion: formData.religion,
      hamlet: formData.hamlet,
      ward: 'Xã Đại Đồng',
      permanentAddress: formData.permanentAddress,
      temporaryAddress: formData.temporaryAddress,
      educationLevel: formData.educationLevel,
      schoolName: formData.schoolName,
      major: formData.major,
      graduationYear: formData.graduationYear,
      isStudentCurrently: formData.isStudentCurrently,
      studentCardId: formData.studentCardId,
      residenceStatus: formData.residenceStatus,
      residenceNote: formData.residenceNote,
      residenceVerifiedDate: '2026-10-14',
      residenceVerifier: currentUser.name,
      healthGrade: formData.healthGrade,
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      eyeRefractionLeft: formData.eyeRefractionLeft,
      eyeRefractionRight: formData.eyeRefractionRight,
      healthNote: formData.healthNote,
      policyCategory: formData.policyCategory,
      familyNote: formData.familyNote,
      status: autoStatus,
      statusReason: autoReason,
      statusApprovedBy: currentUser.roleTitle.includes('Chỉ huy') ? currentUser.name : undefined,
      collectedViaDevice: 'SmartPhone',
      collectorName: currentUser.name,
      collectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ocrConfidence: ocrConfidence || 95,
      syncStatus: isOfflineMode ? 'CHO_DONG_BO' : 'DA_DONG_BO',
      crossCheckResults: {
        policeCitizenDb: 'KHOP',
        policeNote: 'Khớp số CCCD và địa chỉ thường trú',
        enterpriseTaxDb: 'CHUA_DOI_CHIEU',
        highSchoolDb: 'KHOP',
        highSchoolNote: 'Tốt nghiệp THPT',
        universityCollegeDb: formData.isStudentCurrently ? 'CHUA_DOI_CHIEU' : 'KHOP',
        healthDeptDb: 'KHOP',
        healthNote: 'Đạt sơ tuyển trạm y tế',
        socialPolicyDb: formData.policyCategory === 'BinhThuong' ? 'KHOP' : 'CHUA_DOI_CHIEU',
      },
      hasDiscrepancy: false,
    };

    if (isOfflineMode) {
      setOfflineQueue((prev) => [newCitizen, ...prev]);
      alert(`Đã lưu ngoại tuyến hồ sơ ${newCitizen.fullName} (${newCitizen.id}) vào bộ nhớ thiết bị. Sẽ đồng bộ khi có mạng!`);
    } else {
      onSaveCitizen(newCitizen);
      alert(`Đã lưu thành công hồ sơ ${newCitizen.fullName} (${newCitizen.id}) và đồng bộ về CSDL Ban CHQS Xã!`);
    }

    // Reset Form
    setFormData({
      fullName: '',
      birthDate: '',
      cccd: '',
      phone: '',
      ethnicity: 'Kinh',
      religion: 'Không',
      hamlet: 'Tổ dân phố 1',
      permanentAddress: '',
      temporaryAddress: '',
      educationLevel: 'THPT_12_12',
      schoolName: '',
      major: '',
      graduationYear: 2024,
      isStudentCurrently: false,
      studentCardId: '',
      residenceStatus: 'THUONG_TRU_CO_MAT',
      residenceNote: '',
      healthGrade: 'LOAI_1',
      heightCm: 170,
      weightKg: 62,
      eyeRefractionLeft: 0,
      eyeRefractionRight: 0,
      healthNote: '',
      policyCategory: 'BinhThuong',
      familyNote: '',
    });
    setScanSuccess(false);
    setSelectedTemplate(null);
  };

  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    offlineQueue.forEach((c) => onSaveCitizen(c));
    alert(`Đã đồng bộ thành công ${offlineQueue.length} hồ sơ ngoại tuyến về máy chủ!`);
    setOfflineQueue([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <Smartphone className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Phân Hệ Thu Thập Bằng Thiết Bị Đầu Cuối Thông Minh & Quét OCR
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Cán bộ sử dụng điện thoại thông minh chụp quét Căn cước công dân, bằng cấp và giấy tờ tùy thân.
            Hệ thống nhận dạng ký tự quang học (OCR), chuẩn hóa và kiểm tra đối chiếu thời gian thực.
          </p>
        </div>

        {/* Offline Queue Badge & Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              isOfflineMode
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Chế độ Ngoại Tuyến (Offline): {isOfflineMode ? 'BẬT' : 'TẮT'}</span>
          </button>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleSyncOfflineQueue}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md animate-bounce"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đồng bộ ngay ({offlineQueue.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Scanner Left / Extracted Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column Left: Mobile Camera / OCR Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Document Type Selector */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Loại Giấy Tờ Cần Thu Thập / Quét:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDocType('CCCD')}
                className={`p-2.5 rounded-xl border text-left transition font-medium flex items-center gap-2 ${
                  docType === 'CCCD'
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Căn cước công dân (chip)</span>
              </button>

              <button
                type="button"
                onClick={() => setDocType('GIAY_SINH_VIEN')}
                className={`p-2.5 rounded-xl border text-left transition font-medium flex items-center gap-2 ${
                  docType === 'GIAY_SINH_VIEN'
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Giấy XN Sinh viên ĐH/CĐ</span>
              </button>

              <button
                type="button"
                onClick={() => setDocType('BANG_CAP')}
                className={`p-2.5 rounded-xl border text-left transition font-medium flex items-center gap-2 ${
                  docType === 'BANG_CAP'
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Bằng tốt nghiệp / Học bạ</span>
              </button>

              <button
                type="button"
                onClick={() => setDocType('Y_TE')}
                className={`p-2.5 rounded-xl border text-left transition font-medium flex items-center gap-2 ${
                  docType === 'Y_TE'
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Phiếu sơ tuyển Y tế</span>
              </button>
            </div>
          </div>

          {/* Smartphone Camera Viewport */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                Ống kính máy ảnh Smartphone
              </span>
              <span className="font-mono text-emerald-400">1080p AI OCR</span>
            </div>

            {/* Viewfinder Window */}
            <div className="relative aspect-[4/3] bg-slate-950 rounded-xl border-2 border-dashed border-emerald-600/50 flex flex-col items-center justify-center overflow-hidden group">
              {/* Corner brackets simulating camera HUD */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

              {/* Scanning Laser Beam */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/50 animate-[scan_1.5s_ease-in-out_infinite]"></div>
              )}

              {isScanning ? (
                <div className="text-center space-y-2 z-10">
                  <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-xs font-semibold text-emerald-300 animate-pulse">
                    Đang nhận dạng ký tự quang học (OCR)...
                  </div>
                  <p className="text-[11px] text-slate-400">Trích xuất Họ tên, CCCD, Quê quán, Ngày sinh</p>
                </div>
              ) : scanSuccess ? (
                <div className="text-center space-y-2 p-4 z-10">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-emerald-300">
                    Nhận dạng OCR thành công!
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs border border-emerald-700/60 font-mono">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Độ tin cậy: {ocrConfidence}%
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Dữ liệu đã tự động điền vào biểu mẫu bên phải. Cán bộ vui lòng kiểm tra đối chiếu trước khi lưu.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2 p-4">
                  <Camera className="w-10 h-10 text-slate-500 mx-auto" />
                  <div className="text-xs font-medium text-slate-300">
                    Đặt giấy tờ vào khung hình chữ nhật
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Đảm bảo đủ ánh sáng, không bị lóa và rõ nét các dòng chữ
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSimulateCameraCapture}
                disabled={isScanning}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition"
              >
                <Camera className="w-4 h-4" />
                <span>Chụp Quét Thực Tế</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 cursor-pointer transition">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Tải Ảnh Từ Máy</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSimulateCameraCapture}
                />
              </label>
            </div>

            {/* 1-Click Sample Preset Documents */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Hoặc thử nghiệm nhanh với 3 mẫu hồ sơ thực tế:
              </span>
              <div className="space-y-1.5">
                {SAMPLE_OCR_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleLoadSample(tmpl.id)}
                    className={`w-full p-2 rounded-xl text-left text-xs transition flex items-center justify-between border ${
                      selectedTemplate === tmpl.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-semibold block">{tmpl.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {tmpl.data.fullName} - {tmpl.data.hamlet}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-medium">
                      {tmpl.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column Right: Normalized Data & Review Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-700/80 pb-3 gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Kiểm Tra & Chuẩn Hóa Dữ Liệu Sau Nhận Dạng OCR
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Theo quy chế: Cán bộ trực tiếp kiểm tra lại với giấy tờ gốc trước khi bấm lưu
              </p>
            </div>

            {/* OCR Confidence Badge */}
            {ocrConfidence > 0 && (
              <span className="text-xs font-mono px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded-lg border border-emerald-700/60">
                Độ tin cậy OCR: {ocrConfidence}%
              </span>
            )}
          </div>

          {/* Duplicate or Age Warning Box */}
          {duplicateCitizen && (
            <div className="p-3 bg-red-950/50 border border-red-700 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>CẢNH BÁO TRÙNG LẶP:</strong> Số CCCD <span className="font-mono text-red-100">{formData.cccd}</span> đã thuộc về công dân <strong className="text-white">{duplicateCitizen.fullName}</strong> ({duplicateCitizen.id}).
                Hệ thống cảnh báo cán bộ kiểm tra kỹ tránh ghi đè hoặc trùng hồ sơ.
              </div>
            </div>
          )}

          {calculatedAge > 0 && (calculatedAge < 18 || calculatedAge > 27) && (
            <div className="p-3 bg-amber-950/50 border border-amber-700 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>LƯU Ý ĐỘ TUỔI:</strong> Tuổi tính theo năm tuyển quân 2026 là <strong>{calculatedAge} tuổi</strong> (ngoài khung tuổi 18 đến 27 của Luật NVQS).
              </div>
            </div>
          )}

          {/* Form Groups */}
          <div className="space-y-4 text-xs">
            {/* 1. Thông tin cá nhân */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-700 pb-1">
                1. Thông tin nhân thân (Trích xuất từ CCCD):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-medium">Họ và tên công dân (viết hoa): *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                    placeholder="VD: NGUYỄN VĂN AN"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Ngày sinh: *</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  {calculatedAge > 0 && (
                    <span className="text-[11px] text-emerald-400">
                      Tính tuổi năm 2026: <strong>{calculatedAge} tuổi</strong>
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Số CCCD (12 chữ số): *</label>
                  <input
                    type="text"
                    value={formData.cccd}
                    onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                    placeholder="001205xxxxxx"
                    maxLength={12}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Số điện thoại liên hệ:</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912xxxxxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Dân tộc:</label>
                  <input
                    type="text"
                    value={formData.ethnicity}
                    onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Cư trú & Địa bàn quản lý */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-700 pb-1">
                2. Quản lý cư trú & Địa bàn:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Thôn / Tổ dân phố: *</label>
                  <select
                    value={formData.hamlet}
                    onChange={(e) => setFormData({ ...formData, hamlet: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tổ dân phố 1">Tổ dân phố 1</option>
                    <option value="Tổ dân phố 2">Tổ dân phố 2</option>
                    <option value="Tổ dân phố 3">Tổ dân phố 3</option>
                    <option value="Thôn Thượng">Thôn Thượng</option>
                    <option value="Thôn Trung">Thôn Trung</option>
                    <option value="Thôn Hạ">Thôn Hạ</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-medium">Nơi thường trú đầy đủ:</label>
                  <input
                    type="text"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    placeholder="Số nhà, ngõ xóm, thôn/tổ..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Trạng thái cư trú:</label>
                  <select
                    value={formData.residenceStatus}
                    onChange={(e) => setFormData({ ...formData, residenceStatus: e.target.value as ResidenceStatus })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="THUONG_TRU_CO_MAT">Thường trú có mặt tại địa phương</option>
                    <option value="DI_LAM_XA">Đi làm ăn xa / Công nhân KCN</option>
                    <option value="DI_HOC_XA">Đi học xa (ĐH, Cao đẳng)</option>
                    <option value="TAM_VANG">Tạm vắng không rõ lý do</option>
                    <option value="CHUYEN_KHAU_CHUA_CAT">Chuyển khẩu chưa cắt</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-medium">Nơi ở hiện tại (nếu khác thường trú):</label>
                  <input
                    type="text"
                    value={formData.temporaryAddress}
                    onChange={(e) => setFormData({ ...formData, temporaryAddress: e.target.value })}
                    placeholder="Ký túc xá, nơi trọ làm việc..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Học vấn & Chuyên môn kỹ thuật */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-700 pb-1">
                3. Trình độ học vấn & Chuyên môn kỹ thuật:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Trình độ đào tạo:</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="THPT_12_12">Tốt nghiệp THPT (12/12)</option>
                    <option value="DAI_HOC">Đại học</option>
                    <option value="CAO_DANG">Cao đẳng</option>
                    <option value="TRUNG_CAP">Trung cấp nghề</option>
                    <option value="DUOI_12">Dưới lớp 12</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Tên trường đào tạo:</label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="VD: ĐH Bách Khoa, THPT Đại Đồng..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Ngành học / Chuyên môn:</label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder="VD: Cơ khí, Y sĩ, CNTT..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Is Student Checkbox */}
                <div className="sm:col-span-3 flex items-center gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    id="isStudent"
                    checked={formData.isStudentCurrently}
                    onChange={(e) => setFormData({ ...formData, isStudentCurrently: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isStudent" className="text-xs text-slate-200 cursor-pointer select-none">
                    <strong>Đang là sinh viên chính quy:</strong> Có giấy xác nhận của nhà trường kỳ học hiện tại (Căn cứ xem xét tạm hoãn NVQS)
                  </label>
                </div>
              </div>
            </div>

            {/* 4. Sức khỏe sơ bộ & Chính sách */}
            <div className="space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider block border-b border-slate-700 pb-1">
                4. Sơ tuyển Sức khỏe & Chính sách xã hội:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Phân loại thể lực (TT 105):</label>
                  <select
                    value={formData.healthGrade}
                    onChange={(e) => setFormData({ ...formData, healthGrade: e.target.value as HealthGrade })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOAI_1">Loại 1 (Rất tốt)</option>
                    <option value="LOAI_2">Loại 2 (Tốt)</option>
                    <option value="LOAI_3">Loại 3 (Khá)</option>
                    <option value="LOAI_4">Loại 4 (Tật khúc xạ / Sức khỏe chưa đạt)</option>
                    <option value="LOAI_5">Loại 5 (Kém)</option>
                    <option value="LOAI_6">Loại 6 (Không đủ tiêu chuẩn vĩnh viễn)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Chiều cao (cm) / Cân nặng (kg):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.heightCm}
                      onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono"
                      placeholder="170"
                    />
                    <input
                      type="number"
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono"
                      placeholder="62"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Khúc xạ mắt trái / phải (Điốp):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.25"
                      value={formData.eyeRefractionLeft}
                      onChange={(e) => setFormData({ ...formData, eyeRefractionLeft: Number(e.target.value) })}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono"
                      placeholder="Trái"
                    />
                    <input
                      type="number"
                      step="0.25"
                      value={formData.eyeRefractionRight}
                      onChange={(e) => setFormData({ ...formData, eyeRefractionRight: Number(e.target.value) })}
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono"
                      placeholder="Phải"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-slate-400 font-medium">Chính sách ưu đãi / Hoàn cảnh đặc biệt:</label>
                  <select
                    value={formData.policyCategory}
                    onChange={(e) => setFormData({ ...formData, policyCategory: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BinhThuong">Bình thường (Không thuộc diện chính sách)</option>
                    <option value="ConLietSi">Con của Liệt sĩ (Thuộc diện MIỄN gọi nhập ngũ)</option>
                    <option value="ConThuongBinh">Con thương binh hạng 1, hạng 2</option>
                    <option value="LaoDongDuyNhat">Lao động duy nhất trực tiếp nuôi dưỡng thân nhân</option>
                    <option value="HoNgheo">Hộ nghèo / Hoàn cảnh gia đình đặc biệt khó khăn</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="border-t border-slate-700/80 pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              Cán bộ ghi nhận: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.roleTitle})
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Lưu & Đồng Bộ Vào CSDL Cấp Xã</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
