import React, { useState } from 'react';
import { NavigationPath } from '../types';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  pendingReviewsCount: number;
  onOpenSecurityPolicy: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  pendingReviewsCount,
  onOpenSecurityPolicy
}) => {
  const [useCaseExpanded, setUseCaseExpanded] = useState(true);
  const [toolExpanded, setToolExpanded] = useState(true);

  const isUseCaseSubActive = ['all-use-cases', 'my-applications', 'pending-reviews', 'new-use-case', 'use-case-detail'].includes(currentPath);
  const isToolSubActive = ['tool-directory', 'tool-assessment'].includes(currentPath);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto border-r border-[#e5eeff]">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('dashboard')} 
          className="h-16 px-gutter flex items-center gap-space-sm bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-colors"
        >
          <img 
            alt="AI WorkHub Logo" 
            className="h-8 w-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida/AEtjO1XrdHbuokPeA7uIflT3TirVddaDodWHJi9CTmhnfLua3ewR0hwnvKyWHbqLwkiMEKTlmeEEPEy5H9y6wNDDIu5TqoK3HsYwF-NeVoCQ6aOB2pQvQzchJlirk5jGcLr5yoMtwQeGKsuZ7Zbwg0PIEIhclx5tzTvpzpK2ynaopJvs3BIKmP6mcuJe24hrUSltv3rZNjWjoPOeyNf7bFyfp4qWZF61KF2KHbyJRYv2eJODwQKQ7uAc3bG3zIpH" 
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary tracking-tight">AI WorkHub</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">생성형 AI 도입 관리 시스템</span>
          </div>
        </div>

        {/* Primary Menu */}
        <div className="px-space-md py-space-sm">
          <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline">주요 메뉴</div>
          <nav className="flex flex-col gap-space-xs mt-space-xs">
            {/* 대시보드 */}
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'dashboard'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">dashboard</span>
              <span className="font-label-md text-label-md">대시보드</span>
            </button>

            {/* AI 활용 과제 Accordion */}
            <div className="flex flex-col gap-space-xs">
              <button
                type="button"
                onClick={() => setUseCaseExpanded(!useCaseExpanded)}
                className={`flex items-center justify-between px-space-md py-space-sm rounded-lg text-left transition-colors ${
                  isUseCaseSubActive && !['all-use-cases', 'my-applications', 'pending-reviews'].includes(currentPath)
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-headline-md">assignment</span>
                  <span className="font-label-md text-label-md">AI 활용 과제</span>
                </div>
                <span className={`material-symbols-outlined text-body-sm transition-transform ${useCaseExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {useCaseExpanded && (
                <div className="pl-gutter-lg flex flex-col gap-space-xs">
                  <button
                    type="button"
                    onClick={() => onNavigate('all-use-cases')}
                    className={`flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-colors font-body-sm text-body-sm text-left ${
                      currentPath === 'all-use-cases'
                        ? 'bg-primary text-on-primary font-label-md shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-sm">folder_open</span>
                    전체 과제
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('my-applications')}
                    className={`flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-colors font-body-sm text-body-sm text-left ${
                      currentPath === 'my-applications'
                        ? 'bg-primary text-on-primary font-label-md shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-sm">person_outline</span>
                    내 신청 과제
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('pending-reviews')}
                    className={`flex items-center justify-between px-space-sm py-space-xs rounded-lg transition-colors font-body-sm text-body-sm text-left ${
                      currentPath === 'pending-reviews'
                        ? 'bg-primary text-on-primary font-label-md shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-body-sm">pending_actions</span>
                      검토 대기
                    </span>
                    <span className={`px-space-xs py-0.5 rounded-full font-label-sm text-label-sm ${
                      currentPath === 'pending-reviews' 
                        ? 'bg-white text-primary font-bold' 
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {pendingReviewsCount}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* AI 도구 관리 Accordion */}
            <div className="flex flex-col gap-space-xs">
              <button
                type="button"
                onClick={() => setToolExpanded(!toolExpanded)}
                className={`flex items-center justify-between px-space-md py-space-sm rounded-lg text-left transition-colors ${
                  isToolSubActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-headline-md">smart_toy</span>
                  <span className="font-label-md text-label-md">AI 도구 관리</span>
                </div>
                <span className={`material-symbols-outlined text-body-sm transition-transform ${toolExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {toolExpanded && (
                <div className="pl-gutter-lg flex flex-col gap-space-xs">
                  <button
                    type="button"
                    onClick={() => onNavigate('tool-directory')}
                    className={`flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-colors font-body-sm text-body-sm text-left ${
                      currentPath === 'tool-directory'
                        ? 'bg-primary text-on-primary font-label-md shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-sm">apps</span>
                    도구 목록
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('tool-assessment')}
                    className={`flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-colors font-body-sm text-body-sm text-left ${
                      currentPath === 'tool-assessment'
                        ? 'bg-primary text-on-primary font-label-md shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-body-sm">rate_review</span>
                    도구 검토
                  </button>
                </div>
              )}
            </div>

            {/* 보안 검토 및 승인 */}
            <button
              type="button"
              onClick={() => onNavigate('security-review')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'security-review'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">shield_lock</span>
              <span className="font-label-md text-label-md">보안 검토 및 승인</span>
            </button>

            {/* 시범 운영 관리 */}
            <button
              type="button"
              onClick={() => onNavigate('pilot-management')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'pilot-management'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">rocket_launch</span>
              <span className="font-label-md text-label-md">시범 운영 관리</span>
            </button>

            {/* 성과 평가 */}
            <button
              type="button"
              onClick={() => onNavigate('performance-evaluation')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'performance-evaluation'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">insights</span>
              <span className="font-label-md text-label-md">성과 평가</span>
            </button>
          </nav>
        </div>

        {/* 공유 & 리소스 */}
        <div className="px-space-md py-space-sm">
          <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline">공유 & 리소스</div>
          <nav className="flex flex-col gap-space-xs mt-space-xs">
            <button
              type="button"
              onClick={() => onNavigate('use-case-library')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'use-case-library'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">local_library</span>
              <span className="font-label-md text-label-md">활용 사례 라이브러리</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('guidelines-training')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'guidelines-training'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">menu_book</span>
              <span className="font-label-md text-label-md">가이드라인 및 교육</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'reports'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">analytics</span>
              <span className="font-label-md text-label-md">보고서</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('system-settings')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-colors ${
                currentPath === 'system-settings'
                  ? 'bg-primary text-on-primary font-label-md shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-headline-md">settings</span>
              <span className="font-label-md text-label-md">시스템 관리</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Network Security Badge */}
      <div className="p-space-md bg-surface-container-low rounded-t-xl border-t border-[#e5eeff]">
        <div className="flex items-center gap-space-sm">
          <div className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">사내 보안망 연동됨 (운영망)</span>
        </div>
        <button
          type="button"
          onClick={onOpenSecurityPolicy}
          className="mt-space-xs flex items-center justify-between text-primary hover:text-on-primary-fixed-variant transition-colors w-full text-left"
        >
          <span className="font-body-sm text-body-sm font-medium">보안 정책 가이드라인</span>
          <span className="material-symbols-outlined text-body-sm">arrow_outward</span>
        </button>
      </div>
    </aside>
  );
};
