export type NavigationPath = 
  | 'dashboard'
  | 'all-use-cases'
  | 'my-applications'
  | 'pending-reviews'
  | 'tool-directory'
  | 'tool-assessment'
  | 'security-review'
  | 'pilot-management'
  | 'performance-evaluation'
  | 'use-case-library'
  | 'guidelines-training'
  | 'reports'
  | 'system-settings'
  | 'new-use-case'
  | 'use-case-detail';

export type CaseStatus = 
  | '보안 검토 중'
  | '부서 검토 중'
  | '시범 운영 중'
  | '확대 승인'
  | '성과 평가 중'
  | '보완 요청'
  | '승인 완료'
  | '반려';

export type SecurityLevel = '공개' | '내부용' | '대외비' | '극비';

export interface UseCase {
  id: string; // e.g., 'AI-2025-089'
  title: string;
  description: string;
  department: string;
  applicant: {
    name: string;
    role: string;
    team: string;
    extension?: string;
    avatarLetter?: string;
  };
  assignee: {
    name: string;
    role: string;
    team: string;
  };
  targetTask: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'adhoc';
  currentProcess: string;
  problems: string;
  aiObjective: string;
  selectedTool: string;
  accountType: '기업 엔터프라이즈' | '팀 워크스페이스' | 'API 직접 연동';
  status: CaseStatus;
  reviewer: {
    name: string;
    role: string;
    team: string;
    avatarLetter: string;
  };
  createdDate: string;
  nextStep: string;
  deadline?: string;
  urgencyDays?: number; // e.g. D-1, D-2
  
  // Metrics & Calculations
  timePerTaskMin: number;
  monthlyVolume: number;
  timeSavedHoursPerMonth: number;
  roiEfficiency: string;
  pilotDuration: string;
  pilotMembers: string[];
  estimatedCostMonthly: string;
  qaLead: string;
  kpiMetrics: string;
  riskMitigation: string;

  // Security Review Items
  securityReview: {
    dataGrade: string;
    dataGradeStatus: string;
    networkPath: string;
    networkStatus: string;
    modelTrainingExclusion: string;
    modelTrainingStatus: string;
    piiMasking: string;
    piiMaskingStatus: string;
    dataTypesIncluded: string[];
  };

  // Timeline Progress (7 Steps)
  timelineStep: number; // 1 to 7
  auditComments?: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  timeAgo: string;
  description: string;
  highlight: string;
  icon: string;
  type: 'info' | 'success' | 'warning' | 'primary';
}

export interface AITool {
  id: string;
  name: string;
  vendor: string;
  model: string;
  category: string;
  securityCertification: string;
  deploymentType: 'Azure Private' | 'AWS Bedrock' | 'On-Premise' | 'SaaS Dedicated';
  zeroDataRetention: boolean;
  currentUsersCount: number;
  activeProjectsCount: number;
  status: '정식 승인' | '조건부 승인' | '검토 중' | '비인가';
  complianceLevel: 'A+' | 'A' | 'B' | 'F';
}
