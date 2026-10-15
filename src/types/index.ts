export type MilitaryStatus = 
  | 'DU_DIEU_KIEN'       // Đủ điều kiện gọi khám / nhập ngũ
  | 'TAM_HOAN_HOC_VAN'   // Tạm hoãn: Đang học ĐH/CĐ chính quy
  | 'TAM_HOAN_SUC_KHOE'  // Tạm hoãn: Chưa đủ sức khỏe (loại 3 trở lên hoặc bệnh tật)
  | 'TAM_HOAN_HOAN_CANH' // Tạm hoãn: Lao động duy nhất, hoàn cảnh khó khăn
  | 'MIEN_GOI'           // Miễn gọi nhập ngũ (con liệt sĩ, thương binh...)
  | 'CHUA_XAC_MINH'      // Chưa rõ thông tin / cần xác minh
  | 'KHONG_DU_TIEU_CHUAN'// Không đủ tiêu chuẩn chính trị / pháp luật / sức khỏe vĩnh viễn

export type EducationLevel = 'THPT_12_12' | 'TRUNG_CAP' | 'CAO_DANG' | 'DAI_HOC' | 'THAC_SI' | 'DUOI_12';

export type ResidenceStatus = 'THUONG_TRU_CO_MAT' | 'DI_LAM_XA' | 'DI_HOC_XA' | 'TAM_VANG' | 'CHUYEN_KHAU_CHUA_CAT';

export type HealthGrade = 'LOAI_1' | 'LOAI_2' | 'LOAI_3' | 'LOAI_4' | 'LOAI_5' | 'LOAI_6' | 'CHUA_KHAM';

export interface CitizenRecord {
  id: string; // Mã hồ sơ: MS-2026-001
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  gender: 'Nam' | 'Nữ';
  cccd: string; // Mã số căn cước
  phone: string;
  ethnicity: string; // Dân tộc
  religion: string;  // Tôn giáo
  
  // Địa bàn quản lý cấp xã
  hamlet: string; // Thôn / Khu phố / Tổ dân phố (VD: Tổ 1, Tổ 2, Thôn Thượng, Thôn Hạ...)
  ward: string;   // Xã/Phường
  permanentAddress: string; // Nơi thường trú
  temporaryAddress?: string; // Nơi ở hiện tại
  
  // Trình độ học vấn & Chuyên môn kỹ thuật
  educationLevel: EducationLevel;
  schoolName?: string;
  major?: string; // Ngành học / Chuyên môn kỹ thuật
  graduationYear?: number;
  isStudentCurrently?: boolean;
  studentCardId?: string;

  // Cư trú & Biến động
  residenceStatus: ResidenceStatus;
  residenceNote?: string;
  residenceVerifiedDate?: string;
  residenceVerifier?: string;

  // Sức khỏe & Thể lực (Thông tư 105/2023/TT-BQP)
  healthGrade: HealthGrade;
  heightCm?: number;
  weightKg?: number;
  eyeRefractionLeft?: number; // Điốp
  eyeRefractionRight?: number;
  healthNote?: string;

  // Hoàn cảnh gia đình & Chính sách
  policyCategory?: 'BinhThuong' | 'ConLietSi' | 'ConThuongBinh' | 'LaoDongDuyNhat' | 'HoNgheo' | 'KhuyetTat';
  familyNote?: string;

  // Trạng thái tổng hợp phân loại
  status: MilitaryStatus;
  statusReason?: string;
  statusApprovedBy?: string;
  statusApprovedDate?: string;

  // Thu thập dữ liệu & OCR
  collectedViaDevice: 'SmartPhone' | 'Desktop' | 'GiayTruyenThong';
  collectorName: string;
  collectedAt: string;
  ocrConfidence: number; // 0 - 100%
  documentImages?: string[];
  syncStatus: 'DA_DONG_BO' | 'CHO_DONG_BO' | 'CAN_BO_SUNG';

