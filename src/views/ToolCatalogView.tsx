import React, { useState } from 'react';
import { AITool, NavigationPath } from '../types';

interface ToolCatalogViewProps {
  tools: AITool[];
  onNavigate: (path: NavigationPath) => void;
  isAssessmentMode?: boolean;
}

export const ToolCatalogView: React.FC<ToolCatalogViewProps> = ({
  tools,
  onNavigate,
  isAssessmentMode = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = tools.filter(t => {
    if (selectedCategory !== '전체' && !t.category.includes(selectedCategory)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.vendor.toLowerCase().includes(q) ||
        t.deploymentType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-gutter-lg rounded-xl shadow-sm border border-[#e5eeff]">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-primary">홈</button>
            <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
            <span>AI 도구 관리</span>
            <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
            <span className="text-primary font-semibold">{isAssessmentMode ? '도구 검토' : '도구 목록'}</span>
          </div>

          <div className="flex items-baseline gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {isAssessmentMode ? '사내 AI 모델 & 도구 적합성 검토' : '사내 승인 AI 모델 및 인프라 카탈로그'}
            </h1>
            <span className="font-code-sm text-code-sm px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
              ISMS-P 인증 목록
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            전사 정보보안 규정 및 Zero Data Retention SLA가 체결되어 사내 업무에 사용이 허가된 공인 생성형 AI 모델 및 격리망 인프라 현황입니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('new-use-case')}
          className="flex items-center gap-space-xs px-gutter py-space-sm rounded-lg bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:brightness-110 active:brightness-95 transition-all self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>이 도구로 과제 제안</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-[#e5eeff]">
        <div className="flex items-center gap-space-xs">
          {['전체', 'LLM', '코드', '멀티모달', '경량'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-space-md py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex items-center w-72 h-9 px-space-md bg-surface-container-low rounded-lg border border-outline-variant/30">
          <span className="material-symbols-outlined text-outline text-[18px] mr-space-xs">search</span>
          <input
            type="text"
            placeholder="모델명, 공급사 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline"
          />
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {filtered.map((tool) => (
          <div 
            key={tool.id}
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-[#e5eeff] flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between pb-space-xs">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    {tool.name}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary mt-0.5">{tool.vendor}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-code-sm text-code-sm font-bold ${
                  tool.status === '정식 승인' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800'
                }`}>
                  {tool.status}
                </span>
              </div>

              <div className="mt-space-md flex flex-col gap-space-xs font-body-sm text-body-sm">
                <div className="flex justify-between py-1 border-b border-[#e5eeff]/50">
                  <span className="text-secondary">배포 격리 환경</span>
                  <span className="font-semibold text-primary">{tool.deploymentType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e5eeff]/50">
                  <span className="text-secondary">보안 인증 규격</span>
                  <span className="font-medium text-on-surface text-right truncate max-w-[180px]" title={tool.securityCertification}>
                    {tool.securityCertification}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e5eeff]/50">
                  <span className="text-secondary">Zero Data Retention</span>
                  <span className="font-semibold text-tertiary">
                    {tool.zeroDataRetention ? 'SLA 보증됨' : '미체결'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-secondary">현재 연동 과제 수</span>
                  <span className="font-bold text-on-surface">{tool.activeProjectsCount}개 과제 활성</span>
                </div>
              </div>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-[#e5eeff] flex items-center justify-between">
              <span className="font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded text-secondary font-code-sm">
                보안 평가: {tool.complianceLevel} 등급
              </span>
              <button
                type="button"
                onClick={() => onNavigate('new-use-case')}
                className="text-primary hover:text-on-primary-fixed-variant font-label-md text-label-md font-semibold flex items-center gap-0.5"
              >
                <span>과제 등록하기</span>
                <span className="material-symbols-outlined text-body-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
