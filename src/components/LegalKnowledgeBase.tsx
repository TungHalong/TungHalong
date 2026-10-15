import React, { useState } from 'react';
import { 
  BookOpen, Search, FileText, Bell, Clock, Scale, 
  ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { LegalDocument } from '../types';
import { LEGAL_DOCUMENTS } from '../data/featureCatalog';

export const LegalKnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  // Operational Deadline Reminders (Tính năng 95)
  const deadlineAlerts = [
    {
      id: 1,
      title: 'Hạn chót phát Lệnh gọi khám sức khỏe NVQS tập trung',
      deadline: '2026-10-31',
      daysLeft: 17,
      status: 'SAP_DEN_HAN',
      note: 'Phải trao Lệnh gọi đến tận tay công dân hoặc thân nhân trước tối thiểu 15 ngày.',
    },
    {
      id: 2,
      title: 'Hạn niêm yết công khai danh sách tạm hoãn & miễn gọi',
      deadline: '2026-11-20',
      daysLeft: 37,
      status: 'BINH_THUONG',
      note: 'Niêm yết tối thiểu 20 ngày liên tục tại trụ sở UBND xã và nhà văn hóa thôn/tổ.',
    },
    {
      id: 3,
      title: 'Thời hiệu xử phạt VPHC vụ việc công dân Nguyễn Tiến Dũng',
      deadline: '2027-10-02',
      daysLeft: 353,
      status: 'THEO_DOI',
      note: 'Thời hiệu 01 năm theo Luật Xử lý vi phạm hành chính.',
    },
  ];

  const filteredDocs = LEGAL_DOCUMENTS.filter((doc) => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!doc.title.toLowerCase().includes(term) && !doc.code.toLowerCase().includes(term) && !doc.summary.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Kho Văn Bản Pháp Luật Số Hóa & Cảnh Báo Thời Hạn Nghiệp Vụ
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            (Nhóm XI - Tính năng 94 đến 97): Tra cứu các văn bản quy phạm pháp luật mới nhất về Quốc phòng,
            Thông tư 105/2023/TT-BQP về sức khỏe, Nghị định 37/2022/NĐ-CP về xử phạt, và hệ thống nhắc việc tự động trước hạn.
          </p>
        </div>
      </div>

      {/* Operational Deadline Reminders (Tính năng 95) */}
      <div className="bg-slate-850 rounded-2xl p-5 border border-slate-700/80 shadow space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            Hệ Thống Cảnh Báo & Nhắc Việc Thời Hạn Nghiệp Vụ (Tính Năng 95)
          </h3>
          <span className="text-slate-400 font-mono text-[11px]">Quy tắc: Nhắc việc trước 15 ngày</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {deadlineAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border space-y-2 ${
                alert.status === 'SAP_DEN_HAN'
                  ? 'bg-amber-950/30 border-amber-600/60 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">Hạn: {alert.deadline}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  alert.status === 'SAP_DEN_HAN' ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-300'
                }`}>
                  Còn {alert.daysLeft} ngày
                </span>
              </div>
              <h4 className="font-bold text-white text-xs">{alert.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{alert.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu theo Tên luật, số hiệu văn bản..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Loại văn bản:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none"
          >
            <option value="ALL">Tất cả văn bản</option>
            <option value="Luat">Luật Quốc hội</option>
            <option value="NghiDinh">Nghị định Chính phủ</option>
            <option value="ThongTu">Thông tư Bộ Quốc phòng</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-slate-850 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 shadow cursor-pointer transition space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400 text-xs">
                {doc.code}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                Hiệu lực: {doc.effectiveDate}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">
              {doc.title}
            </h3>

            <p className="text-slate-400 leading-relaxed line-clamp-3">
              {doc.summary}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Cơ quan: {doc.issuer}</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                Xem điều khoản &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View Document Detail */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 text-xs font-serif leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">{selectedDoc.code}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedDoc.title}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                &times;
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <p>
                <strong>Cơ quan ban hành:</strong> {selectedDoc.issuer}
              </p>
              <p>
                <strong>Ngày ban hành:</strong> {selectedDoc.issuedDate} • <strong>Ngày có hiệu lực:</strong> {selectedDoc.effectiveDate}
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <strong className="text-amber-300 block font-sans uppercase text-[11px]">Tóm tắt nội dung quy chuẩn áp dụng:</strong>
                <p className="leading-relaxed">{selectedDoc.summary}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 font-sans">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
