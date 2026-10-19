import React from 'react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId?: string;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  caseId
}) => {
  if (!isOpen) return null;

  const logs = [
    {
      id: 'log-1',
      time: '2025.06.11 14:15:22 KST',
      actor: '박진우 팀장 (고객지원실)',
      action: '과제 1차 부서장 승인 처리',
      ip: '10.240.12.84 (사내 인트라넷)',
      status: 'SUCCESS',
      hash: 'sha256:8f24a910be3...d92c'
    },
    {
      id: 'log-2',
      time: '2025.06.10 09:30:11 KST',
      actor: '송민아 대리 (고객지원실)',
      action: '신규 AI 활용 과제 등록 접수',
      ip: '10.240.15.112 (사내 인트라넷)',
      status: 'SUCCESS',
      hash: 'sha256:1a499d30ca1...f420'
    },
    {
      id: 'log-3',
      time: '2025.06.10 09:20:04 KST',
      actor: '사내 DLP 게이트웨이 엔진',
      action: '가명정보처리 계획서 SHA-256 무결성 검증 통과',
      ip: '172.16.0.40 (DLP Proxy)',
      status: 'VERIFIED',
      hash: 'sha256:e3b0c44298f...b855'
    },
    {
      id: 'log-4',
      time: '2025.06.08 17:02:19 KST',
      actor: 'SecOps 자동 감사 봇',
      action: 'Azure Private Link 네트워크 암호화 터널 통신 상태 양호 판정',
      ip: '10.100.1.5 (SecOps Core)',
      status: 'HEALTHY',
      hash: 'sha256:77b10291cc9...aa18'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-space-lg bg-surface-container-low border-b border-[#e5eeff] flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-headline-lg text-primary">history_edu</span>
            <div className="flex flex-col">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">사내 AI 거버넌스 전사 감사 로그</h2>
              <span className="font-label-sm text-label-sm text-outline">
                {caseId ? `과제 [${caseId}] 추적 감사 이력` : '실시간 사내 감사 추적 및 위변조 방지 블록'}
              </span>
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

        <div className="p-gutter-lg overflow-y-auto">
          <table className="w-full text-left font-body-sm text-body-sm border-collapse">
            <thead>
              <tr className="bg-surface-container text-secondary font-label-sm text-label-sm uppercase">
                <th className="py-2.5 px-space-md">일시 (KST)</th>
                <th className="py-2.5 px-space-md">수행 주체</th>
                <th className="py-2.5 px-space-md">작업 내용</th>
                <th className="py-2.5 px-space-md">접속 IP / 환경</th>
                <th className="py-2.5 px-space-md text-center">결과</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface whitespace-nowrap">
                    {log.time}
                  </td>
                  <td className="py-space-sm px-space-md font-medium text-on-surface">
                    {log.actor}
                  </td>
                  <td className="py-space-sm px-space-md text-on-surface-variant">
                    {log.action}
                  </td>
                  <td className="py-space-sm px-space-md font-code-sm text-code-sm text-outline">
                    {log.ip}
                  </td>
                  <td className="py-space-sm px-space-md text-center">
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-code-sm text-code-sm font-semibold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-space-lg p-space-md rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>블록체인 기반 변조 불가 해시 체인 유효성: 100% 무결성 확인</span>
            <span className="font-code-sm text-code-sm">SYNC: 2025.06.11 15:42:09</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-low border-t border-[#e5eeff] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-space-lg py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
