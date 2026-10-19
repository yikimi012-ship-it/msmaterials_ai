import React from 'react';
import { UseCase, NavigationPath } from '../types';

interface PilotManagementViewProps {
  useCases: UseCase[];
  onNavigate: (path: NavigationPath) => void;
  onSelectCase: (id: string) => void;
  isPerformanceMode?: boolean;
}

export const PilotManagementView: React.FC<PilotManagementViewProps> = ({
  useCases,
  onNavigate,
  onSelectCase,
  isPerformanceMode = false
}) => {
  const pilotCases = useCases.filter(c => 
    isPerformanceMode 
      ? ['성과 평가 중', '확대 승인'].includes(c.status)
      : ['시범 운영 중', '승인 완료'].includes(c.status)
  );

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-gutter-lg rounded-xl shadow-sm border border-[#e5eeff]">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-primary">홈</button>
            <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
            <span>{isPerformanceMode ? '성과 평가' : '시범 운영 관리'}</span>
          </div>

          <div className="flex items-baseline gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {isPerformanceMode ? '정량 성과 평가 및 전사 확산 심의' : '실시간 시범 운영 (Pilot) 현장 관제'}
            </h1>
            <span className="font-code-sm text-code-sm px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-semibold">
              {pilotCases.length}건 관제 중
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            {isPerformanceMode
              ? '시범 운영이 완료된 AI 과제의 목표 대비 달성률, 업무시간 절감 가치, 직원 만족도를 바탕으로 전사 확대 여부를 최종 평가합니다.'
              : '사내 샌드박스 테넌트에서 실무 파일럿 검증 중인 생성형 AI 과제의 진행률, API 호출량, 오류율을 실시간 모니터링합니다.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {pilotCases.map((c) => (
          <div
            key={c.id}
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-[#e5eeff] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-space-xs">
                <span className="font-code-sm text-code-sm text-primary font-bold">{c.id}</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-code-sm text-code-sm font-semibold">
                  {c.status}
                </span>
              </div>
              <h3 
                onClick={() => onSelectCase(c.id)}
                className="font-headline-md text-headline-md text-on-surface font-semibold hover:text-primary cursor-pointer mt-1"
              >
                {c.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {c.description}
              </p>

              <div className="mt-space-md p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                <div className="flex justify-between text-body-sm">
                  <span className="text-secondary">운영 기간</span>
                  <span className="font-semibold text-on-surface">{c.pilotDuration}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-secondary">참여 인원</span>
                  <span className="font-medium text-on-surface">{c.pilotMembers.join(', ')}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-secondary">절감 예상</span>
                  <span className="font-bold text-tertiary-container">월 {c.timeSavedHoursPerMonth}시간</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-secondary">품질 검수자</span>
                  <span className="text-on-surface">{c.qaLead}</span>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="font-code-sm text-code-sm text-outline">적용 도구: {c.selectedTool}</span>
              <button
                type="button"
                onClick={() => onSelectCase(c.id)}
                className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md font-semibold transition-colors"
              >
                상세 심의 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
