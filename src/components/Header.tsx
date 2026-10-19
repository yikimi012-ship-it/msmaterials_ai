import React from 'react';
import { NavigationPath } from '../types';

interface HeaderProps {
  currentPath: NavigationPath;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenHelp: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenHelp,
  unreadCount = 3
}) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-lg border-b border-[#e5eeff]">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-space-sm font-label-md text-label-md text-on-surface-variant">
        <span className="material-symbols-outlined text-headline-md text-secondary">domain</span>
        <span>AI 거버넌스 본부</span>
        <span className="material-symbols-outlined text-body-sm text-outline">chevron_right</span>
        <span className="text-on-surface font-semibold">전사 통합 관리 콘솔</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-lg">
        {/* Search Input Trigger */}
        <div 
          onClick={onOpenSearch}
          className="relative flex items-center w-72 h-9 px-space-md bg-surface-container-lowest rounded-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] cursor-pointer hover:bg-surface-container-low transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-headline-md text-outline mr-space-xs">search</span>
          <span className="w-full bg-transparent border-none outline-none font-body-sm text-body-sm text-outline select-none">
            과제, 모델, 승인 요청 검색...
          </span>
          <kbd className="font-code-sm text-code-sm bg-surface-container-low text-on-surface-variant px-space-xs py-0.5 rounded border border-outline-variant/40">
            Ctrl+K
          </kbd>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-space-xs">
          <button 
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title="알림 및 승인 요청"
          >
            <span className="material-symbols-outlined text-headline-md">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            )}
          </button>

          <button 
            type="button"
            onClick={onOpenHelp}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title="도움말 및 시스템 가이드"
          >
            <span className="material-symbols-outlined text-headline-md">help_outline</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-space-md pl-space-md border-l border-outline-variant/30">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-space-xs">
              <span className="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
                총괄 관리자
              </span>
              <span className="font-label-md text-label-md text-on-surface font-medium">
                이지원 수석 매니저
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              디지털혁신실 AI추진팀
            </span>
          </div>

          <img 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-high" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq2Y3ESPn73o5jOUUww9SqZ_0jZY88cGDN5mUQLl0UhypTYrGMLGaFggTEBo2Ty-Np9C9vnMozRNnszSGTQlh94zyREMKm6zxMYSBM56mhvMijSba7_21KspwCvYu52ptsfmapCi5_P6RHsw72RsaUCxxZQq58Na_eARWjAKHshaqp4SSPdeoFKYAvSGa4SAuW4MRlWT2ukAcY5MGHozLdWjGUA60c8VkL3qx879spGn8oyzE2oteZTw" 
          />
        </div>
      </div>
    </header>
  );
};
