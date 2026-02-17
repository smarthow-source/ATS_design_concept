

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type ApplicantStatus = 
  | 'Application' 
  | 'Shortlisted' 
  | 'Disqualified' 
  | 'Prescreen' 
  | 'Online-test' 
  | 'Cognitive-test' 
  | 'HM-interview' 
  | 'Management-interview' 
  | 'CEO-interview' 
  | 'Offering' 
  | 'Sign-contract' 
  | 'Onboarding';

export interface ContactLog {
  id: string;
  date: string;
  time?: string;
  result: string;
  availability?: string;
  reason?: string;
  taName: string;
  stage: ApplicantStatus;
}

export interface TestScore {
  module: string;
  score: number;
  maxScore: number;
}

export interface InterviewFeedback {
  interviewer: string;
  rating: number; 
  comments: string;
  date: string;
  result: 'Pending' | 'Pass' | 'Fail' | 'On Hold';
}

export interface PreviousApplication {
  role: string;
  status: ApplicantStatus;
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  role: string;
  status: ApplicantStatus;
  lastActionDate: number;
  applicationTimestamp: number; 
  previousApplications?: PreviousApplication[]; 
  dueDate?: number; 
  assignedTA: string;
  hiringManager: string;
  
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  phoneNumber: string;
  lineId: string;
  location: string;
  education: string;
  militaryStatus: string;
  drivingAbility: string;
  
  testScores: TestScore[];
  contactLogs: ContactLog[];
  interviewFeedback: InterviewFeedback[];
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  hiringManager: string;
  management: string; // Added: Person responsible for Management Interview
  openDate: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTA: string;
  jobFamilyCode: string;
}

export interface JobRole {
  id: string;
  name: string;
  jobFamilyCode: string;
  division: string;
  hmInterviewer: string;
  managementInterviewer: string;
}

export type UserRole = 'HiringManager' | 'TA' | 'TAManager';
export type ActiveTab = 'jobs' | 'worklist' | 'test-results' | 'settings';

export interface Artifact {
  id: string;
  styleName: string;
  html: string;
  status: 'streaming' | 'complete' | string;
}