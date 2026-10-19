import React from 'react';

interface SecurityPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityPolicyModal: React.FC<SecurityPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-space-lg bg-surface-container-low border-b border-[#e5eeff] flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-headline-lg text-primary">verified_user</span>
            <div className="flex flex-col">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">사내 생성형 AI 거버넌스 및 보안 정책 (v2.4)</h2>
              <span className="font-label-sm text-label-sm text-outline">정보보호최고책임자(CISO) 승인 규정 / 2025.06 개정</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-headline-md">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-gutter-lg overflow-y-auto space-y-space-lg font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {/* Article 1 */}
          <div className="flex flex-col gap-space-xs">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-space-xs">
              <span className="w-1.5 h-4 rounded-full bg-primary"></span>
              제1조 (목적 및 기본 원칙)
            </h3>
            <p>
              본 규정은 사내 임직원이 업무 효율화를 위해 생성형 AI(대형 언어 모델 및 멀티모달 AI 포함)를 도입 및 활용할 때, 고객 정보 보호, 영업 기밀 유출 방지 및 준법 규제를 완벽히 준수하도록 관리 거버넌스를 수립함을 목적으로 합니다.
            </p>
          </div>

          {/* Article 2 */}
          <div className="flex flex-col gap-space-xs">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-space-xs">
              <span className="w-1.5 h-4 rounded-full bg-primary"></span>
              제2조 (허용 및 금지 데이터 등급 기준)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-1">
              <div className="p-space-md rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-label-md text-emerald-800 font-bold">허용 가능 등급</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-emerald-950 font-body-sm text-body-sm">
                  <li>대외 공개 홍보자료 및 보도자료</li>
                  <li>사내 일반 FAQ, 사규 및 오픈소스 기술 매뉴얼</li>
                  <li>DLP 정규식 엔진으로 완전 가명화된 텍스트</li>
                </ul>
              </div>
              <div className="p-space-md rounded-lg bg-rose-50 border border-rose-200">
                <span className="font-label-md text-rose-800 font-bold">전면 금지 등급 (오프라인 모델만 가능)</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-rose-950 font-body-sm text-body-sm">
                  <li>원천 소스코드 및 알고리즘 코어 저장소</li>
                  <li>미공개 재무제표 원본 및 M&A 계획</li>
                  <li>비식별 조치되지 않은 고객 PII 및 결제정보</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Article 3 */}
          <div className="flex flex-col gap-space-xs">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-space-xs">
              <span className="w-1.5 h-4 rounded-full bg-primary"></span>
              제3조 (Zero Data Retention 협약 필수)
            </h3>
            <p>
              사내에서 인가된 클라우드 LLM(Azure OpenAI, AWS Bedrock, Google Cloud Vertex AI 등)은 공급사 데이터 학습에 재활용되지 않는 <strong>Enterprise Zero Data Retention SLA</strong>가 유효하게 체결된 프라이빗 테넌트 환경만을 사용하여야 합니다.
            </p>
          </div>

          {/* Article 4 */}
          <div className="flex flex-col gap-space-xs">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-space-xs">
              <span className="w-1.5 h-4 rounded-full bg-primary"></span>
              제4조 (Human-in-the-Loop 검증 의무)
            </h3>
            <p>
              생성형 AI 모델의 산출물을 사내 ERP, CRM 또는 고객 대상 커뮤니케이션에 자동 반영하는 것은 엄격히 금지되며, 반드시 담당 직원이 결과물의 사실 여부(Fact-Check) 및 무결성을 확인하는 승인 단계를 거쳐야 합니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-[#e5eeff] flex items-center justify-between">
          <span className="font-code-sm text-code-sm text-outline">문서 승인 번호: SEC-2025-06-REG</span>
          <button 
            type="button" 
            onClick={onClose}
            className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
