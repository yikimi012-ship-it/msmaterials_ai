import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  message: string;
  unread: boolean;
  type: 'urgent' | 'approval' | 'system';
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCase: (id: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateCase
}) => {
  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: 'n1',
      title: '심의 기한 임박 알림 [D-1]',
      time: '15분 전',
      message: '[AI-2025-089] 고객 상담 로그 실시간 민감정보 마스킹 및 요약 과제의 보안 심의 마감일이 내일입니다.',
      unread: true,
      type: 'urgent'
    },
    {
      id: 'n2',
      title: '신규 과제 승인 요청',
      time: '1시간 전',
      message: '재무/회계팀 장현우 과장이 [AI-2025-084] ERP 재무 결산 전표 대조 자동화 과제를 검토 요청했습니다.',
      unread: true,
      type: 'approval'
    },
    {
      id: 'n3',
      title: '사내 AI 보안 거버넌스 규격 v2.4 갱신',
      time: '어제',
      message: 'Zero Data Retention 협약 표준 가이드라인 개정본이 게시되었습니다.',
      unread: false,
      type: 'system'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pr-16 pt-16 bg-inverse-surface/20 backdrop-blur-[2px] animate-in fade-in duration-100" onClick={onClose}>
      <div 
        className="w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-space-md border-b border-[#e5eeff] flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-headline-md text-primary">notifications</span>
            <span className="font-headline-md text-headline-md text-on-surface">알림 및 결재함</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-body-md">close</span>
          </button>
        </div>

        <div className="divide-y divide-[#e5eeff] max-h-96 overflow-y-auto">
          {notifications.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                if (item.id === 'n1') {
                  onNavigateCase('AI-2025-089');
                  onClose();
                } else if (item.id === 'n2') {
                  onNavigateCase('AI-2025-084');
                  onClose();
                }
              }}
              className={`p-space-md flex flex-col gap-1 cursor-pointer transition-colors hover:bg-surface-container-low ${
                item.unread ? 'bg-primary-fixed/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-label-md text-label-md ${
                  item.type === 'urgent' ? 'text-error font-bold' : 'text-on-surface font-semibold'
                }`}>
                  {item.title}
                </span>
                <span className="font-code-sm text-code-sm text-outline">{item.time}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {item.message}
              </p>
            </div>
          ))}
        </div>

        <div className="p-space-sm bg-surface-container-low border-t border-[#e5eeff] text-center">
          <button 
            type="button"
            onClick={onClose}
            className="font-label-sm text-label-sm text-primary font-semibold hover:underline"
          >
            모든 알림 읽음 처리
          </button>
        </div>
      </div>
    </div>
  );
};
