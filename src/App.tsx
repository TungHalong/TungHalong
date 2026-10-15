import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MobileTerminalOCR } from './components/MobileTerminalOCR';
import { CentralDataRegistry } from './components/CentralDataRegistry';
import { InterAgencyCrossCheck } from './components/InterAgencyCrossCheck';
import { ClassificationDraftList } from './components/ClassificationDraftList';
import { ReportsAndPrint } from './components/ReportsAndPrint';
import { SecurityAuditLog } from './components/SecurityAuditLog';
import { InitiativeDocumentation } from './components/InitiativeDocumentation';
import { CitizenDetailModal } from './components/CitizenDetailModal';
import { NewCitizenModal } from './components/NewCitizenModal';
import { FeatureCatalogExplorer } from './components/FeatureCatalogExplorer';
import { RegistrationAge17 } from './components/RegistrationAge17';
import { CouncilPlanManagement } from './components/CouncilPlanManagement';
import { ViolationsManagement } from './components/ViolationsManagement';
import { LegalKnowledgeBase } from './components/LegalKnowledgeBase';
import { 
  INITIAL_CITIZENS, INITIAL_USERS, INITIAL_OPERATIONAL_STEPS, INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { CitizenRecord, UserAccount, AuditLogItem, OperationalStep } from './types';
import { Smartphone, Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

export default function App() {
  // Main Data States with localStorage persistence
  const [citizens, setCitizens] = useState<CitizenRecord[]>(() => {
    const saved = localStorage.getItem('msms_citizens_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved citizens', e);
      }
    }
    return INITIAL_CITIZENS;
  });

  const [operationalSteps, setOperationalSteps] = useState<OperationalStep[]>(INITIAL_OPERATIONAL_STEPS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [allUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]);

  // UI Navigation States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [syncTime, setSyncTime] = useState<string>('14/10/2026 20:25');

  // Modal States
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenRecord | null>(null);
  const [isNewCitizenModalOpen, setIsNewCitizenModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('msms_citizens_v1', JSON.stringify(citizens));
  }, [citizens]);

  // Action: Add new citizen
  const handleSaveCitizen = (newCitizen: CitizenRecord) => {
    setCitizens((prev) => [newCitizen, ...prev]);

    // Add Audit Log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      action: newCitizen.collectedViaDevice === 'SmartPhone' ? 'QUÉT_OCR_MỚI' : 'NHẬP_MỚI_THỦ_CÔNG',
      targetId: newCitizen.id,
      details: `Đăng ký hồ sơ công dân: ${newCitizen.fullName} (${newCitizen.hamlet})`,
      ipAddress: '192.168.1.42 (Mobile Terminal)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    setSyncTime(new Date().toLocaleTimeString('vi-VN'));
  };

  // Action: Update citizen
  const handleUpdateCitizen = (updated: CitizenRecord) => {
    setCitizens((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedCitizen && selectedCitizen.id === updated.id) {
      setSelectedCitizen(updated);
    }

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      action: 'CẬP_NHẬT_HỒ_SƠ',
      targetId: updated.id,
      details: `Cập nhật thông tin/trạng thái công dân: ${updated.fullName} -> ${updated.status}`,
      ipAddress: '192.168.1.10',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    setSyncTime(new Date().toLocaleTimeString('vi-VN'));
  };

  // Action: Delete citizen
  const handleDeleteCitizen = (id: string) => {
    setCitizens((prev) => prev.filter((c) => c.id !== id));
    if (selectedCitizen && selectedCitizen.id === id) {
      setSelectedCitizen(null);
    }
  };

  // Action: Refresh data simulation
  const handleRefreshData = () => {
    setSyncTime(new Date().toLocaleTimeString('vi-VN'));
    alert('Đã kết nối thành công với Máy chủ Ban CHQS Xã & cập nhật phiên bản mới nhất!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allUsers={allUsers}
        setCurrentUser={setCurrentUser}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        totalCitizens={citizens.length}
        syncTime={syncTime}
        onRefreshData={handleRefreshData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {deviceMode === 'mobile' ? (
          /* Smartphone Simulator Frame */
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-md bg-slate-900 rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden p-2 ring-1 ring-slate-800">
              {/* Phone Top Notch / Status Bar */}
              <div className="bg-slate-950 rounded-t-[2rem] px-5 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
                <span className="font-semibold text-slate-200">09:41</span>
                <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto"></div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Mobile Screen Header */}
              <div className="bg-slate-850 p-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    MS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">MSMS Mobile</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Đầu cuối thực địa cấp Xã</div>
                  </div>
                </div>
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Về màn hình lớn</span>
                </button>
              </div>

              {/* Mobile Content View */}
              <div className="bg-slate-900 p-3 max-h-[75vh] overflow-y-auto no-scrollbar space-y-4">
                {activeTab === 'mobile-ocr' ? (
                  <MobileTerminalOCR
                    onSaveCitizen={handleSaveCitizen}
                    existingCitizens={citizens}
                    currentUser={currentUser}
                    onNavigateTab={setActiveTab}
                  />
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800 text-emerald-200">
                      <strong>Cán bộ:</strong> {currentUser.name} ({currentUser.roleTitle})
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Thiết bị thông minh đầu cuối đang kết nối mạng nội bộ quân sự xã.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveTab('mobile-ocr')}
                        className="p-3 bg-emerald-600 text-white rounded-xl text-center font-bold shadow"
                      >
                        <Smartphone className="w-5 h-5 mx-auto mb-1" />
                        Quét OCR Hồ Sơ
                      </button>
                      <button
                        onClick={() => setActiveTab('registry')}
                        className="p-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-center font-semibold"
                      >
                        Tra cứu {citizens.length} hồ sơ
                      </button>
                    </div>

                    <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                        Hồ sơ mới thu thập gần đây:
                      </h4>
                      <div className="space-y-1.5">
                        {citizens.slice(0, 4).map((c) => (
                          <div
                            key={c.id}
                            onClick={() => setSelectedCitizen(c)}
                            className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                          >
                            <div>
                              <div className="font-bold text-white">{c.fullName}</div>
                              <div className="text-[10px] text-slate-400">{c.hamlet} • {c.age}t</div>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono">
                              {c.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Bottom Bar */}
              <div className="bg-slate-950 rounded-b-[2rem] py-3 text-center">
                <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Command Console */
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                citizens={citizens}
                operationalSteps={operationalSteps}
                onNavigateTab={setActiveTab}
                currentUser={currentUser}
                onOpenNewCitizen={() => setIsNewCitizenModalOpen(true)}
              />
            )}

            {activeTab === 'feature-catalog' && (
              <FeatureCatalogExplorer
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'mobile-ocr' && (
              <MobileTerminalOCR
                onSaveCitizen={handleSaveCitizen}
                existingCitizens={citizens}
                currentUser={currentUser}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'registry' && (
              <CentralDataRegistry
                citizens={citizens}
                onSelectCitizen={(citizen) => setSelectedCitizen(citizen)}
                onOpenNewCitizen={() => setIsNewCitizenModalOpen(true)}
                currentUser={currentUser}
                onDeleteCitizen={handleDeleteCitizen}
              />
            )}

            {activeTab === 'registration-age17' && (
              <RegistrationAge17
                currentUser={currentUser}
              />
            )}

            {activeTab === 'council-plan' && (
              <CouncilPlanManagement
                currentUser={currentUser}
              />
            )}

            {activeTab === 'cross-check' && (
              <InterAgencyCrossCheck
                citizens={citizens}
                onUpdateCitizen={handleUpdateCitizen}
                onSelectCitizen={(citizen) => setSelectedCitizen(citizen)}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'classification' && (
              <ClassificationDraftList
                citizens={citizens}
                onSelectCitizen={(citizen) => setSelectedCitizen(citizen)}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'violations' && (
              <ViolationsManagement
                currentUser={currentUser}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsAndPrint
                citizens={citizens}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'legal-kb' && (
              <LegalKnowledgeBase />
            )}

            {activeTab === 'security' && (
              <SecurityAuditLog
                auditLogs={auditLogs}
                allUsers={allUsers}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'docs' && (
              <InitiativeDocumentation />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Ban Chỉ huy Quân sự Xã Đại Đồng • Phần mềm Quản lý Nguồn Nghĩa vụ Quân sự (MSMS)
          </span>
          <span className="text-slate-400">
            Sáng kiến cải tiến kỹ thuật quân sự cấp cơ sở • CSDL an toàn theo quy định
          </span>
        </div>
      </footer>

      {/* Citizen Detail Inspection Modal */}
      {selectedCitizen && (
        <CitizenDetailModal
          citizen={selectedCitizen}
          onClose={() => setSelectedCitizen(null)}
          onUpdate={handleUpdateCitizen}
          currentUser={currentUser}
        />
      )}

      {/* New Citizen Manual Modal */}
      {isNewCitizenModalOpen && (
        <NewCitizenModal
          onClose={() => setIsNewCitizenModalOpen(false)}
          onSave={handleSaveCitizen}
          currentUser={currentUser}
          existingCount={citizens.length}
        />
      )}
    </div>
  );
}
