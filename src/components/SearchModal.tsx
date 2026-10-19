import React, { useState, useEffect } from 'react';
import { UseCase, AITool } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  useCases: UseCase[];
  aiTools: AITool[];
  onSelectCase: (caseId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  useCases,
  aiTools,
  onSelectCase
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCases = query.trim() === ''
    ? useCases.slice(0, 4)
    : useCases.filter(c => 
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.department.toLowerCase().includes(query.toLowerCase()) ||
        c.selectedTool.toLowerCase().includes(query.toLowerCase())
      );

  const filteredTools = query.trim() === ''
    ? aiTools.slice(0, 3)
    : aiTools.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.vendor.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-gutter bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-space-md py-space-sm border-b border-[#e5eeff] gap-space-sm bg-surface-container-lowest">
          <span className="material-symbols-outlined text-headline-md text-primary">search</span>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none font-body-lg text-body-lg text-on-surface placeholder:text-outline"
            placeholder="과제명, 과제번호 (AI-2025-...), 부서, AI 모델 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-body-md">close</span>
            </button>
          )}
          <kbd className="font-code-sm text-code-sm bg-surface-container px-space-xs py-0.5 rounded text-outline">ESC</kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-space-md flex flex-col gap-space-md">
          {/* Use Cases Section */}
          <div>
            <div className="flex items-center justify-between pb-space-xs text-outline font-label-sm text-label-sm uppercase">
              <span>AI 활용 과제 ({filteredCases.length})</span>
              <span>선택하여 바로가기</span>
            </div>
            {filteredCases.length === 0 ? (
              <div className="p-space-md text-center text-outline font-body-sm">
                검색된 AI 활용 과제가 없습니다.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="font-code-sm text-code-sm text-primary font-semibold shrink-0">
                        {c.id}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate">
                          {c.title}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                          {c.department} · {c.selectedTool}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-code-sm text-code-sm shrink-0">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Tools Section */}
          <div className="border-t border-[#e5eeff] pt-space-sm">
            <div className="flex items-center justify-between pb-space-xs text-outline font-label-sm text-label-sm uppercase">
              <span>승인 AI 모델 & 도구 ({filteredTools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
              {filteredTools.map((t) => (
                <div 
                  key={t.id}
                  className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{t.name}</span>
                    <span className="font-body-sm text-body-sm text-outline">{t.vendor} · {t.deploymentType}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm">
                    {t.complianceLevel} 등급
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-space-sm bg-surface-container-low border-t border-[#e5eeff] flex items-center justify-between text-outline font-label-sm text-label-sm">
          <span>방향키 또는 클릭으로 이동</span>
          <button 
            type="button" 
            onClick={onClose}
            className="hover:text-on-surface underline"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