  // Đối chiếu liên ngành
  crossCheckResults: {
    policeCitizenDb: 'KHOP' | 'LECH' | 'CHUA_DOI_CHIEU';
    policeNote?: string;
    
    enterpriseTaxDb: 'KHOP' | 'LECH' | 'CHUA_DOI_CHIEU';
    enterpriseNote?: string;

    highSchoolDb: 'KHOP' | 'LECH' | 'CHUA_DOI_CHIEU';
    highSchoolNote?: string;

    universityCollegeDb: 'KHOP' | 'LECH' | 'CHUA_DOI_CHIEU';
    universityNote?: string;

    healthDeptDb: 'KHOP' | 'LECH' | 'CHUA_DOI_CHIEU';
    healthNote?: string;

    socialPolicyDb: 'KHOP' | 'LECH' | 'CHUA_DOI_CHIEU';
    socialNote?: string;
  };
  
  hasDiscrepancy: boolean;
  discrepancyDetails?: string[];
}

export interface OperationalStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'HOAN_THANH' | 'DANG_THUC_HIEN' | 'CHUA_BAT_DAU';
  completionRate: number; // 0 - 100
  assignedRole: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  targetId: string;
  details: string;
  ipAddress: string;
}

export interface UserAccount {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  badge: string;
  canApprove: boolean;
  canEdit: boolean;
  canExport: boolean;
}

export interface FeatureItem {
  id: number; // STT 1 -> 100
  name: string; // Tên tính năng
  groupId: number; // Nhóm 1 -> 12
  groupName: string; // Tên nhóm
  description: string; // Thuyết minh ngắn gọn
  inputData: string; // Dữ liệu đầu vào
  outputData: string; // Kết quả đầu ra
  responsibleRole: string; // Người sử dụng / phụ trách
  legalBasis: string; // Căn cứ pháp lý
  acceptanceCriteria: string; // Tiêu chí nghiệm thu
  status: 'SAN_SANG' | 'HOAN_THIEN' | 'DANG_VAN_HANH';
  actionTab: string; // Tab để mở kiểm thử
}

export interface Age17RegistrationRecord {
  id: string; // VD: DK17-2026-001
  fullName: string;
  birthDate: string;
  cccd: string;
  phone: string;
  hamlet: string;
  registrationStatus: 'DA_DANG_KY' | 'CHUA_DANG_KY' | 'MIEN_DANG_KY' | 'KHONG_DUOC_DANG_KY' | 'CHUYEN_DI' | 'CHUYEN_DEN';
  registrationDate?: string;
  certificateNumber?: string; // Số Giấy chứng nhận đăng ký NVQS
  note?: string;
}

export interface CouncilMember {
  id: string;
  fullName: string;
  councilRole: 'Chủ tịch HĐ' | 'Phó Chủ tịch TT' | 'Phó Chủ tịch' | 'Ủy viên Thường trực' | 'Ủy viên';
  officialPosition: string; // Chức vụ chính quyền / đoàn thể
  assignedHamlets: string[]; // Địa bàn phụ trách theo dõi
  phone: string;
}

export interface ViolationCase {
  id: string; // VP-2026-001
  citizenId: string;
  citizenName: string;
  hamlet: string;
  violationType: 'KHONG_DANG_KY_LAN_DAU' | 'KHONG_CHAP_HANH_LENH_KHAM' | 'GIAN_DOI_SUC_KHOE' | 'KHONG_CHAP_HANH_LENH_NHAP_NGU';
  violationDate: string;
  status: 'DANG_XAC_MINH' | 'CO_LY_DO_CHINH_DANG' | 'DA_LAP_BIEN_BAN' | 'DA_RA_QUYET_DINH_PHAT' | 'CHUYEN_HINH_SU';
  fineAmount?: number; // Số tiền phạt (VNĐ)
  justificationReason?: string; // Lý do giải trình (ốm đau cấp cứu...)
  verifierName: string;
  decisionNumber?: string;
  statuteOfLimitationsDeadline: string; // Thời hiệu xử phạt (1 năm)
  note: string;
}

export interface LegalDocument {
  id: string;
  code: string; // VD: Luật số 78/2015/QH13
  title: string;
  issuedDate: string;
  effectiveDate: string;
  issuer: string;
  summary: string;
  category: 'Luat' | 'NghiDinh' | 'ThongTu' | 'HuongDan';
  downloadUrl?: string;
}

