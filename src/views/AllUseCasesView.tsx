import React, { useState, useMemo } from 'react';
import { UseCase, NavigationPath } from '../types';

interface AllUseCasesViewProps {
  useCases: UseCase[];
  onNavigate: (path: NavigationPath) => void;
  onSelectCase: (caseId: string) => void;
  filterMode?: 'all' | 'my' | 'pending';
}

export const AllUseCasesView: React.FC<AllUseCasesViewProps> = ({
  useCases,
  onNavigate,
  onSelectCase,
  filterMode = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(
    filterMode === 'pending' ? '보안 검토 중' : ''
  );
  const [selectedTool, setSelectedTool] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'reviewing' | 'pilot' | 'completed' | 'rejected'>('all');
  const [sortField, setSortField] = useState<'id' | 'title' | 'date'>('id');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter logic
  const filteredCases = useMemo(() => {
    return useCases.filter((c) => {
      // Filter mode: my applications vs pending reviews vs all
      if (filterMode === 'my' && c.applicant.name !== '송민아') {
        // mock user applicant
        return false;
      }
      if (filterMode === 'pending' && !['보안 검토 중', '부서 검토 중'].includes(c.status)) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = 
          c.id.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.department.toLowerCase().includes(query) ||
          c.applicant.name.toLowerCase().includes(query) ||
          c.reviewer.name.toLowerCase().includes(query) ||
          c.selectedTool.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Dropdown filters
      if (selectedDept && c.department !== selectedDept) return false;
      if (selectedStatus && c.status !== selectedStatus) return false;
      if (selectedTool && !c.selectedTool.includes(selectedTool)) return false;

      // Tab pills
      if (activeTab === 'reviewing' && !['보안 검토 중', '부서 검토 중'].includes(c.status)) return false;
      if (activeTab === 'pilot' && c.status !== '시범 운영 중') return false;
      if (activeTab === 'completed' && !['확대 승인', '승인 완료'].includes(c.status)) return false;
      if (activeTab === 'rejected' && !['보완 요청', '반려'].includes(c.status)) return false;

      return true;
    }).sort((a, b) => {
      if (sortField === 'id') {
        return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      if (sortField === 'title') {
        return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      if (sortField === 'date') {
        return sortAsc ? a.createdDate.localeCompare(b.createdDate) : b.createdDate.localeCompare(a.createdDate);
      }
      return 0;
    });
  }, [useCases, filterMode, searchQuery, selectedDept, selectedStatus, selectedTool, activeTab, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const paginatedCases = filteredCases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('');
    setSelectedStatus('');
    setSelectedTool('');
    setActiveTab('all');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ['과제번호', '과제명', '신청부서', '신청자', '후보 AI 도구', '현재 상태', '검토 담당자', '등록일'];
    const rows = filteredCases.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.department,
      `${c.applicant.name} ${c.applicant.role}`,
      c.selectedTool,
      c.status,
      `${c.reviewer.name} ${c.reviewer.role}`,
      c.createdDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AI_WorkHub_UseCases_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Breadcrumb & Page Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-gutter-lg rounded-xl shadow-sm border border-[#e5eeff]">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span>홈</span>
            <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
            <span>AI 활용 과제</span>
            <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
            <span className="text-primary font-semibold">
              {filterMode === 'my' ? '내 신청 과제' : filterMode === 'pending' ? '검토 대기 과제' : '전체 과제'}
            </span>
          </div>

          <div className="flex items-baseline gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {filterMode === 'my' ? '내 신청 과제 관리' : filterMode === 'pending' ? '거버넌스 검토 대기 과제' : 'AI 활용 과제'}
            </h1>
            <span className="font-code-sm text-code-sm px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
              전사 관리 대장
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            사내에서 제안 및 추진 중인 생성형 AI 활용 과제의 생애주기와 검토 진행 상황을 체계적으로 거버넌스 및 모니터링합니다.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button 
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>일괄 내보내기</span>
          </button>

          <button 
            type="button"
            onClick={() => onNavigate('new-use-case')}
            className="flex items-center gap-space-xs px-gutter py-space-sm rounded-lg bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:brightness-110 active:brightness-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>신규 과제 등록</span>
          </button>
        </div>
      </div>

      {/* Operational Status KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-[#e5eeff]">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">전체 등록 과제</span>
            <span className="font-headline-xl text-headline-xl text-on-surface mt-space-xs tracking-tight">
              148<span className="font-label-md text-label-md font-normal text-on-surface-variant ml-1">건</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">folder_managed</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-[#e5eeff]">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">거버넌스 검토 중</span>
            <span className="font-headline-xl text-headline-xl text-primary-container mt-space-xs tracking-tight">
              19<span className="font-label-md text-label-md font-normal text-on-surface-variant ml-1">건</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-[#e5eeff]">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">시범 운영 진행</span>
            <span className="font-headline-xl text-headline-xl text-tertiary mt-space-xs tracking-tight">
              24<span className="font-label-md text-label-md font-normal text-on-surface-variant ml-1">건</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-[#e5eeff]">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">전사 배포 및 승인</span>
            <span className="font-headline-xl text-headline-xl text-secondary mt-space-xs tracking-tight">
              58<span className="font-label-md text-label-md font-normal text-on-surface-variant ml-1">건</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar Pane */}
      <div className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-[#e5eeff]">
        {/* First Row: Keyword Search + Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative flex items-center h-9 px-space-md bg-surface-container-low rounded-lg focus-within:bg-surface-container-lowest focus-within:shadow-[0_0_0_2px_#1d4ed8] transition-all border border-transparent focus-within:border-primary">
            <span className="material-symbols-outlined text-outline text-[18px] mr-space-xs">search</span>
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="과제명 또는 과제번호 검색 (예: AI-2025-001)"
              className="w-full bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface placeholder:text-outline"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="md:col-span-2 relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-9 px-space-md pr-8 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border-none outline-none appearance-none cursor-pointer hover:bg-surface-container transition-colors"
            >
              <option value="">전체 부서 (IT, 마케팅 등)</option>
              <option value="고객지원실">고객지원실</option>
              <option value="재무/회계팀">재무/회계팀</option>
              <option value="IT개발1팀">IT개발1팀</option>
              <option value="마케팅팀">마케팅팀</option>
              <option value="영업기획팀">영업기획팀</option>
              <option value="법무/감사팀">법무/감사팀</option>
              <option value="IT / 개발본부">IT / 개발본부</option>
              <option value="인사 / 총무실">인사 / 총무실</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-outline text-[16px]">expand_more</span>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2 relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-9 px-space-md pr-8 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border-none outline-none appearance-none cursor-pointer hover:bg-surface-container transition-colors"
            >
              <option value="">전체 상태 (검토, 승인 등)</option>
              <option value="보안 검토 중">보안 검토 중</option>
              <option value="부서 검토 중">부서 검토 중</option>
              <option value="시범 운영 중">시범 운영 중</option>
              <option value="확대 승인">확대 승인</option>
              <option value="성과 평가 중">성과 평가 중</option>
              <option value="보완 요청">보완 요청</option>
              <option value="승인 완료">승인 완료</option>
              <option value="반려">반려</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-outline text-[16px]">expand_more</span>
          </div>

          {/* AI Tool Filter */}
          <div className="md:col-span-2 relative">
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full h-9 px-space-md pr-8 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border-none outline-none appearance-none cursor-pointer hover:bg-surface-container transition-colors"
            >
              <option value="">후보 AI 도구 (전체)</option>
              <option value="Azure OpenAI">Azure OpenAI GPT-4o</option>
              <option value="Claude">Claude 3.5 Sonnet</option>
              <option value="Llama-3">사내 자체 RAG</option>
              <option value="ChatGPT">ChatGPT Enterprise</option>
              <option value="Gemini">Gemini 1.5 Pro</option>
              <option value="Copilot">GitHub Copilot</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-outline text-[16px]">expand_more</span>
          </div>

          {/* Date Range Filter */}
          <div className="md:col-span-2 flex items-center justify-between h-9 px-space-md bg-surface-container-low rounded-lg text-on-surface-variant font-code-sm text-code-sm">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
              2025.01 ~ 06.30
            </span>
            <button 
              type="button" 
              onClick={handleResetFilters}
              className="hover:text-primary transition-colors" 
              title="초기화"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        </div>

        {/* Second Row: State Metric Chips + Reset Action */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-[#e5eeff]/50">
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              type="button"
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              className={`px-space-md py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              전체 과제 (148)
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('reviewing'); setCurrentPage(1); }}
              className={`px-space-md py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                activeTab === 'reviewing'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              검토 진행 중 (19)
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('pilot'); setCurrentPage(1); }}
              className={`px-space-md py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                activeTab === 'pilot'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              시범 운영 (24)
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('completed'); setCurrentPage(1); }}
              className={`px-space-md py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                activeTab === 'completed'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              완료 및 확대 (58)
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('rejected'); setCurrentPage(1); }}
              className={`px-space-md py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              보완 및 반려 (47)
            </button>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors px-space-sm py-1"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>필터 초기화</span>
            </button>
            <span className="h-3 w-px bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-outline">
              조회 결과: <strong className="text-on-surface font-semibold">{filteredCases.length}</strong>건
            </span>
          </div>
        </div>
      </div>

      {/* Enterprise Dense Data Table Pane */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-[#e5eeff]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase">
                <th className="py-space-md px-space-md font-semibold text-center w-32">
                  <div 
                    onClick={() => {
                      if (sortField === 'id') setSortAsc(!sortAsc);
                      else { setSortField('id'); setSortAsc(false); }
                    }}
                    className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary select-none"
                  >
                    <span>과제번호</span>
                    <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                  </div>
                </th>
                <th className="py-space-md px-space-md font-semibold min-w-[280px]">
                  <div 
                    onClick={() => {
                      if (sortField === 'title') setSortAsc(!sortAsc);
                      else { setSortField('title'); setSortAsc(true); }
                    }}
                    className="flex items-center gap-1 cursor-pointer hover:text-primary select-none"
                  >
                    <span>과제명</span>
                    <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                  </div>
                </th>
                <th className="py-space-md px-space-md font-semibold w-28">신청 부서</th>
                <th className="py-space-md px-space-md font-semibold w-28">신청자</th>
                <th className="py-space-md px-space-md font-semibold min-w-[180px]">후보 AI 도구</th>
                <th className="py-space-md px-space-md font-semibold text-center w-32">현재 상태</th>
                <th className="py-space-md px-space-md font-semibold min-w-[150px]">검토 담당자</th>
                <th className="py-space-md px-space-md font-semibold text-center w-28">
                  <div 
                    onClick={() => {
                      if (sortField === 'date') setSortAsc(!sortAsc);
                      else { setSortField('date'); setSortAsc(false); }
                    }}
                    className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary select-none"
                  >
                    <span>등록일</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                  </div>
                </th>
                <th className="py-space-md px-space-md font-semibold min-w-[160px]">다음 처리 단계</th>
                <th className="py-space-md px-space-md font-semibold text-center w-24">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-outline font-body-md">
                    검색 조건에 일치하는 AI 과제가 없습니다.
                  </td>
                </tr>
              ) : (
                paginatedCases.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/70 transition-colors group">
                    <td className="py-space-sm px-space-md text-center font-code-sm text-code-sm text-primary font-medium">
                      {item.id}
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="flex flex-col gap-0.5">
                        <div 
                          onClick={() => onSelectCase(item.id)}
                          className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="truncate">{item.title}</span>
                          <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity text-primary">arrow_forward</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-space-sm px-space-md text-on-surface">
                      {item.department}
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.applicant.name}</span>
                        <span className="font-label-sm text-label-sm text-outline">{item.applicant.role}</span>
                      </div>
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
                        <span className={`w-2 h-2 rounded-full ${
                          item.selectedTool.includes('Azure') ? 'bg-primary-container' :
                          item.selectedTool.includes('Claude') ? 'bg-surface-tint' :
                          item.selectedTool.includes('Llama') ? 'bg-tertiary' :
                          item.selectedTool.includes('ChatGPT') ? 'bg-tertiary-container' :
                          item.selectedTool.includes('Gemini') ? 'bg-secondary' :
                          'bg-inverse-surface'
                        }`}></span>
                        <span>{item.selectedTool}</span>
                      </div>
                    </td>
                    <td className="py-space-sm px-space-md text-center">
                      <span className={`inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        item.status === '보안 검토 중' ? 'bg-secondary-container text-on-secondary-fixed' :
                        item.status === '부서 검토 중' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                        item.status === '시범 운영 중' ? 'bg-surface-container-high text-primary' :
                        item.status === '확대 승인' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                        item.status === '성과 평가 중' ? 'bg-surface-container-high text-on-surface' :
                        item.status === '보완 요청' ? 'bg-error-container text-on-error-container' :
                        item.status === '승인 완료' ? 'bg-surface-container-low text-primary' :
                        'bg-surface-container text-outline'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === '시범 운영 중' ? 'bg-primary animate-pulse' :
                          item.status === '확대 승인' ? 'bg-tertiary' :
                          item.status === '보완 요청' ? 'bg-error' :
                          'bg-secondary'
                        }`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-label-sm text-label-sm font-semibold text-primary shrink-0">
                          {item.reviewer.avatarLetter || item.reviewer.name.slice(0, 1)}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium leading-none truncate">{item.reviewer.name} {item.reviewer.role}</span>
                          <span className="font-label-sm text-label-sm text-outline mt-0.5 truncate">{item.reviewer.team}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-space-sm px-space-md text-center font-code-sm text-code-sm text-on-surface-variant">
                      {item.createdDate}
                    </td>
                    <td className="py-space-sm px-space-md">
                      <span className={`font-label-sm text-label-sm px-space-xs py-0.5 rounded font-medium ${
                        item.nextStep.includes('보안성') ? 'bg-error-container text-on-error-container' :
                        item.nextStep.includes('라이선스') ? 'text-tertiary font-bold' :
                        item.nextStep.includes('중간 점검') ? 'text-primary' :
                        'text-on-surface-variant'
                      }`}>
                        {item.nextStep}
                      </span>
                    </td>
                    <td className="py-space-sm px-space-md text-center">
                      <button
                        type="button"
                        onClick={() => onSelectCase(item.id)}
                        className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-colors font-medium shadow-xs"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md px-gutter-lg py-space-md bg-surface-container-lowest border-t border-[#e5eeff]">
          {/* Left: Item count & Page limit select */}
          <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
            <span>
              전체 <strong className="text-on-surface font-semibold">{filteredCases.length}</strong>건 중{' '}
              <strong className="text-on-surface font-semibold">
                {filteredCases.length === 0 ? '0' : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredCases.length)}`}
              </strong>건 표시
            </span>
            <span className="h-3 w-px bg-outline-variant"></span>
            <div className="flex items-center gap-1.5">
              <span>페이지당</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-7 pl-2 pr-6 bg-surface-container-low rounded font-label-sm text-label-sm text-on-surface border-none outline-none cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <option value={8}>8개씩 보기</option>
                  <option value={10}>10개씩 보기</option>
                  <option value={20}>20개씩 보기</option>
                  <option value={50}>50개씩 보기</option>
                </select>
                <span className="material-symbols-outlined absolute right-1 top-1.5 pointer-events-none text-outline text-[14px]">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Center: Pagination Controls */}
          <div className="flex items-center gap-1 font-label-md text-label-md">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="w-8 h-8 flex items-center justify-center rounded text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-40"
              title="처음 페이지"
            >
              <span className="material-symbols-outlined text-[16px]">keyboard_double_arrow_left</span>
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-8 h-8 flex items-center justify-center rounded text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-40"
              title="이전 페이지"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-8 h-8 flex items-center justify-center rounded text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-40"
              title="다음 페이지"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="w-8 h-8 flex items-center justify-center rounded text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-40"
              title="마지막 페이지"
            >
              <span className="material-symbols-outlined text-[16px]">keyboard_double_arrow_right</span>
            </button>
          </div>

          {/* Right: Excel Download Button */}
          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-sm border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">table_view</span>
              <span>엑셀 다운로드</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
