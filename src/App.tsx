import React, { useState, useEffect } from 'react';
import { NavigationPath, UseCase } from './types';
import { INITIAL_USE_CASES, AI_TOOLS_CATALOG } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { NotificationModal } from './components/NotificationModal';
import { SecurityPolicyModal } from './components/SecurityPolicyModal';
import { DashboardView } from './views/DashboardView';
import { AllUseCasesView } from './views/AllUseCasesView';
import { NewUseCaseView } from './views/NewUseCaseView';
import { UseCaseDetailView } from './views/UseCaseDetailView';
import { ToolCatalogView } from './views/ToolCatalogView';
import { PilotManagementView } from './views/PilotManagementView';
import { AuditLogModal } from './views/AuditLogModal';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('dashboard');
  const [useCases, setUseCases] = useState<UseCase[]>(INITIAL_USE_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('AI-2025-089');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isSecurityPolicyOpen, setIsSecurityPolicyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setCurrentPath('use-case-detail');
  };

  const handleUpdateCase = (updated: UseCase) => {
    setUseCases(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleCreateCase = (newCase: UseCase) => {
    setUseCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
  };

  const pendingCount = useCases.filter(c => ['보안 검토 중', '부서 검토 중'].includes(c.status)).length;
  const currentCase = useCases.find(c => c.id === selectedCaseId) || useCases[0];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        pendingReviewsCount={pendingCount}
        onOpenSecurityPolicy={() => setIsSecurityPolicyOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Fixed Header */}
        <Header
          currentPath={currentPath}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          unreadCount={3}
        />

        {/* Primary Page Content */}
        <main className="relative pt-16 bg-surface min-h-screen">
          <div className="w-full px-gutter-lg py-gutter">
            {currentPath === 'dashboard' && (
              <DashboardView
                useCases={useCases}
                onNavigate={setCurrentPath}
                onSelectCase={handleSelectCase}
                onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
                onOpenSecurityChecklist={() => setIsSecurityPolicyOpen(true)}
              />
            )}

            {currentPath === 'all-use-cases' && (
              <AllUseCasesView
                useCases={useCases}
                onNavigate={setCurrentPath}
                onSelectCase={handleSelectCase}
                filterMode="all"
              />
            )}

            {currentPath === 'my-applications' && (
              <AllUseCasesView
                useCases={useCases}
                onNavigate={setCurrentPath}
                onSelectCase={handleSelectCase}
                filterMode="my"
              />
            )}

            {currentPath === 'pending-reviews' && (
              <AllUseCasesView
                useCases={useCases}
                onNavigate={setCurrentPath}
                onSelectCase={handleSelectCase}
                filterMode="pending"
              />
            )}

            {currentPath === 'new-use-case' && (
              <NewUseCaseView
                onNavigate={setCurrentPath}
                onSubmitNewCase={handleCreateCase}
                onCancel={() => setCurrentPath('all-use-cases')}
              />
            )}

            {currentPath === 'use-case-detail' && currentCase && (
              <UseCaseDetailView
                useCase={currentCase}
                onNavigate={setCurrentPath}
                onUpdateCase={handleUpdateCase}
                onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
              />
            )}

            {currentPath === 'tool-directory' && (
              <ToolCatalogView
                tools={AI_TOOLS_CATALOG}
                onNavigate={setCurrentPath}
                isAssessmentMode={false}
              />
            )}

            {currentPath === 'tool-assessment' && (
              <ToolCatalogView
                tools={AI_TOOLS_CATALOG}
                onNavigate={setCurrentPath}
                isAssessmentMode={true}
              />
            )}

            {currentPath === 'security-review' && (
              <AllUseCasesView
                useCases={useCases}
                onNavigate={setCurrentPath}
                onSelectCase={handleSelectCase}
                filterMode="pending"
              />
            )}

            {currentPath === 'pilot-management' && (
              <PilotManagementView
                useCases={useCases}
                onNavigate={setCurrentPath}
                onSelectCase={handleSelectCase}
                isPerformanceMode={false}
              />
            )}

            {currentPath === 'performance-evaluation' && (
              <PilotManagementView
                useCases={useCases}
                onNavigate={setCurrentPath}
                onSelectCase={handleSelectCase}
                isPerformanceMode={true}
              />
            )}

            {['use-case-library', 'guidelines-training', 'reports', 'system-settings'].includes(currentPath) && (
              <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-[#e5eeff] flex flex-col items-center justify-center text-center py-24">
                <span className="material-symbols-outlined text-5xl text-primary mb-space-sm">
                  {currentPath === 'use-case-library' ? 'local_library' :
                   currentPath === 'guidelines-training' ? 'menu_book' :
                   currentPath === 'reports' ? 'analytics' : 'settings'}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  {currentPath === 'use-case-library' ? '전사 생성형 AI 활용 우수사례 라이브러리' :
                   currentPath === 'guidelines-training' ? '임직원 AI 활용 가이드라인 및 보안 교육 포털' :
                   currentPath === 'reports' ? 'AI 거버넌스 분기별 종합 분석 보고서' : 'AI WorkHub 시스템 환경 설정'}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-xs">
                  사내 보안 가이드라인 및 규정에 따라 인가된 사용자만 접근할 수 있는 전사 공유 리소스 공간입니다.
                </p>
                <div className="mt-space-lg flex items-center gap-space-sm">
                  <button
                    type="button"
                    onClick={() => setCurrentPath('dashboard')}
                    className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md font-semibold shadow-sm"
                  >
                    대시보드로 돌아가기
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSecurityPolicyOpen(true)}
                    className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold"
                  >
                    보안 지침 확인
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        useCases={useCases}
        aiTools={AI_TOOLS_CATALOG}
        onSelectCase={handleSelectCase}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateCase={handleSelectCase}
      />

      <SecurityPolicyModal
        isOpen={isSecurityPolicyOpen}
        onClose={() => setIsSecurityPolicyOpen(false)}
      />

      <AuditLogModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
        caseId={selectedCaseId}
      />

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl p-gutter-lg border border-[#e5eeff] flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-headline-lg">help</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">AI WorkHub 이용 가이드</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <p><strong>1. 대시보드:</strong> 전사 148건의 AI 과제 파이프라인 및 부서별 현황, 시간 절감액을 종합 관제합니다.</p>
              <p><strong>2. 과제 등록 (Step 1~4):</strong> 표준 양식에 따라 업무 문제점, ROI 계산기, 허용 AI 도구 및 보안 요건을 입력합니다.</p>
              <p><strong>3. 과제 상세 & 심의 콘솔:</strong> 담당 심의관은 보안 체크리스트를 확인하고 정보보안 승인 의결/보완/반려를 집행합니다.</p>
              <p><strong>4. 전역 검색:</strong> 언제든 <code>Ctrl + K</code> 키를 눌러 과제번호나 AI 도구를 즉시 검색할 수 있습니다.</p>
            </div>
            <div className="pt-space-xs flex justify-end">
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md font-semibold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
