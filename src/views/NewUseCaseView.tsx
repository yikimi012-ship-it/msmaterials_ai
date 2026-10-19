import React, { useState } from 'react';
import { UseCase, NavigationPath } from '../types';

interface NewUseCaseViewProps {
  onNavigate: (path: NavigationPath) => void;
  onSubmitNewCase: (newCase: UseCase) => void;
  onCancel: () => void;
}

export const NewUseCaseView: React.FC<NewUseCaseViewProps> = ({
  onNavigate,
  onSubmitNewCase,
  onCancel
}) => {
  // Step 1: Basic Info
  const [title, setTitle] = useState('고객 상담 로그 실시간 민감정보 마스킹 및 요약 자동화');
  const [department, setDepartment] = useState('고객지원실');
  const [applicantName] = useState('송민아 대리 (고객상담파트)');
  const [sameAsApplicant, setSameAsApplicant] = useState(true);
  const [assigneeName, setAssigneeName] = useState('송민아 대리 (고객상담파트 / 내선 4492)');
  const [targetTask, setTargetTask] = useState('고객 인바운드 통화 후속 VOC 기록 및 CRM 티켓 생성 업무');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'adhoc'>('daily');
  const [currentProcess, setCurrentProcess] = useState(
    '상담원이 고객 통화 종료 후 녹취록을 청취하며 직접 수기 메모 작성 및 사내 CRM 티켓 시스템에 요약 내용을 입력하고 있음. 피크 시간대에는 메모 지연으로 VOC 상세 내용 누락 발생.'
  );

  // Step 2: Objectives & ROI
  const [problems, setProblems] = useState(
    '통화 후 후처리(ACW) 시간 과다 소요(건당 평균 8~12분), 상담원별 요약 포맷 불일치로 인계 시 오인지 발생, 악성 민원이나 긴급 불만 사항에 대한 즉각적인 태깅 누락 위험 높음.'
  );
  const [aiObjective, setAiObjective] = useState(
    '통화 녹취 텍스트(STT 변환본)를 LLM을 통해 30초 내 표준 포맷으로 구조화 요약 및 고객 감정/핵심 키워드를 자동 추출하여 상담원 후처리 업무를 최소화하고 피로도를 대폭 경감함.'
  );
  const [timePerTask, setTimePerTask] = useState<number>(10);
  const [monthlyVolume, setMonthlyVolume] = useState<number>(3500);

  // Step 3: Tool & Security
  const [selectedTool, setSelectedTool] = useState('Azure OpenAI GPT-4o');
  const [accountType, setAccountType] = useState<'기업 엔터프라이즈' | '팀 워크스페이스' | 'API 직접 연동'>('기업 엔터프라이즈');
  const [dataTypePublic, setDataTypePublic] = useState(false);
  const [dataTypeInternal, setDataTypeInternal] = useState(true);
  const [dataTypePII, setDataTypePII] = useState(true);
  const [dataTypePartner, setDataTypePartner] = useState(true);
  const [dataTypeSecret, setDataTypeSecret] = useState(false);
  const [transferPath, setTransferPath] = useState('cloud-mtls');
  const [crmIntegration, setCrmIntegration] = useState(true);
  const [sttIntegration, setSttIntegration] = useState(true);
  const [erpIntegration, setErpIntegration] = useState(false);

  // Step 4: Pilot Plan
  const [pilotDuration, setPilotDuration] = useState('2025.07.01 ~ 2025.08.31 (2개월)');
  const [pilotMembers, setPilotMembers] = useState<string[]>(['고객지원1팀 상담원 10명', 'QA 매니저 2명']);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [costEstimation, setCostEstimation] = useState('월 API 호출료 약 450,000원 예상 (Azure 전용 크레딧 차감)');
  const [qaLead, setQaLead] = useState('최영준 팀장 (고객지원실 품질관리파트 / 사번 21094)');
  const [kpiMetrics, setKpiMetrics] = useState('건당 후처리 시간 10분 -> 3분 단축, 요약 정확도 95% 이상 달성, 상담원 VOC 입력 피로도 40% 완화');
  const [riskMitigation, setRiskMitigation] = useState(
    "AI 환각(Hallucination)으로 인한 잘못된 클레임 요약 방지를 위해 상담원의 최종 '수정 및 승인 후 전송(Human-in-the-loop)' 단계를 의무화하며, 오류 발견 시 원클릭 오답 신고 피드백 핫라인 채널을 운영함."
  );

  // System States
  const [saveTime, setSaveTime] = useState('오늘 14:22:15');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time ROI calculation
  const totalMinutesSaved = (monthlyVolume || 0) * (timePerTask || 0) * 0.7;
  const hoursSaved = Math.round(totalMinutesSaved / 60);
  const manMonth = (hoursSaved / 160).toFixed(1);

  const handleAddMember = () => {
    if (newMemberInput.trim()) {
      setPilotMembers([...pilotMembers, newMemberInput.trim()]);
      setNewMemberInput('');
    }
  };

  const handleRemoveMember = (idx: number) => {
    setPilotMembers(pilotMembers.filter((_, i) => i !== idx));
  };

  const handleDraftSave = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setSaveTime(`오늘 ${timeStr}`);
    showToast('과제 초안이 안전하게 임시저장되었습니다.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);

    const newId = `AI-2025-${String(Math.floor(Math.random() * 900) + 100)}`;
    const createdCase: UseCase = {
      id: newId,
      title: title || '신규 등록 AI 과제',
      description: targetTask || 'AI 도입을 통한 업무 프로세스 개선',
      department: department,
      applicant: {
        name: '송민아',
        role: '대리',
        team: '고객상담파트',
        extension: '4492',
        avatarLetter: '송'
      },
      assignee: {
        name: assigneeName.split(' ')[0] || '송민아',
        role: '대리',
        team: department
      },
      targetTask: targetTask,
      frequency: frequency,
      currentProcess: currentProcess,
      problems: problems,
      aiObjective: aiObjective,
      selectedTool: selectedTool,
      accountType: accountType,
      status: '보안 검토 중',
      reviewer: {
        name: '김민수',
        role: '책임',
        team: '정보보안팀',
        avatarLetter: '김'
      },
      createdDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      nextStep: '보안성 심의 위원회',
      deadline: '2025.06.20 18:00',
      urgencyDays: 5,
      timePerTaskMin: timePerTask,
      monthlyVolume: monthlyVolume,
      timeSavedHoursPerMonth: hoursSaved,
      roiEfficiency: `약 70% 효율 개선 (연간 약 ${manMonth} M/M 대체 효과)`,
      pilotDuration: pilotDuration,
      pilotMembers: pilotMembers,
      estimatedCostMonthly: costEstimation,
      qaLead: qaLead,
      kpiMetrics: kpiMetrics,
      riskMitigation: riskMitigation,
      securityReview: {
        dataGrade: dataTypePII || dataTypePartner ? '대외비 (민감정보 포함)' : '내부용',
        dataGradeStatus: '검토 진행 중',
        networkPath: transferPath === 'cloud-mtls' ? '외부 클라우드 전용선 API (mTLS)' : '사내 프라이빗망 격리',
        networkStatus: '기준 충족',
        modelTrainingExclusion: 'Zero Data Retention 협약 체결 테넌트',
        modelTrainingStatus: '검증 완료',
        piiMasking: '정규표현식 및 DLP 가명처리 엔진 적용',
        piiMaskingStatus: '심사 진행 중',
        dataTypesIncluded: [
          ...(dataTypePublic ? ['공개 자료'] : []),
          ...(dataTypeInternal ? ['내부 일반자료'] : []),
          ...(dataTypePII ? ['개인정보 포함 가능성'] : []),
          ...(dataTypePartner ? ['고객사 및 거래처 정보'] : []),
          ...(dataTypeSecret ? ['기업 핵심 기밀'] : [])
        ]
      },
      timelineStep: 3
    };

    onSubmitNewCase(createdCase);
    showToast(`과제 [${newId}] 등록 검토 요청이 성공적으로 접수되었습니다.`);
    setTimeout(() => {
      onNavigate('all-use-cases');
    }, 1000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Navigation & Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-gutter-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
            <button 
              type="button" 
              onClick={() => onNavigate('dashboard')} 
              className="hover:text-primary transition-colors"
            >
              홈
            </button>
            <span className="material-symbols-outlined text-body-sm text-outline-variant">chevron_right</span>
            <button 
              type="button" 
              onClick={() => onNavigate('all-use-cases')} 
              className="hover:text-primary transition-colors"
            >
              AI 활용 과제
            </button>
            <span className="material-symbols-outlined text-body-sm text-outline-variant">chevron_right</span>
            <span className="text-primary font-semibold">신규 등록</span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">AI 활용 과제 등록</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            업무 혁신을 위한 생성형 AI 활용 방안을 제안하세요. 부서 및 정보보안 부서의 단계별 검토를 거쳐 시범 운영이 체계적으로 진행됩니다.
          </p>
        </div>

        {/* Live Governance Status Pill */}
        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-tertiary text-headline-md">verified_user</span>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline">보안 프레임워크</span>
            <span className="font-label-md text-label-md text-tertiary font-semibold">AI 거버넌스 규격 v2.4 적용중</span>
          </div>
        </div>
      </div>

      {/* Multi-section Workflow Stepper */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-lg mb-gutter-lg border border-[#e5eeff]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md relative">
          {/* Step 1 */}
          <div 
            onClick={() => scrollToSection('section-step-1')}
            className="flex items-center gap-space-md relative group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md shadow-sm">
              1
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Step 01</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">기본 정보</span>
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">
              <span className="material-symbols-outlined text-body-sm">chevron_right</span>
            </div>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => scrollToSection('section-step-2')}
            className="flex items-center gap-space-md relative group cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-label-md text-label-md">
              2
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Step 02</span>
              <span className="font-label-md text-label-md text-on-surface font-medium">활용 목적 및 기대 효과</span>
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">
              <span className="material-symbols-outlined text-body-sm">chevron_right</span>
            </div>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => scrollToSection('section-step-3')}
            className="flex items-center gap-space-md relative group cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-label-md text-label-md">
              3
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Step 03</span>
              <span className="font-label-md text-label-md text-on-surface font-medium">AI 도구 및 보안 검토</span>
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">
              <span className="material-symbols-outlined text-body-sm">chevron_right</span>
            </div>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => scrollToSection('section-step-4')}
            className="flex items-center gap-space-md relative group cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-label-md text-label-md">
              4
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Step 04</span>
              <span className="font-label-md text-label-md text-on-surface font-medium">시범 운영 계획</span>
            </div>
          </div>
        </div>
      </div>

      <form 
        className="flex flex-col gap-gutter-lg" 
        onSubmit={(e) => {
          e.preventDefault();
          setShowSubmitModal(true);
        }}
      >
        {/* SECTION 1: 기본 정보 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-[#e5eeff]" id="section-step-1">
          <div className="px-gutter-lg py-space-md bg-surface-container-low flex items-center justify-between border-b border-[#e5eeff]">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-headline-md">info</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">섹션 1. 과제 기본 정보</h2>
            </div>
            <span className="font-code-sm text-code-sm px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant">
              REQ-202506-FORM
            </span>
          </div>

          <div className="p-gutter-lg flex flex-col gap-space-xl">
            {/* 과제명 */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  과제명 <span className="text-error">*</span>
                </label>
                <span className="font-label-sm text-label-sm text-outline">사내 표준 명명 규칙 준수 (부서-목적-대상)</span>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 고객 상담 로그 실시간 민감정보 마스킹 및 요약 자동화"
                className="w-full h-10 px-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all border border-transparent focus:border-primary"
              />
            </div>

            {/* 3-Column: 신청 부서, 신청자, 과제 담당자 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  신청 부서 <span className="text-error">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-10 px-space-md bg-surface-container rounded-lg font-body-md text-body-md text-on-surface outline-none cursor-pointer"
                >
                  <option value="고객지원실">고객지원실</option>
                  <option value="재무/회계팀">재무/회계팀</option>
                  <option value="IT / 개발본부">IT / 개발본부</option>
                  <option value="마케팅 / 커뮤니케이션">마케팅 / 커뮤니케이션</option>
                  <option value="영업기획팀">영업기획팀</option>
                  <option value="법무/감사팀">법무/감사팀</option>
                  <option value="인사 / 총무실">인사 / 총무실</option>
                </select>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  신청자 <span className="text-error">*</span>
                </label>
                <div className="h-10 px-space-md bg-surface-container rounded-lg flex items-center font-body-md text-body-md text-secondary select-none">
                  <span className="material-symbols-outlined text-body-sm mr-space-xs text-outline">account_circle</span>
                  {applicantName}
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                    과제 담당자 (PM) <span className="text-error">*</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer font-label-sm text-label-sm text-primary select-none">
                    <input
                      type="checkbox"
                      checked={sameAsApplicant}
                      onChange={(e) => {
                        setSameAsApplicant(e.target.checked);
                        if (e.target.checked) {
                          setAssigneeName('송민아 대리 (고객상담파트 / 내선 4492)');
                        } else {
                          setAssigneeName('');
                        }
                      }}
                      className="accent-primary rounded"
                    />
                    <span>신청자와 동일</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  readOnly={sameAsApplicant}
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder={sameAsApplicant ? '' : '사번 또는 부서원 이름 검색...'}
                  className={`w-full h-10 px-space-md rounded-lg font-body-md text-body-md outline-none transition-all ${
                    sameAsApplicant 
                      ? 'bg-surface-container text-secondary' 
                      : 'bg-surface-container-low text-on-surface focus:ring-2 focus:ring-primary'
                  }`}
                />
              </div>
            </div>

            {/* 대상 업무 */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                대상 업무 <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={targetTask}
                onChange={(e) => setTargetTask(e.target.value)}
                placeholder="AI를 접목하고자 하는 세부 업무 프로세스를 명시하세요"
                className="w-full h-10 px-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            {/* 업무 발생 빈도 */}
            <div className="flex flex-col gap-space-sm">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                업무 발생 빈도 <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <label className={`flex items-center gap-space-sm p-space-md rounded-lg cursor-pointer transition-colors border ${
                  frequency === 'daily' ? 'bg-primary-fixed/30 border-primary' : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}>
                  <input
                    type="radio"
                    name="freq"
                    value="daily"
                    checked={frequency === 'daily'}
                    onChange={() => setFrequency('daily')}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-medium">매일 수시 발생</span>
                    <span className="font-label-sm text-label-sm text-outline">일 100건 이상 대량 발생</span>
                  </div>
                </label>

                <label className={`flex items-center gap-space-sm p-space-md rounded-lg cursor-pointer transition-colors border ${
                  frequency === 'weekly' ? 'bg-primary-fixed/30 border-primary' : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}>
                  <input
                    type="radio"
                    name="freq"
                    value="weekly"
                    checked={frequency === 'weekly'}
                    onChange={() => setFrequency('weekly')}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-medium">주간 정기 업무</span>
                    <span className="font-label-sm text-label-sm text-outline">주 1~3회 주기적 발생</span>
                  </div>
                </label>

                <label className={`flex items-center gap-space-sm p-space-md rounded-lg cursor-pointer transition-colors border ${
                  frequency === 'monthly' ? 'bg-primary-fixed/30 border-primary' : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}>
                  <input
                    type="radio"
                    name="freq"
                    value="monthly"
                    checked={frequency === 'monthly'}
                    onChange={() => setFrequency('monthly')}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-medium">월간 정기 업무</span>
                    <span className="font-label-sm text-label-sm text-outline">월말 결산 및 정기 집계</span>
                  </div>
                </label>

                <label className={`flex items-center gap-space-sm p-space-md rounded-lg cursor-pointer transition-colors border ${
                  frequency === 'adhoc' ? 'bg-primary-fixed/30 border-primary' : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}>
                  <input
                    type="radio"
                    name="freq"
                    value="adhoc"
                    checked={frequency === 'adhoc'}
                    onChange={() => setFrequency('adhoc')}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-medium">비정기/프로젝트성</span>
                    <span className="font-label-sm text-label-sm text-outline">특정 이벤트 시 발생</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 현재 업무 처리 방식 */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                현재 업무 처리 방식 <span className="text-error">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={currentProcess}
                onChange={(e) => setCurrentProcess(e.target.value)}
                placeholder="상담원이 고객 통화 종료 후 녹취록을 청취하며 직접 수기 메모 작성 및 시스템 입력"
                className="w-full p-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: 활용 목적 및 기대 효과 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-[#e5eeff]" id="section-step-2">
          <div className="px-gutter-lg py-space-md bg-surface-container-low flex items-center justify-between border-b border-[#e5eeff]">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-headline-md">trending_up</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">섹션 2. 활용 목적 및 기대 효과</h2>
            </div>
            <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
              정량 ROI 산출 모델
            </span>
          </div>

          <div className="p-gutter-lg flex flex-col gap-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {/* 현재 업무의 문제점 */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  현재 업무의 주요 문제점 및 비효율 <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={problems}
                  onChange={(e) => setProblems(e.target.value)}
                  className="w-full p-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              {/* AI 활용 목적 */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  AI 도입 목적 및 개선 시나리오 <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={aiObjective}
                  onChange={(e) => setAiObjective(e.target.value)}
                  className="w-full p-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Metric Calculation Interactive Panel */}
            <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-body-md">calculate</span>
                  업무 절감 효과 실시간 시뮬레이션
                </span>
                <span className="font-code-sm text-code-sm text-outline">추정 기준: 사내 업무시간 환산식</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg items-center">
                {/* 기존 건당 작업시간 */}
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    기존 건당 작업시간 (분) *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={timePerTask}
                      onChange={(e) => setTimePerTask(Math.max(1, Number(e.target.value)))}
                      className="w-full h-10 pl-space-md pr-12 bg-surface-container-lowest rounded-lg font-code-sm text-code-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                    />
                    <span className="absolute right-space-md font-label-sm text-label-sm text-outline">분 / 건</span>
                  </div>
                </div>

                {/* 월간 예상 처리 건수 */}
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    월간 예상 처리 건수 (건) *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min={10}
                      max={500000}
                      value={monthlyVolume}
                      onChange={(e) => setMonthlyVolume(Math.max(0, Number(e.target.value)))}
                      className="w-full h-10 pl-space-md pr-12 bg-surface-container-lowest rounded-lg font-code-sm text-code-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                    />
                    <span className="absolute right-space-md font-label-sm text-label-sm text-outline">건 / 월</span>
                  </div>
                </div>

                {/* 예상 개선 효과 Preview Box */}
                <div className="p-space-md rounded-lg bg-primary-container text-on-primary flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-primary-container font-semibold">
                      예상 개선 성과 지표
                    </span>
                    <span className="material-symbols-outlined text-body-md text-tertiary-fixed">insights</span>
                  </div>
                  <div className="mt-space-xs">
                    <div className="font-headline-md text-headline-md tracking-tight font-bold">
                      월 약 {hoursSaved.toLocaleString()}시간 절감
                    </div>
                    <div className="font-label-sm text-label-sm text-on-primary-container mt-0.5">
                      약 70% 효율 개선 (연간 약 {manMonth} M/M 대체 효과)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: AI 도구 및 데이터 보안 검토 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-[#e5eeff]" id="section-step-3">
          <div className="px-gutter-lg py-space-md bg-surface-container-low flex items-center justify-between border-b border-[#e5eeff]">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-headline-md">shield</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">섹션 3. AI 도구 및 데이터 보안 검토</h2>
            </div>
            <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-error-container text-on-error-container font-semibold">
              정보보안 심의 필수
            </span>
          </div>

          <div className="p-gutter-lg flex flex-col gap-space-xl">
            {/* AI 도구 선택 & 계정 유형 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  후보 AI 도구 및 LLM 모델 <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="w-full h-10 px-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface appearance-none outline-none focus:ring-2 focus:ring-primary cursor-pointer pr-10 border border-transparent focus:border-primary"
                  >
                    <option value="Azure OpenAI GPT-4o">Azure OpenAI GPT-4o (사내 전용 프라이빗 테넌트 - 보안인증)</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (AWS Bedrock 사내 격리 환경)</option>
                    <option value="사내 자체 RAG (Llama-3)">사내 온프레미스 RAG (Llama-3 격리 모델)</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google Cloud Vertex AI Private)</option>
                    <option value="Upstage Solar Pro">Upstage Solar Pro (사내 온프레미스 경량 LLM)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-body-md">
                    unfold_more
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-body-sm">check_circle</span> 사내 허용 LLM 모델 카탈로그 기준
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  서비스 계정 및 연동 유형 <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
                  <label className="flex items-center gap-space-xs p-space-sm bg-surface-container-low rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === '기업 엔터프라이즈'}
                      onChange={() => setAccountType('기업 엔터프라이즈')}
                      className="accent-primary"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface">기업 엔터프라이즈</span>
                  </label>
                  <label className="flex items-center gap-space-xs p-space-sm bg-surface-container-low rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === '팀 워크스페이스'}
                      onChange={() => setAccountType('팀 워크스페이스')}
                      className="accent-primary"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface">팀 워크스페이스</span>
                  </label>
                  <label className="flex items-center gap-space-xs p-space-sm bg-surface-container-low rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === 'API 직접 연동'}
                      onChange={() => setAccountType('API 직접 연동')}
                      className="accent-primary"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface">API 직접 연동</span>
                  </label>
                </div>
                <span className="font-label-sm text-label-sm text-outline">
                  기업 전용 엔터프라이즈: 공급사 모델 재학습 원천 차단(Zero Data Retention)
                </span>
              </div>
            </div>

            {/* 사용할 데이터 유형 */}
            <div className="flex flex-col gap-space-sm">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                프롬프트 및 분석에 입력될 데이터 유형 (복수 선택 가능) <span className="text-error">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                <label className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/30">
                  <input
                    type="checkbox"
                    checked={dataTypePublic}
                    onChange={(e) => setDataTypePublic(e.target.checked)}
                    className="accent-primary mt-0.5"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-medium">공개 자료</span>
                      <span className="px-space-xs py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        보안 위험: 낮음
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-outline">
                      대외 홍보자료, 보도자료, 공개 웹사이트 공지사항 등
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/30">
                  <input
                    type="checkbox"
                    checked={dataTypeInternal}
                    onChange={(e) => setDataTypeInternal(e.target.checked)}
                    className="accent-primary mt-0.5"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-medium">내부 일반자료</span>
                      <span className="px-space-xs py-0.2 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                        보안 위험: 보통
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-outline">
                      사내 업무 매뉴얼, 서비스 FAQ 가이드라인, 부서간 회람 문서
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/30">
                  <input
                    type="checkbox"
                    checked={dataTypePII}
                    onChange={(e) => setDataTypePII(e.target.checked)}
                    className="accent-primary mt-0.5"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-medium">개인정보 포함 가능성</span>
                      <span className="px-space-xs py-0.2 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                        보안 위험: 높음 (마스킹 필수)
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-outline">
                      고객명, 연락처, 주소, 주민등록번호, 계좌번호 등 식별정보
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/30">
                  <input
                    type="checkbox"
                    checked={dataTypePartner}
                    onChange={(e) => setDataTypePartner(e.target.checked)}
                    className="accent-primary mt-0.5"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-medium">고객사 및 거래처 정보</span>
                      <span className="px-space-xs py-0.2 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                        보안 위험: 높음
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-outline">
                      상담 녹취록 내 계약 단가, 기업 비밀 상담, 비공개 클레임 내역
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors md:col-span-2 border border-outline-variant/30">
                  <input
                    type="checkbox"
                    checked={dataTypeSecret}
                    onChange={(e) => setDataTypeSecret(e.target.checked)}
                    className="accent-primary mt-0.5"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-medium">기업 핵심 기밀 또는 원천 기술자료</span>
                      <span className="px-space-xs py-0.2 rounded bg-on-surface text-surface-container-lowest font-label-sm text-label-sm font-bold">
                        업로드 엄격 금지 등급
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-outline">
                      소스코드 원천 자산, 미공개 실적 보고서, 코어 알고리즘 가이드 (해당 데이터는 별도 오프라인 모델 승인 필요)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* EXPLICIT SECURITY WARNING BANNER */}
            <div className="p-space-lg rounded-xl bg-amber-500/10 text-on-surface flex items-start gap-space-md border border-amber-300">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 flex-shrink-0">
                <span className="material-symbols-outlined text-headline-md">explore</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-amber-900 font-bold tracking-tight">
                    ※ [필독] 엔터프라이즈 정보보안 준수 경고
                  </span>
                  <span className="font-code-sm text-code-sm px-space-xs py-0.5 rounded bg-amber-500/20 text-amber-900 font-bold">
                    ISMS-P 인증 규정
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-amber-950 leading-relaxed">
                  '개인정보 포함 가능성' 또는 '고객사 정보' 선택 시, 사내 개인정보보호 지침 및 법적 규정에 따라 <strong>비식별 조치(정규표현식 및 사내 가명처리 마스킹 필터링 엔진)</strong> 적용 계획이 반드시 포함되어야 하며, 정보보안팀 심의를 통과해야 합니다. 단순 체크박스 선택이 데이터 업로드 권한을 부여하지 않으며, 위반 시 사내 징계 규정이 적용됩니다.
                </p>
              </div>
            </div>

            {/* 전송 경로 & 시스템 연동 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  네트워크 전송 경로 구분 <span className="text-error">*</span>
                </label>
                <div className="flex flex-col gap-space-xs">
                  <label className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="transferPath"
                      checked={transferPath === 'on-premise'}
                      onChange={() => setTransferPath('on-premise')}
                      className="accent-primary"
                    />
                    <span className="font-label-md text-label-md text-on-surface">사내 프라이빗망 내 완결 처리 (온프레미스 격리)</span>
                  </label>
                  <label className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="transferPath"
                      checked={transferPath === 'cloud-mtls'}
                      onChange={() => setTransferPath('cloud-mtls')}
                      className="accent-primary"
                    />
                    <span className="font-label-md text-label-md text-on-surface">외부 클라우드 전용선 API 암호화 전송 (mTLS 적용)</span>
                  </label>
                  <label className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-lg cursor-pointer opacity-50">
                    <input type="radio" disabled name="transferPath" className="accent-primary" />
                    <span className="font-label-md text-label-md text-outline">외부 퍼블릭 SaaS 웹 포털 직접 업로드 (사내 정책상 전면 불가)</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  사내 엔터프라이즈 시스템 연동 여부 <span className="text-error">*</span>
                </label>
                <div className="flex flex-col gap-space-sm p-space-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <label className="flex items-center gap-space-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={crmIntegration}
                      onChange={(e) => setCrmIntegration(e.target.checked)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="font-label-md text-label-md text-on-surface font-medium">CRM 시스템 API 연동 필요 (상담티켓 생성 자동화)</span>
                  </label>

                  <label className="flex items-center gap-space-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sttIntegration}
                      onChange={(e) => setSttIntegration(e.target.checked)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="font-label-md text-label-md text-on-surface font-medium">통화 녹취 CTI 인프라 STT 스트림 연동</span>
                  </label>

                  <label className="flex items-center gap-space-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={erpIntegration}
                      onChange={(e) => setErpIntegration(e.target.checked)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="font-label-md text-label-md text-outline">ERP 회계 전표 결재 연동 (해당 없음)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: 시범 운영 계획 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-[#e5eeff]" id="section-step-4">
          <div className="px-gutter-lg py-space-md bg-surface-container-low flex items-center justify-between border-b border-[#e5eeff]">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-headline-md">rocket_launch</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">섹션 4. 시범 운영 (Pilot) 계획</h2>
            </div>
            <span className="font-code-sm text-code-sm px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant">
              기간: 2개월 예정
            </span>
          </div>

          <div className="p-gutter-lg flex flex-col gap-space-xl">
            {/* 2-Column: 시범 운영 기간 & 참여자 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  시범 운영 기간 <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={pilotDuration}
                    onChange={(e) => setPilotDuration(e.target.value)}
                    className="w-full h-10 pl-10 pr-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-space-md text-outline text-body-md pointer-events-none">
                    date_range
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline">시범 운영은 최대 3개월 이내로 제한됩니다.</span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  시범 운영 참여 인원 <span className="text-error">*</span>
                </label>
                <div className="w-full min-h-10 p-1.5 bg-surface-container-low rounded-lg flex flex-wrap items-center gap-1.5 border border-outline-variant/30">
                  {pilotMembers.map((member, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm"
                    >
                      {member}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveMember(idx)}
                        className="text-outline hover:text-error ml-0.5"
                      >
                        <span className="material-symbols-outlined text-[13px]">close</span>
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newMemberInput}
                      onChange={(e) => setNewMemberInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMember();
                        }
                      }}
                      placeholder="+ 참여 그룹 추가..."
                      className="bg-transparent border-none outline-none font-label-sm text-label-sm text-on-surface placeholder:text-outline px-space-xs py-0.5 w-32"
                    />
                    {newMemberInput && (
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="text-xs bg-primary text-on-primary px-1.5 py-0.5 rounded"
                      >
                        추가
                      </button>
                    )}
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-outline">
                  총 {pilotMembers.length > 0 ? pilotMembers.join(', ') : '인원 미지정'} 대상 샌드박스 테넌트 권한 배정
                </span>
              </div>
            </div>

            {/* 예상 비용 & 검수 담당자 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">예상 인프라 및 API 비용 (월)</label>
                  <span className="font-code-sm text-code-sm text-primary font-bold">토큰 사용량 기반 추정</span>
                </div>
                <div className="h-10 px-space-md bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/30">
                  <input
                    type="text"
                    value={costEstimation}
                    onChange={(e) => setCostEstimation(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-code-sm text-code-sm text-on-surface font-semibold"
                  />
                  <span className="material-symbols-outlined text-body-md text-outline shrink-0 ml-2">payments</span>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                  품질 및 결과물 최종 검수 담당자 <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={qaLead}
                    onChange={(e) => setQaLead(e.target.value)}
                    className="w-full h-10 pl-10 pr-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-space-md text-outline text-body-md pointer-events-none">
                    badge
                  </span>
                </div>
              </div>
            </div>

            {/* 측정할 성과 지표 (KPI) */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                측정할 정량/정성 성과 지표 (KPI) <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={kpiMetrics}
                onChange={(e) => setKpiMetrics(e.target.value)}
                className="w-full h-10 px-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            {/* 예상 위험 및 대응 방안 */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-0.5">
                예상 위험 및 안전 대응 방안 (Risk & Mitigation) <span className="text-error">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={riskMitigation}
                onChange={(e) => setRiskMitigation(e.target.value)}
                className="w-full p-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sticky Bottom Governance Action Toolbar */}
        <div className="fixed bottom-0 left-64 right-0 bg-surface-container-lowest/95 backdrop-blur-md shadow-xl z-30 px-gutter-lg py-space-md border-t border-[#e5eeff]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Auto-save state */}
            <div className="flex items-center gap-space-md">
              <button 
                type="button"
                onClick={handleDraftSave}
                className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-body-md text-outline">save</span>
                <span className="font-label-md text-label-md font-semibold">임시저장</span>
              </button>
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                <span>최종 저장: {saveTime}</span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-space-md">
              <button
                type="button"
                onClick={onCancel}
                className="px-space-lg py-2 rounded-lg bg-surface-container text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold"
              >
                취소
              </button>

              <button
                type="submit"
                className="flex items-center gap-space-xs px-space-lg py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-md transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-body-md">send</span>
                <span>검토 요청 (제출)</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Modal Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-2xl p-gutter-lg flex flex-col gap-space-lg border border-[#e5eeff]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-primary-container/15 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-headline-lg">verified</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-md text-headline-md text-on-surface">과제 검토 요청 제출 확인</h3>
                  <span className="font-label-sm text-label-sm text-outline">사내 AI 거버넌스 심의 파이프라인으로 전송됩니다</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm p-space-md rounded-lg bg-surface-container-low border border-outline-variant/30">
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-outline">과제명</span>
                <span className="font-semibold text-on-surface text-right truncate max-w-xs">{title}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-outline">선택 모델</span>
                <span className="font-semibold text-on-surface">{selectedTool} ({accountType})</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-outline">보안 위험성 등급</span>
                <span className="font-semibold text-error">주의 (개인정보 및 업무 데이터 포함)</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-outline">1차 심의 담당</span>
                <span className="font-semibold text-primary">{department} 부서장 & 정보보안파트</span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              제출 후에는 즉시 수정이 제한되며, 검토 진행 상태는 '내 신청 과제' 메뉴에서 실시간 조회할 수 있습니다. 계속하시겠습니까?
            </p>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                돌아가서 수정
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-space-lg py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm"
              >
                최종 검토 요청
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-lg shadow-lg flex items-center gap-space-sm animate-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-body-lg">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
