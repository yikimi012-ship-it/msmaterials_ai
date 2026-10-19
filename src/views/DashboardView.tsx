import React, { useState } from 'react';
import { UseCase, NavigationPath } from '../types';

interface DashboardViewProps {
  useCases: UseCase[];
  onNavigate: (path: NavigationPath) => void;
  onSelectCase: (caseId: string) => void;
  onOpenAuditLogs: () => void;
  onOpenSecurityChecklist: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  useCases,
  onNavigate,
  onSelectCase,
  onOpenAuditLogs,
  onOpenSecurityChecklist
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState('최근 30일 (2025.05.12 ~ 06.11)');
  const [selectedDept, setSelectedDept] = useState('전체 부서');
  const [selectedStatus, setSelectedStatus] = useState('전체 상태');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [batchApproveMode, setBatchApproveMode] = useState(false);
  const [selectedBatchCases, setSelectedBatchCases] = useState<string[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<{ month: string; reg: number; app: number } | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  // 5 Pending items for the action-required table
  const pendingCases = useCases.filter(c => 
    c.status === '보안 검토 중' || 
    c.status === '부서 검토 중' || 
    c.status === '시범 운영 중' || 
    c.status === '성과 평가 중' || 
    c.status === '보완 요청'
  ).slice(0, 5);

  const handleToggleBatchCase = (id: string) => {
    if (selectedBatchCases.includes(id)) {
      setSelectedBatchCases(selectedBatchCases.filter(c => c !== id));
    } else {
      setSelectedBatchCases([...selectedBatchCases, id]);
    }
  };

  const handleExecuteBatchApprove = () => {
    if (selectedBatchCases.length === 0) {
      alert('일괄 승인할 과제를 최소 1건 이상 선택해주세요.');
      return;
    }
    alert(`선택된 ${selectedBatchCases.length}건의 과제에 대해 1차 관리자 승인이 완료되었습니다.`);
    setSelectedBatchCases([]);
    setBatchApproveMode(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Command & Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">대시보드</h1>
            <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-code-sm text-code-sm font-semibold">
              ENT-PROD v2.4
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            전사 생성형 AI 과제의 승인, 보안 거버넌스, 시범 운영 상태 및 실질 정량 성과를 관제합니다.
          </p>
        </div>

        {/* Filters and Action Trigger */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center bg-surface-container-lowest shadow-sm rounded-lg p-1 border border-outline-variant/30">
            {/* Date filter */}
            <div className="flex items-center px-space-sm py-1 gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-body-sm text-outline">calendar_today</span>
              <select 
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer pr-space-xs"
              >
                <option>최근 30일 (2025.05.12 ~ 06.11)</option>
                <option>2025년 2분기</option>
                <option>2025년 1분기</option>
                <option>2024년 전체</option>
              </select>
            </div>

            <div className="w-px h-4 bg-outline-variant/40"></div>

            {/* Dept filter */}
            <div className="flex items-center px-space-sm py-1 gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-body-sm text-outline">corporate_fare</span>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer pr-space-xs"
              >
                <option>전체 부서</option>
                <option>IT / 개발본부</option>
                <option>마케팅 / 커뮤니케이션</option>
                <option>재무 / 회계팀</option>
                <option>고객지원실 (CX)</option>
                <option>인사 / 총무실</option>
                <option>법무 / 감사팀</option>
              </select>
            </div>

            <div className="w-px h-4 bg-outline-variant/40"></div>

            {/* Status filter */}
            <div className="flex items-center px-space-sm py-1 gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-body-sm text-outline">tune</span>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer pr-space-xs"
              >
                <option>전체 상태</option>
                <option>검토 대기</option>
                <option>시범 운영</option>
                <option>확대 승인</option>
              </select>
            </div>
          </div>

          {/* Refresh Button */}
          <button 
            type="button"
            onClick={handleRefresh}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary shadow-sm hover:bg-surface-container-low transition-colors border border-outline-variant/30" 
            title="지표 새로고침"
          >
            <span className={`material-symbols-outlined text-headline-md ${isRefreshing ? 'animate-spin' : ''}`}>
              sync
            </span>
          </button>

          {/* New Case Registration */}
          <button 
            type="button"
            onClick={() => onNavigate('new-use-case')}
            className="flex items-center gap-space-xs h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg shadow-sm font-label-md text-label-md transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-headline-md">add_circle</span>
            <span>+ AI 활용 과제 등록</span>
          </button>
        </div>
      </div>

      {/* KPI Grid (6 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-space-md">
        {/* KPI 1 */}
        <div 
          onClick={() => onNavigate('all-use-cases')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-[#e5eeff]"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-secondary font-medium uppercase tracking-wider">전체 활용 과제</span>
            <span className="px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface font-code-sm text-code-sm">정상 접수</span>
          </div>
          <div className="mt-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">148</span>
              <span className="font-label-md text-label-md text-on-surface-variant">건</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-tertiary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-body-sm">arrow_drop_up</span>
              <span className="font-semibold">전월 대비 +18건</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onNavigate('pending-reviews')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-[#e5eeff]"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-secondary font-medium uppercase tracking-wider">승인 대기</span>
            <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-code-sm text-code-sm font-semibold">집중 검토</span>
          </div>
          <div className="mt-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-error font-bold">19</span>
              <span className="font-label-md text-label-md text-on-surface-variant">건</span>
            </div>
            <div className="flex items-center gap-space-xs mt-1 text-on-surface-variant font-body-sm text-body-sm">
              <span>부서 8건</span>
              <span className="text-outline">·</span>
              <span className="text-error font-medium">보안 11건</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onNavigate('pilot-management')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-[#e5eeff]"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-secondary font-medium uppercase tracking-wider">시범 운영 중</span>
            <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-code-sm text-code-sm font-semibold">Active</span>
          </div>
          <div className="mt-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">24</span>
              <span className="font-label-md text-label-md text-on-surface-variant">건</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-body-sm">timelapse</span>
              <span>진행률 평균 68%</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onNavigate('performance-evaluation')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-[#e5eeff]"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-secondary font-medium uppercase tracking-wider">성과 평가 완료</span>
            <span className="px-space-xs py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-code-sm text-code-sm">누적 집계</span>
          </div>
          <div className="mt-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">38</span>
              <span className="font-label-md text-label-md text-on-surface-variant">건</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-tertiary-container font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-body-sm">check_circle</span>
              <span className="font-semibold">목표 달성률 92%</span>
            </div>
          </div>
        </div>

        {/* KPI 5 */}
        <div 
          onClick={() => onNavigate('all-use-cases')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-[#e5eeff]"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-secondary font-medium uppercase tracking-wider">확대 승인</span>
            <span className="px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-code-sm text-code-sm font-semibold">전사 도입</span>
          </div>
          <div className="mt-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-tertiary font-bold">29</span>
              <span className="font-label-md text-label-md text-on-surface-variant">건</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-body-sm text-tertiary">hub</span>
              <span>전사 확산 적용 14건</span>
            </div>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#e5eeff]">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-secondary font-medium uppercase tracking-wider">업무시간 절감</span>
            <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-semibold">ROI 3.8x</span>
          </div>
          <div className="mt-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-lg text-headline-lg text-primary font-bold">14,820</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">시간</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-label-sm text-label-sm truncate" title="월 환산 약 2.4억원 상당 가치">
              <span className="material-symbols-outlined text-body-sm text-primary">payments</span>
              <span>월 약 2.4억원 가치</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notice disclaimer */}
      <div className="flex items-center justify-between text-outline font-body-sm text-body-sm px-space-xs -mt-space-sm">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-body-sm">info</span>
          <span>※ 본 대시보드의 수치는 시스템 시범 운영용 예시 데이터이며, 실시간 사내 감사 로그와 5분 주기로 동기화됩니다.</span>
        </div>
        <span className="font-code-sm text-code-sm">마지막 갱신: 2025.06.11 15:42:09 KST</span>
      </div>

      {/* Analytical Charts Section (2x2 Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* Chart 1: 부서별 AI 활용 과제 수 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-[#e5eeff]">
          <div className="flex items-center justify-between pb-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-headline-md text-primary">domain_verification</span>
              <span className="font-headline-md text-headline-md text-on-surface">부서별 AI 활용 과제 수</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-xs py-0.5 rounded">
              상위 6개 본부
            </span>
          </div>

          <div className="flex flex-col gap-space-md mt-space-xs">
            {/* IT/개발 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface font-medium">IT / 개발본부</span>
                <span className="font-code-sm text-code-sm text-primary font-semibold">42건 <span className="text-outline font-normal">(92%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
              </div>
            </div>

            {/* 마케팅 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface font-medium">마케팅 / 커뮤니케이션</span>
                <span className="font-code-sm text-code-sm text-primary font-semibold">31건 <span className="text-outline font-normal">(74%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full transition-all duration-500" style={{ width: '74%' }}></div>
              </div>
            </div>

            {/* 재무/회계 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface font-medium">재무 / 회계팀</span>
                <span className="font-code-sm text-code-sm text-primary font-semibold">24건 <span className="text-outline font-normal">(55%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-surface-tint rounded-full transition-all duration-500" style={{ width: '55%' }}></div>
              </div>
            </div>

            {/* 고객지원실 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface font-medium">고객지원실 (CX)</span>
                <span className="font-code-sm text-code-sm text-primary font-semibold">21건 <span className="text-outline font-normal">(48%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: '48%' }}></div>
              </div>
            </div>

            {/* 인사/총무 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface font-medium">인사 / 총무실</span>
                <span className="font-code-sm text-code-sm text-primary font-semibold">18건 <span className="text-outline font-normal">(39%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-outline rounded-full transition-all duration-500" style={{ width: '39%' }}></div>
              </div>
            </div>

            {/* 법무/감사 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-md text-label-md">
                <span className="text-on-surface font-medium">법무 / 감사팀</span>
                <span className="font-code-sm text-code-sm text-primary font-semibold">12건 <span className="text-outline font-normal">(28%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-outline-variant rounded-full transition-all duration-500" style={{ width: '28%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: 월별 과제 등록 및 승인 추이 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-[#e5eeff] relative">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-headline-md text-primary">ssid_chart</span>
              <span className="font-headline-md text-headline-md text-on-surface">월별 과제 등록 및 승인 추이</span>
            </div>
            <div className="flex items-center gap-space-md font-label-sm text-label-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-on-surface-variant">등록 건수</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
                <span className="text-on-surface-variant">승인 건수</span>
              </div>
            </div>
          </div>

          {/* Compact SVG Trend Visualization */}
          <div className="w-full pt-space-md relative">
            <svg aria-label="월별 과제 추이 차트" className="w-full h-44 overflow-visible" viewBox="0 0 500 180">
              <defs>
                <linearGradient id="regGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0"></stop>
                </linearGradient>
                <linearGradient id="appGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006948" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#006948" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>

              {/* Horizontal Guides */}
              <line stroke="#e5eeff" strokeDasharray="3,3" strokeWidth="1" x1="20" x2="480" y1="20" y2="20"></line>
              <line stroke="#e5eeff" strokeDasharray="3,3" strokeWidth="1" x1="20" x2="480" y1="60" y2="60"></line>
              <line stroke="#e5eeff" strokeDasharray="3,3" strokeWidth="1" x1="20" x2="480" y1="100" y2="100"></line>
              <line stroke="#e5eeff" strokeWidth="1" x1="20" x2="480" y1="140" y2="140"></line>

              {/* Axis Y Labels */}
              <text className="font-code-sm fill-secondary text-[10px]" textAnchor="end" x="12" y="24">40</text>
              <text className="font-code-sm fill-secondary text-[10px]" textAnchor="end" x="12" y="64">30</text>
              <text className="font-code-sm fill-secondary text-[10px]" textAnchor="end" x="12" y="104">20</text>
              <text className="font-code-sm fill-secondary text-[10px]" textAnchor="end" x="12" y="144">0</text>

              {/* Area 1 (Registered) */}
              <polygon fill="url(#regGrad)" points="50,140 50,110 130,95 210,80 290,55 370,35 450,22 450,140"></polygon>

              {/* Area 2 (Approved) */}
              <polygon fill="url(#appGrad)" points="50,140 50,125 130,115 210,98 290,75 370,52 450,42 450,140"></polygon>

              {/* Line 1: Registered */}
              <polyline fill="none" points="50,110 130,95 210,80 290,55 370,35 450,22" stroke="#0037b0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>

              {/* Line 2: Approved */}
              <polyline fill="none" points="50,125 130,115 210,98 290,75 370,52 450,42" stroke="#006948" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>

              {/* Nodes: Registered */}
              <circle cx="50" cy="110" fill="#0037b0" r="4" className="cursor-pointer hover:r-6" onMouseEnter={() => setActiveTooltip({ month: '1월', reg: 15, app: 8 })}></circle>
              <circle cx="130" cy="95" fill="#0037b0" r="4" className="cursor-pointer hover:r-6" onMouseEnter={() => setActiveTooltip({ month: '2월', reg: 19, app: 11 })}></circle>
              <circle cx="210" cy="80" fill="#0037b0" r="4" className="cursor-pointer hover:r-6" onMouseEnter={() => setActiveTooltip({ month: '3월', reg: 24, app: 16 })}></circle>
              <circle cx="290" cy="55" fill="#0037b0" r="4" className="cursor-pointer hover:r-6" onMouseEnter={() => setActiveTooltip({ month: '4월', reg: 31, app: 22 })}></circle>
              <circle cx="370" cy="35" fill="#0037b0" r="4" className="cursor-pointer hover:r-6" onMouseEnter={() => setActiveTooltip({ month: '5월', reg: 36, app: 28 })}></circle>
              <circle cx="450" cy="22" fill="#0037b0" r="5" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:r-7" onMouseEnter={() => setActiveTooltip({ month: '6월 (진행)', reg: 39, app: 31 })}></circle>

              {/* Nodes: Approved */}
              <circle cx="50" cy="125" fill="#006948" r="3"></circle>
              <circle cx="130" cy="115" fill="#006948" r="3"></circle>
              <circle cx="210" cy="98" fill="#006948" r="3"></circle>
              <circle cx="290" cy="75" fill="#006948" r="3"></circle>
              <circle cx="370" cy="52" fill="#006948" r="3"></circle>
              <circle cx="450" cy="42" fill="#006948" r="4" stroke="#ffffff" strokeWidth="2"></circle>

              {/* X Labels */}
              <text className="font-label-sm fill-secondary text-[11px]" textAnchor="middle" x="50" y="160">1월</text>
              <text className="font-label-sm fill-secondary text-[11px]" textAnchor="middle" x="130" y="160">2월</text>
              <text className="font-label-sm fill-secondary text-[11px]" textAnchor="middle" x="210" y="160">3월</text>
              <text className="font-label-sm fill-secondary text-[11px]" textAnchor="middle" x="290" y="160">4월</text>
              <text className="font-label-sm fill-secondary text-[11px]" textAnchor="middle" x="370" y="160">5월</text>
              <text className="font-label-sm fill-primary font-bold text-[11px]" textAnchor="middle" x="450" y="160">6월(진행)</text>
            </svg>

            {activeTooltip && (
              <div className="absolute top-2 right-4 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded text-xs shadow-md flex items-center gap-2 pointer-events-none">
                <span className="font-bold">{activeTooltip.month}:</span>
                <span>등록 {activeTooltip.reg}건</span>
                <span>/</span>
                <span className="text-tertiary-fixed">승인 {activeTooltip.app}건</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-md py-space-xs rounded-lg">
            <span>당월 등록 건수: <strong className="text-on-surface font-semibold">39건</strong></span>
            <span>승인율: <strong className="text-tertiary-container font-semibold">78.4%</strong> (전월 대비 +4.2%p)</span>
          </div>
        </div>

        {/* Chart 3: 시범 운영 결과 분포 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-[#e5eeff]">
          <div className="flex items-center justify-between pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-headline-md text-primary">pie_chart</span>
              <span className="font-headline-md text-headline-md text-on-surface">시범 운영 결과 분포</span>
            </div>
            <span className="font-code-sm text-code-sm text-on-surface-variant">모수: 56건 완료 건</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center py-space-sm">
            {/* SVG Donut Chart */}
            <div className="md:col-span-5 flex items-center justify-center relative">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                {/* 52% 확대 승인 (green/tertiary) */}
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#006948" strokeDasharray="130.6 120.6" strokeDashoffset="0" strokeWidth="14"></circle>
                {/* 26% 조건부 보완 (primary/blue) */}
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#1d4ed8" strokeDasharray="65.3 185.9" strokeDashoffset="-130.6" strokeWidth="14"></circle>
                {/* 14% 시범 연장 (secondary-dim) */}
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#bec6e0" strokeDasharray="35.1 216.1" strokeDashoffset="-195.9" strokeWidth="14"></circle>
                {/* 8% 도입 중단 (error) */}
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#ba1a1a" strokeDasharray="20.1 231.1" strokeDashoffset="-231" strokeWidth="14"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">52%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">확대 승인율</span>
              </div>
            </div>

            {/* Legend & Breakdown Metrics */}
            <div className="md:col-span-7 flex flex-col gap-space-xs">
              <div className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-sm bg-tertiary-container"></span>
                  <span className="font-label-md text-label-md text-on-surface font-medium">확대 승인 (전사/본부)</span>
                </div>
                <div className="font-code-sm text-code-sm">
                  <span className="font-bold text-on-surface">29건</span> <span className="text-outline">(52%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
                  <span className="font-label-md text-label-md text-on-surface font-medium">조건부 보완</span>
                </div>
                <div className="font-code-sm text-code-sm">
                  <span className="font-bold text-on-surface">15건</span> <span className="text-outline">(26%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-sm bg-secondary-fixed-dim"></span>
                  <span className="font-label-md text-label-md text-on-surface font-medium">시범 연장 (추가 검증)</span>
                </div>
                <div className="font-code-sm text-code-sm">
                  <span className="font-bold text-on-surface">8건</span> <span className="text-outline">(14%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-sm bg-error"></span>
                  <span className="font-label-md text-label-md text-on-surface font-medium">도입 중단 / 반려</span>
                </div>
                <div className="font-code-sm text-code-sm">
                  <span className="font-bold text-on-surface">4건</span> <span className="text-outline">(8%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-outline font-body-sm text-body-sm pt-space-xs border-t border-[#e5eeff]/50">
            * 보안 부적합 또는 성능 미달 과제 4건은 안전하게 샌드박스 파기 조치 완료됨.
          </div>
        </div>

        {/* Chart 4: 업무 유형별 시간 절감 현황 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-[#e5eeff]">
          <div className="flex items-center justify-between pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-headline-md text-primary">schedule</span>
              <span className="font-headline-md text-headline-md text-on-surface">업무 유형별 시간 절감 현황</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary-container font-semibold">합계 14,820 시간</span>
          </div>

          <div className="flex flex-col gap-space-sm">
            {/* Item 1 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">문서 요약 및 대량 리포트 분석</span>
                <span className="font-code-sm text-code-sm text-primary font-bold">4,250시간</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">소스코드 리뷰 및 단위 테스트 자동화</span>
                <span className="font-code-sm text-code-sm text-primary font-bold">3,980시간</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div className="bg-primary-container h-2 rounded-full" style={{ width: '93.6%' }}></div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">고객 문의 응대 초안 생성 및 분류</span>
                <span className="font-code-sm text-code-sm text-primary font-bold">3,420시간</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div className="bg-surface-tint h-2 rounded-full" style={{ width: '80.4%' }}></div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">시장 조사 및 사업계획서 템플릿 작성</span>
                <span className="font-code-sm text-code-sm text-primary font-bold">2,150시간</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '50.5%' }}></div>
              </div>
            </div>

            {/* Item 5 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center font-label-md text-label-md">
                <span className="text-on-surface">다국어 번역 및 기술용어 로컬라이제이션</span>
                <span className="font-code-sm text-code-sm text-primary font-bold">1,020시간</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div className="bg-secondary-fixed-dim h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm pt-space-xs border-t border-[#e5eeff]/50">
            <span className="material-symbols-outlined text-body-sm text-tertiary">trending_up</span>
            <span>직원 1인당 주당 평균 3.4시간 업무 집중도 향상 효과 확인</span>
          </div>
        </div>
      </section>

      {/* Split Operational Hub: Action Required Table + Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Action-Required Items (8 Cols) */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between border border-[#e5eeff]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-headline-md text-error">notification_important</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">업무 처리 필요 항목</h2>
                <span className="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold">
                  5건 대기
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => onNavigate('pending-reviews')}
                className="flex items-center gap-0.5 font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors"
              >
                <span>미결 과제 전체보기</span>
                <span className="material-symbols-outlined text-body-sm">arrow_forward</span>
              </button>
            </div>

            {/* High-density Data Table */}
            <div className="overflow-x-auto -mx-space-lg px-space-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                    {batchApproveMode && (
                      <th className="py-2.5 px-space-sm w-10 text-center">선택</th>
                    )}
                    <th className="py-2.5 px-space-sm font-semibold">과제 번호 / 과제명</th>
                    <th className="py-2.5 px-space-sm font-semibold">신청 부서</th>
                    <th className="py-2.5 px-space-sm font-semibold">현재 상태</th>
                    <th className="py-2.5 px-space-sm font-semibold">처리 담당자</th>
                    <th className="py-2.5 px-space-sm font-semibold text-center">처리 기한</th>
                    <th className="py-2.5 px-space-sm font-semibold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {pendingCases.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                      {batchApproveMode && (
                        <td className="py-space-sm px-space-sm text-center">
                          <input 
                            type="checkbox"
                            checked={selectedBatchCases.includes(item.id)}
                            onChange={() => handleToggleBatchCase(item.id)}
                            className="accent-primary w-4 h-4 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="py-space-sm px-space-sm">
                        <div className="flex flex-col">
                          <span className="font-code-sm text-code-sm text-secondary font-medium">
                            {item.id}
                          </span>
                          <span 
                            onClick={() => onSelectCase(item.id)}
                            className="font-label-md text-label-md text-on-surface font-semibold hover:text-primary cursor-pointer truncate max-w-xs" 
                            title={item.title}
                          >
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-sm px-space-sm font-body-sm text-body-sm text-on-surface">
                        {item.department}
                      </td>
                      <td className="py-space-sm px-space-sm">
                        <span className={`px-2 py-0.5 rounded-full font-code-sm text-code-sm font-medium ${
                          item.status === '보안 검토 중' ? 'bg-secondary-container text-on-secondary-container' :
                          item.status === '부서 검토 중' ? 'bg-secondary-container text-on-secondary-container' :
                          item.status === '시범 운영 중' ? 'bg-primary-fixed text-on-primary-fixed-variant' :
                          item.status === '성과 평가 중' ? 'bg-surface-container-high text-primary' :
                          'bg-error-container text-on-error-container'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-space-sm px-space-sm font-body-sm text-body-sm text-on-surface-variant">
                        {item.reviewer.name} {item.reviewer.role} ({item.reviewer.team})
                      </td>
                      <td className="py-space-sm px-space-sm text-center">
                        {item.urgencyDays === 1 ? (
                          <span className="px-2 py-0.5 rounded font-code-sm text-code-sm font-bold bg-error-container text-on-error-container">
                            D-1 (06.12)
                          </span>
                        ) : item.urgencyDays === 2 ? (
                          <span className="px-2 py-0.5 rounded font-code-sm text-code-sm font-semibold bg-surface-container-high text-on-surface">
                            D-2 (06.13)
                          </span>
                        ) : item.urgencyDays === 3 ? (
                          <span className="px-2 py-0.5 rounded font-code-sm text-code-sm font-semibold bg-surface-container-high text-on-surface">
                            D-3 (06.14)
                          </span>
                        ) : item.status === '시범 운영 중' ? (
                          <span className="px-2 py-0.5 rounded font-code-sm text-code-sm text-secondary font-medium">
                            평가 (06.20)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded font-label-sm text-label-sm text-error font-medium">
                            보완 작성 중
                          </span>
                        )}
                      </td>
                      <td className="py-space-sm px-space-sm text-right">
                        <button 
                          type="button"
                          onClick={() => onSelectCase(item.id)}
                          className="px-space-sm py-1 bg-surface-container hover:bg-surface-container-high rounded text-primary font-label-sm text-label-sm transition-colors"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Guidance Footer inside Card */}
          <div className="flex items-center justify-between pt-space-md text-outline font-label-sm text-label-sm border-t border-[#e5eeff]">
            <span>* 미결 기한 D-1 이내 과제는 주관 본부장에게 자동 에스컬레이션 메일이 발송됩니다.</span>
            {batchApproveMode ? (
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => setBatchApproveMode(false)}
                  className="text-secondary hover:underline"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleExecuteBatchApprove}
                  className="px-space-sm py-1 bg-primary text-on-primary rounded font-label-sm font-semibold shadow-sm"
                >
                  선택한 {selectedBatchCases.length}건 일괄 승인
                </button>
              </div>
            ) : (
              <span 
                onClick={() => setBatchApproveMode(true)}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                일괄 승인 모드
              </span>
            )}
          </div>
        </section>

        {/* Recent Activity Timeline & Visual Asset (4 Cols) */}
        <section className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Activity Feed */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-headline-md text-primary">history</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">최근 활동 이력</h2>
              </div>
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            </div>

            <div className="flex flex-col gap-space-md mt-space-xs">
              {/* Timeline Item 1 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-body-sm">assignment_turned_in</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">신제품 카피라이팅</span>
                    <span className="font-code-sm text-code-sm text-outline shrink-0">10분 전</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    마케팅팀 <strong className="text-on-surface font-medium">박수아 프로</strong>가 시범 운영 완료 보고서를 제출했습니다.
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center shrink-0 text-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-body-sm">security</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">사내 보안성 검토 승인</span>
                    <span className="font-code-sm text-code-sm text-outline shrink-0">42분 전</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    보안감사팀이 <strong className="text-on-surface font-medium">[AI-2025-077]</strong>의 격리망 테스트를 통과 처리했습니다.
                  </p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0 text-on-primary-fixed">
                  <span className="material-symbols-outlined text-body-sm">rocket_launch</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">전사 확대 배포 개시</span>
                    <span className="font-code-sm text-code-sm text-outline shrink-0">2시간 전</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    <strong className="text-on-surface font-medium">재무제표 OCR 자동 파싱</strong> 모델이 전 부서에 활성화되었습니다.
                  </p>
                </div>
              </div>

              {/* Timeline Item 4 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center shrink-0 text-on-error-container">
                  <span className="material-symbols-outlined text-body-sm">warning</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">보안 가이드 보완 요청</span>
                    <span className="font-code-sm text-code-sm text-outline shrink-0">4시간 전</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    인사기밀 유출 방지 필터링 미흡으로 <strong className="text-on-surface font-medium">[AI-2025-062]</strong> 반려되었습니다.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAuditLogs}
              className="mt-space-md pt-space-xs text-center font-label-md text-label-md text-secondary hover:text-on-surface transition-colors border-t border-[#e5eeff]"
            >
              감사 로그 전체 보기 →
            </button>
          </div>

          {/* Governance Assurance Banner */}
          <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-space-md overflow-hidden flex flex-col justify-between border border-[#e5eeff]">
            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm font-semibold uppercase">
                <span className="material-symbols-outlined text-body-sm">verified_user</span>
                <span>AI Governance Framework 2.0</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">
                안전한 사내 생성형 AI 확장
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                망분리 규제 준수 및 제3자 모델 데이터 미학습 협약이 체결된 환경에서만 시범 운영이 허가됩니다.
              </p>
            </div>

            <div className="relative z-10 mt-space-md flex items-center justify-between pt-space-xs">
              <button
                type="button"
                onClick={onOpenSecurityChecklist}
                className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant font-semibold flex items-center gap-0.5"
              >
                <span>보안 감사 체크리스트</span>
                <span className="material-symbols-outlined text-body-sm">chevron_right</span>
              </button>
              <span className="font-code-sm text-code-sm bg-surface-container-low px-space-xs py-0.5 rounded text-secondary">
                SecOps 연동됨
              </span>
            </div>

            {/* Ambient decorative graphic */}
            <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 pointer-events-none text-primary">
              <svg fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z"></path>
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
