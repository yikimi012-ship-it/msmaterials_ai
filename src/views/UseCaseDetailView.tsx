import React, { useState } from 'react';
import { UseCase, NavigationPath } from '../types';

interface UseCaseDetailViewProps {
  useCase: UseCase;
  onNavigate: (path: NavigationPath) => void;
  onUpdateCase: (updatedCase: UseCase) => void;
  onOpenAuditLogs: () => void;
}

export const UseCaseDetailView: React.FC<UseCaseDetailViewProps> = ({
  useCase,
  onNavigate,
  onUpdateCase,
  onOpenAuditLogs
}) => {
  // Approver review state
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [reviewComments, setReviewComments] = useState(useCase.auditComments || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleApprove = () => {
    if (!check3) {
      alert('보안 가이드라인 필수 체크리스트 (API 접근 제어 및 사내 감사 로그 연동 계획)를 확인 후 체크해주세요.');
      return;
    }

    const confirmed = window.confirm('본 과제의 정보보안 적합성을 승인하고 다음 승인권자(디지털혁신추진단 총괄 관리자)에게 이관하시겠습니까?');
    if (confirmed) {
      const updated: UseCase = {
        ...useCase,
        status: '승인 완료',
        timelineStep: 4,
        nextStep: '시범 운영 승인 (총괄 관리자)',
        auditComments: reviewComments || '정보보안 적합성 검토 결과 기준에 부합하여 승인 의결함.'
      };
      onUpdateCase(updated);
      showToast('정보보안 승인 처리가 완료되었습니다. 감사 로그에 심의 내용이 암호화 기록되었습니다.');
    }
  };

  const handleRevision = () => {
    if (!reviewComments.trim()) {
      alert('보완 요청 시 구체적인 보완 필요 사유를 의견란에 입력해야 합니다.');
      return;
    }

    const updated: UseCase = {
      ...useCase,
      status: '보완 요청',
      nextStep: '외부 전송 데이터 보완',
      auditComments: reviewComments
    };
    onUpdateCase(updated);
    showToast(`신청자(${useCase.applicant.name} ${useCase.applicant.role})에게 보완 요청 알림이 전송되었습니다.`);
  };

  const handleReject = () => {
    if (!reviewComments.trim()) {
      alert('반려 처리 시 반려 사유를 의견란에 반드시 기재해주시기 바랍니다.');
      return;
    }

    const confirmed = window.confirm('해당 과제를 최종 반려하시겠습니까?');
    if (confirmed) {
      const updated: UseCase = {
        ...useCase,
        status: '반려',
        nextStep: '과제 반려 조치 종결',
        auditComments: reviewComments
      };
      onUpdateCase(updated);
      showToast('과제가 반려 처리되었습니다.');
    }
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('과제 공유 링크가 클립보드에 복사되었습니다.');
    } else {
      showToast('링크 복사 완료: ' + useCase.id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFile = (fileName: string) => {
    const dummyContent = `사내 생성형 AI 거버넌스 심의 증적 서류\n과제번호: ${useCase.id}\n과제명: ${useCase.title}\n등록일자: ${useCase.createdDate}\n보안승인상태: ${useCase.status}\n파일명: ${fileName}`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`[${fileName}] 다운로드가 시작되었습니다.`);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-16">
      {/* Top Navigation & Utility Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
          <button 
            type="button" 
            onClick={() => onNavigate('dashboard')} 
            className="hover:text-primary transition-colors"
          >
            홈
          </button>
          <span className="material-symbols-outlined text-body-sm text-outline">chevron_right</span>
          <button 
            type="button" 
            onClick={() => onNavigate('all-use-cases')} 
            className="hover:text-primary transition-colors"
          >
            AI 활용 과제
          </button>
          <span className="material-symbols-outlined text-body-sm text-outline">chevron_right</span>
          <span className="text-on-surface font-semibold">과제 상세 ({useCase.id})</span>
        </div>

        <div className="flex items-center gap-space-sm">
          <button 
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-body-sm">print</span>
            <span>심의 보고서 인쇄</span>
          </button>

          <button 
            type="button"
            onClick={handleShareLink}
            className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-label-md transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-body-sm">share</span>
            <span>링크 공유</span>
          </button>

          <button 
            type="button"
            onClick={onOpenAuditLogs}
            className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-surface-container-highest hover:bg-secondary-container text-on-surface text-label-md font-label-md transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-body-sm">history_edu</span>
            <span>감사 로그</span>
          </button>
        </div>
      </div>

      {/* Master Case Header Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-code-sm text-code-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-primary-fixed-variant font-bold tracking-tight">
              {useCase.id}
            </span>
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
              useCase.status === '보안 검토 중' ? 'bg-amber-50 text-amber-800' :
              useCase.status === '승인 완료' || useCase.status === '확대 승인' ? 'bg-green-50 text-green-700' :
              useCase.status === '보완 요청' ? 'bg-error-container text-on-error-container' :
              'bg-surface-container text-secondary'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                useCase.status === '보안 검토 중' ? 'bg-amber-500 animate-pulse' :
                useCase.status === '승인 완료' || useCase.status === '확대 승인' ? 'bg-emerald-500' :
                useCase.status === '보완 요청' ? 'bg-error' :
                'bg-secondary'
              }`}></span>
              <span>{useCase.status}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-medium">
              생성형 LLM
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-primary-fixed-variant font-label-sm text-label-sm font-medium">
              고위험군 (개인정보 처리)
            </span>
          </div>

          <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
            <span className="material-symbols-outlined text-body-sm">schedule</span>
            <span>등록일시: {useCase.createdDate} 09:30 KST</span>
          </div>
        </div>

        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            [{useCase.id}] {useCase.title}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
            {useCase.description || '인바운드 음성 통화 녹취본의 텍스트 변환(STT) 결과를 프라이빗 LLM을 통해 자동 요약하고, 고객 상담 후처리 시스템에 표준화된 형태로 즉각 연동하는 프로세스 혁신 과제입니다.'}
          </p>
        </div>

        {/* Metadata Grid Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
          <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/30">
            <span className="font-label-sm text-label-sm text-secondary">신청부서 / 담당자</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">
              {useCase.department} / {useCase.applicant.name} {useCase.applicant.role}
            </span>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/30">
            <span className="font-label-sm text-label-sm text-secondary">적용 후보 도구</span>
            <span className="font-label-md text-label-md text-primary font-semibold mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-body-sm text-primary">cloud_queue</span>
              {useCase.selectedTool}
            </span>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/30">
            <span className="font-label-sm text-label-sm text-secondary">기대 공수 절감</span>
            <span className="font-label-md text-label-md text-tertiary-container font-semibold mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-body-sm">trending_up</span>
              월 {useCase.timeSavedHoursPerMonth} 시간 절감
            </span>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/30">
            <span className="font-label-sm text-label-sm text-secondary">심의 마감 기한</span>
            <span className="font-label-md text-label-md text-error font-semibold mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-body-sm">event_busy</span>
              {useCase.deadline || '2025.06.13 18:00 (D-1)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Architecture: 68% Left Workbench / 32% Right Audit Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: Detailed Evidence & Proposals (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Section 1: Overview & Value Proposition */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="w-1.5 h-4 rounded-full bg-primary"></span>
                <h2 className="font-headline-md text-headline-md text-on-surface">1. 과제 개요 및 추진 목표</h2>
              </div>
              <span className="font-label-sm text-label-sm text-outline uppercase font-code-sm">SECTION REF: APP-CORE-01</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-headline-md">flag</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">추진 배경 및 목적</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {useCase.problems || '상담원의 평균 후처리 시간(ACW)이 건당 10~15분 소요되어 대기 시간이 길어지고, 작성자 역량에 따른 기록 편차가 심화되어 통일된 표준 포맷 도입이 시급함.'}
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-headline-md">support_agent</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">대상 업무 범위</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {useCase.targetTask || '고객센터 유선 인바운드 접수 전 채널 (월 평균 14,000건의 상담 음성 데이터 대상 전수 요약 및 CRM 시스템 전산 기록 자동화).'}
                </p>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-tertiary-container text-headline-md">query_stats</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">정량적 기대 효과</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  상담 건당 후처리 소요 시간 70% 감축 (10분 → 2.5분), 연간 약 5,592시간(환산 가치 약 1.8억원 상당) 업무 리소스 확보 및 고객 대기시간 18% 단축.
                </p>
              </div>
            </div>

            {/* Metric KPI Visualizer Strip */}
            <div className="p-space-md rounded-lg bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
              <div className="flex items-center gap-space-md w-full sm:w-auto">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-headline-md">timer</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-secondary">상담 후처리 시간(ACW) 절감 지표</span>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold">10분 00초</span>
                    <span className="material-symbols-outlined text-body-sm text-outline">arrow_forward</span>
                    <span className="font-headline-lg text-headline-lg text-primary font-bold">2분 30초</span>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold ml-space-xs">(-75% 단축)</span>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-64 flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>목표 업무 생산성 달성도</span>
                  <span className="font-semibold text-primary">87.5%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: '87.5%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: AS-IS vs TO-BE Architectural Process Flow */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="w-1.5 h-4 rounded-full bg-primary"></span>
                <h2 className="font-headline-md text-headline-md text-on-surface">2. 현행(AS-IS) 대비 개선(TO-BE) 프로세스 비교</h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-code-sm text-code-sm">
                Human-in-the-Loop 검증형
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* AS-IS Pane */}
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-md text-label-md font-bold">
                    현행 프로세스 (AS-IS)
                  </span>
                  <span className="font-label-sm text-label-sm text-error font-medium">소요 시간: 평균 10분</span>
                </div>

                <ol className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant pl-space-xs mt-space-xs">
                  <li className="flex items-start gap-space-sm">
                    <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-label-sm shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-on-surface">통화 종료 후 상담원 기억 및 녹취 청취:</strong>
                      <p className="text-secondary mt-0.5">상담이 끝난 뒤 수기 메모와 녹취 파일을 다시 청취하여 핵심 쟁점을 파악함.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-space-sm">
                    <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-label-sm shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-on-surface">상담원 개별 자유 양식 수기 입력:</strong>
                      <p className="text-secondary mt-0.5">상담원마다 작성 스타일이 상이하여 핵심 요구사항 및 고객 클레임 세부 내용 누락 발생 빈번.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-space-sm">
                    <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-label-sm shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-on-surface">CRM 수기 등록 및 후처리 완료:</strong>
                      <p className="text-secondary mt-0.5">타 부서 이관 시 맥락 공유가 불충분하여 동일 문의 재발생 시 이중 설명 소요.</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* TO-BE Pane */}
              <div className="p-space-md rounded-lg bg-surface-container flex flex-col gap-space-sm border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-md text-label-md font-bold">
                    도입 후 프로세스 (TO-BE)
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-bold">소요 시간: 약 20초 (요약) + 2분 검수</span>
                </div>

                <ol className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant pl-space-xs mt-space-xs">
                  <li className="flex items-start gap-space-sm">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-on-surface">실시간 음성 STT 변환:</strong>
                      <p className="text-secondary mt-0.5">통화 스트림 종료 즉시 사내 음성인식 엔진이 전문 스크립트 텍스트 추출 완료.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-space-sm">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-on-surface">사내 가명처리 엔진 (1차 민감정보 마스킹):</strong>
                      <p className="text-secondary mt-0.5">외부 연동 전 주민번호, 신용카드 번호, 주소 등 주요 식별 정보 실시간 난수 치환.</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-space-sm">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-on-surface">프라이빗 LLM 표준 구조화 요약:</strong>
                      <p className="text-secondary mt-0.5">사내 템플릿(문의 유형, 고객 요구, 처리 내역, 후속 조치) 기반 정형 텍스트 생성 (20초 소요).</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-space-sm">
                    <span className="w-5 h-5 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold text-label-sm shrink-0">
                      4
                    </span>
                    <div>
                      <strong className="text-on-surface">상담원 Human-in-the-Loop 검수 및 CRM 전송:</strong>
                      <p className="text-secondary mt-0.5">상담원이 자동 생성된 요약문을 최종 확인/수정 후 1클릭으로 CRM 저장 승인.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* Architecture Flowchart Vector Visual */}
            <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm text-secondary font-medium">데이터 처리 및 보안 격리 파이프라인 (Data Pipeline Flow)</span>
                <span className="font-code-sm text-code-sm text-primary">Zero Retention Protocol V2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-xs items-center text-center">
                <div className="p-space-sm rounded bg-surface-container-lowest shadow-sm flex flex-col items-center border border-[#e5eeff]">
                  <span className="material-symbols-outlined text-secondary">mic</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold mt-1">고객 음성 입력</span>
                  <span className="font-code-sm text-code-sm text-outline">STT 파싱</span>
                </div>

                <div className="p-space-sm rounded bg-surface-container-highest shadow-sm flex flex-col items-center border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-primary">security</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold mt-1">사내 DLP 마스킹</span>
                  <span className="font-code-sm text-code-sm text-primary">정규식 필터링</span>
                </div>

                <div className="p-space-sm rounded bg-surface-container-lowest shadow-sm flex flex-col items-center border border-[#e5eeff]">
                  <span className="material-symbols-outlined text-surface-tint">hub</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold mt-1">Azure OpenAI (Private)</span>
                  <span className="font-code-sm text-code-sm text-outline">GPT-4o 요약</span>
                </div>

                <div className="p-space-sm rounded bg-tertiary-container text-on-tertiary shadow-sm flex flex-col items-center">
                  <span className="material-symbols-outlined">how_to_reg</span>
                  <span className="font-label-sm text-label-sm font-semibold mt-1">상담원 검증 승인</span>
                  <span className="font-code-sm text-code-sm opacity-80">CRM 실시간 연동</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Data Security & Regulatory Governance Plan */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="w-1.5 h-4 rounded-full bg-error"></span>
                <h2 className="font-headline-md text-headline-md text-on-surface">3. 데이터 보안 및 취급 계획 (보안팀 필수 검토 항목)</h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                보안 심의 필수
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-space-md rounded-l">보안 항목</th>
                    <th className="py-2.5 px-space-md">신청 내용 및 기술적 조치 방안</th>
                    <th className="py-2.5 px-space-md text-right rounded-r">검토 기준 적합성</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eeff]">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-body-sm text-error">lock</span>
                      데이터 보안 등급
                    </td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">
                      <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-code-sm text-code-sm font-semibold mr-1">
                        대외비
                      </span>
                      <span>{useCase.securityReview.dataGrade}</span>
                    </td>
                    <td className="py-space-sm px-space-md text-right">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                        {useCase.securityReview.dataGradeStatus}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-body-sm text-primary">lan</span>
                      네트워크 전송 방식
                    </td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">
                      {useCase.securityReview.networkPath}
                    </td>
                    <td className="py-space-sm px-space-md text-right">
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-label-sm text-label-sm font-medium">
                        {useCase.securityReview.networkStatus}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-body-sm text-tertiary-container">model_training</span>
                      AI 모델 학습 배제
                    </td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">
                      {useCase.securityReview.modelTrainingExclusion}
                    </td>
                    <td className="py-space-sm px-space-md text-right">
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-label-sm text-label-sm font-medium">
                        {useCase.securityReview.modelTrainingStatus}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-body-sm text-secondary">visibility_off</span>
                      민감정보 마스킹
                    </td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">
                      {useCase.securityReview.piiMasking}
                    </td>
                    <td className="py-space-sm px-space-md text-right">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-label-sm text-label-sm font-medium">
                        {useCase.securityReview.piiMaskingStatus}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Pilot Operation Roadmap */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="w-1.5 h-4 rounded-full bg-primary"></span>
                <h2 className="font-headline-md text-headline-md text-on-surface">4. 시범 운영(Pilot) 계획서 요약</h2>
              </div>
              <span className="font-code-sm text-code-sm text-outline">SCHEDULE: 2 MONTHS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-secondary">시범 운영 일정</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold mt-1">
                  {useCase.pilotDuration || '2025.07.01 ~ 08.31'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">총 8주간 운영 후 성과 측정</span>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-secondary">참여 파일럿 인원</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold mt-1">
                  {useCase.pilotMembers.length > 0 ? useCase.pilotMembers.join(', ') : '상담원 12명 (3개 조)'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">숙련도별 분산 선발 (신입/중간/숙련)</span>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-secondary">목표 성공 기준 (KPI)</span>
                <span className="font-headline-md text-headline-md text-tertiary font-semibold mt-1">
                  만족도 90점 / 오탈자 0%
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">요약 정확도 95% 이상 달성</span>
              </div>
            </div>
          </section>

          {/* Section 5: Attached Evidence Documents */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="w-1.5 h-4 rounded-full bg-primary"></span>
                <h2 className="font-headline-md text-headline-md text-on-surface">5. 첨부 서류 및 감사 증적 자료 (2건)</h2>
              </div>
              <span className="font-code-sm text-code-sm text-outline">SHA-256 VERIFIED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="p-space-md rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                      AI활용_보안자가진단서_고객지원실.pdf
                    </span>
                    <span className="font-code-sm text-code-sm text-secondary">1.8 MB · 2025.06.10 09:12 등록</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleDownloadFile('AI활용_보안자가진단서_고객지원실.pdf')}
                  className="ml-space-sm p-space-xs rounded bg-surface-container-lowest hover:bg-surface-container-high text-primary transition-colors shrink-0" 
                  title="다운로드"
                >
                  <span className="material-symbols-outlined text-headline-md">download</span>
                </button>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                      가명정보처리_계획서_v1.2.docx
                    </span>
                    <span className="font-code-sm text-code-sm text-secondary">850 KB · 2025.06.10 09:20 등록</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleDownloadFile('가명정보처리_계획서_v1.2.docx')}
                  className="ml-space-sm p-space-xs rounded bg-surface-container-lowest hover:bg-surface-container-high text-primary transition-colors shrink-0" 
                  title="다운로드"
                >
                  <span className="material-symbols-outlined text-headline-md">download</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Stepper Audit Timeline & Action Console (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg sticky top-20">
          {/* Right Pane 1: Approver Interactive Console */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-headline-md">gavel</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">결재 검토 처리</h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
                담당 심의관
              </span>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/30">
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center shrink-0 ring-2 ring-primary">
                김
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">김민수 책임</span>
                  <span className="font-label-sm text-label-sm text-secondary">(정보보안팀)</span>
                </div>
                <span className="font-code-sm text-code-sm text-secondary">심의 권한: 보안 적합성 승인/반려</span>
              </div>
            </div>

            {/* Security Pre-approval Checklist */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">보안 필수 확인 체크리스트</span>
              <div className="space-y-2 mt-1">
                <label className="flex items-start gap-space-sm cursor-pointer p-space-xs rounded hover:bg-surface-container-low transition-colors">
                  <input
                    type="checkbox"
                    checked={check1}
                    onChange={(e) => setCheck1(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">사내 개인정보 암호화 및 비식별화 요건 부합 확인</span>
                </label>

                <label className="flex items-start gap-space-sm cursor-pointer p-space-xs rounded hover:bg-surface-container-low transition-colors">
                  <input
                    type="checkbox"
                    checked={check2}
                    onChange={(e) => setCheck2(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">클라우드 벤더사 모델 재학습 비동의 조항 확인</span>
                </label>

                <label className="flex items-start gap-space-sm cursor-pointer p-space-xs rounded hover:bg-surface-container-low transition-colors">
                  <input
                    type="checkbox"
                    checked={check3}
                    onChange={(e) => setCheck3(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface font-medium text-primary">
                    API 접근 제어 및 사내 감사 로그 연동 계획 확인 (필수)
                  </span>
                </label>
              </div>
            </div>

            {/* Textarea for Opinion */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <label className="font-label-sm text-label-sm text-secondary font-semibold" htmlFor="reviewComments">
                검토 의견 및 조건부 권고사항
              </label>
              <textarea
                id="reviewComments"
                rows={3}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="보완 요청 또는 승인 시 조건부 권고사항을 명확히 입력하세요."
                className="w-full p-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all resize-none border border-outline-variant/30"
              />
            </div>

            {/* Action Command Buttons */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                type="button"
                onClick={handleApprove}
                className="w-full py-2.5 px-space-md rounded bg-green-700 hover:bg-green-800 text-white font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-headline-md">check_circle</span>
                <span>정보보안 승인 의결</span>
              </button>

              <div className="grid grid-cols-2 gap-space-sm">
                <button
                  type="button"
                  onClick={handleRevision}
                  className="py-2 px-space-md rounded bg-surface-container hover:bg-amber-100 text-amber-900 font-label-md text-label-md font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-body-sm">edit_note</span>
                  <span>보완 요청</span>
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  className="py-2 px-space-md rounded bg-surface-container hover:bg-rose-100 text-rose-900 font-label-md text-label-md font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-body-sm">block</span>
                  <span>반려</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Pane 2: Vertical Approval Stepper (AI Governance Lifecycle) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-headline-md">account_tree</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">단계별 결재 타임라인</h2>
              </div>
              <span className="font-code-sm text-code-sm text-secondary">
                STEP {useCase.timelineStep} OF 7
              </span>
            </div>

            {/* Vertical Stepper Stream */}
            <div className="relative flex flex-col space-y-space-md pl-2">
              {/* Track line running down */}
              <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-surface-container-high -z-0"></div>

              {/* STEP 1 */}
              <div className="relative z-10 flex items-start gap-space-md">
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">1. 과제 등록</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-label-sm text-label-sm font-bold">완료</span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary mt-0.5">2025.06.10 09:30 | {useCase.applicant.name} {useCase.applicant.role}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant p-space-xs rounded bg-surface-container-low mt-1">
                    "상담원 후처리 부담 경감을 위한 과제를 등록합니다."
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="relative z-10 flex items-start gap-space-md">
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">2. 부서장 검토</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-label-sm text-label-sm font-bold">승인 완료</span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary mt-0.5">2025.06.11 14:15 | 박진우 팀장({useCase.department})</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant p-space-xs rounded bg-surface-container-low mt-1">
                    "부서 내 긴급성 및 ROI 충분함. 정보보안성 검토 요청합니다."
                  </p>
                </div>
              </div>

              {/* STEP 3: InfoSec */}
              <div className="relative z-10 flex items-start gap-space-md">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                  useCase.timelineStep > 3 
                    ? 'bg-primary-container text-on-primary' 
                    : 'bg-surface-container-lowest ring-2 ring-primary text-primary'
                }`}>
                  {useCase.timelineStep > 3 ? (
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-xs">
                    <span className="font-label-md text-label-md text-primary font-bold">3. 정보보안 검토</span>
                    <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                      useCase.timelineStep > 3 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-amber-50 text-amber-800 animate-pulse'
                    }`}>
                      {useCase.timelineStep > 3 ? '승인 의결' : '심사 진행 중'}
                    </span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary mt-0.5">배정: 김민수 책임(정보보안팀)</span>
                  <div className="p-space-xs rounded bg-surface-container-high mt-1 text-on-surface-variant font-body-sm text-body-sm">
                    <div className="flex items-center gap-1 font-semibold text-error mb-0.5">
                      <span className="material-symbols-outlined text-body-sm">alarm</span>
                      <span>검토 기한: {useCase.deadline || '2025.06.13 18:00 (D-1 남음)'}</span>
                    </div>
                    <span>현재 기술적 데이터 마스킹 방안 및 Azure Private Link 통신 경로 실사 중입니다.</span>
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              <div className={`relative z-10 flex items-start gap-space-md ${useCase.timelineStep >= 4 ? '' : 'opacity-60'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-code-sm text-code-sm font-bold ${
                  useCase.timelineStep >= 4 
                    ? 'bg-primary-container text-on-primary' 
                    : 'bg-surface-container-high text-secondary'
                }`}>
                  {useCase.timelineStep > 4 ? <span className="material-symbols-outlined text-sm">check</span> : '4'}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">4. 시범 운영 승인</span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {useCase.timelineStep >= 4 ? '승인 대기' : '대기'}
                    </span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary mt-0.5">결재권자: 총괄 관리자 (디지털혁신추진단)</span>
                </div>
              </div>

              {/* STEP 5 */}
              <div className="relative z-10 flex items-start gap-space-md opacity-40">
                <div className="w-6 h-6 rounded-full bg-surface-container-high text-secondary flex items-center justify-center shrink-0 mt-0.5 font-code-sm text-code-sm font-bold">
                  5
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">5. 시범 운영 (Pilot)</span>
                    <span className="font-label-sm text-label-sm text-outline">예정 (2개월)</span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary mt-0.5">현장 적합성 및 모델 안정성 테스트</span>
                </div>
              </div>

              {/* STEP 6 */}
              <div className="relative z-10 flex items-start gap-space-md opacity-40">
                <div className="w-6 h-6 rounded-full bg-surface-container-high text-secondary flex items-center justify-center shrink-0 mt-0.5 font-code-sm text-code-sm font-bold">
                  6
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">6. 성과 평가</span>
                    <span className="font-label-sm text-label-sm text-outline">예정</span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary mt-0.5">정량 KPI 및 상담원 만족도 분석</span>
                </div>
              </div>

              {/* STEP 7 */}
              <div className="relative z-10 flex items-start gap-space-md opacity-40">
                <div className="w-6 h-6 rounded-full bg-surface-container-high text-secondary flex items-center justify-center shrink-0 mt-0.5 font-code-sm text-code-sm font-bold">
                  7
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">7. 최종 판정 (확대·보완·중단)</span>
                    <span className="font-label-sm text-label-sm text-outline">대기</span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary mt-0.5">전사 AI 거버넌스 위원회 최종 심의</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-lg shadow-lg flex items-center gap-space-sm animate-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-body-lg">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
