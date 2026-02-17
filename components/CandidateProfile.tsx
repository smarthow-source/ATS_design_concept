
import React, { useState, useEffect, useRef } from 'react';
import { Applicant, ApplicantStatus, JobOpening, ContactLog, UserRole } from '../types';
import { JOURNEY_STAGES, POST_SHORTLIST_STAGES, POST_PRESCREEN_STAGES } from '../constants';
import { CheckIcon, SparklesIcon, DocumentTextIcon } from './Icons';
import SideDrawer from './SideDrawer';
import { HandOffForm } from './HandOffForm';
import { EmploymentContract } from './EmploymentContract';
import { MoveCandidateForm } from './MoveCandidateForm';

const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

interface CandidateProfileProps {
  applicant: Applicant;
  job?: JobOpening;
  jobs: JobOpening[];
  onStatusChange: (applicantId: string, newStatus: ApplicantStatus) => void;
  onConfirmLog: (applicantId: string, stage: ApplicantStatus, result: string, note: string, date: string, time: string) => void;
  onMoveCandidate: (applicantId: string, newJobId: string) => void;
  userRole: UserRole;
}

const DROP_REASONS = [
    "Does not meet minimum qualifications",
    "Failed technical assessment",
    "Poor culture fit",
    "Unresponsive",
    "Accepted another offer",
    "Salary expectations too high",
    "Relocation issues",
    "Hiring freeze / Position closed",
    "Other",
];

const ALL_EMPLOYEES = [
    'David Chen', 'Sarah Zhang', 'Elena Rodriguez', 'Somchai Prasert', 
    'Wichai R.', 'Jane Doe', 'Robert Ng', 'Sarah Jenks', 'Mike Ross', 
    'Jessica Pearson', 'Louis Litt'
].sort();

const defaultPrescreenState = {
    contactResult: 'Contactable',
    prescreenResult: 'Pending',
    failReason: '',
    rejectReason: '',
    currentSalary: '',
    expectedSalary: '',
    note: '',
    date: '',
    currentPosition: '',
    reasonForChange: '',
    gpa: '',
    university: '',
    faculty: '',
    masterUniversity: '',
    masterFaculty: '',
    phdUniversity: '',
    phdFaculty: '',
    locationConvenience: 'Pending',
    noticePeriod: '',
    onlineTestLink: '',
    onlineTestDueDate: '',
    gpaCeoTrigger: false,
    universityCeoTrigger: false,
    facultyCeoTrigger: false,
    currentSalaryCeoTrigger: false,
    expectedSalaryCeoTrigger: false,
};
const defaultOnlineTestState = { testResult: 'Pending', iqScore: '', englishScore: '', continueProcess: 'Yes', interviewDate: '', interviewTime: '09:00', note: '', emailStatus: 'Sent', emailDate: '', dueDate: '', lastFollowUp: '', followUpContactResult: 'No Answer', nextDueDate: '', interviewType: 'Offline', hmInterviewer: '', managementInterviewer: '' };
const defaultCognitiveTestState = { testScore: '', testResult: '', note: '', testScoreCeoTrigger: false };
const defaultHmInterviewState = { result: 'Pending', interviewer: '', date: '', time: '10:00', note: '', needsScheduling: false, nextInterviewDate: '', nextInterviewTime: '10:00' };
const defaultManagementInterviewState = { result: 'Pending', interviewer: '', ceoTrigger: false, date: '', time: '10:00', note: '' };
const defaultCeoInterviewState = { result: 'Pending', interviewer: 'CEO', date: '', time: '10:00', note: '' };
const defaultOfferingState = { isApproveOfferStatus: 'Approved', followUpDate: '', contactStatus: 'Contactable', offerResult: 'Pending', contractSignDate: '', contractSignTime: '10:00', onboardingDate: '', note: '', salary: '', followUpContactResult: 'No Answer', nextFollowUpDate: '' };
const defaultSignContractState = { contractStatus: 'Pending Signature', note: '' };
const defaultOnboardingState = { onboardingStatus: 'Not Started', note: '' };

const ActionLogDisplay: React.FC<{log: ContactLog}> = ({ log }) => (
    <div className="action-log-display">
        <div className="action-log-details">
            <span>Action by <strong>{log.taName}</strong></span>
            <span>{log.date} {log.time || ''}</span>
        </div>
    </div>
);


export const CandidateProfile: React.FC<CandidateProfileProps> = ({ applicant, job, jobs, onStatusChange, onConfirmLog, onMoveCandidate, userRole }) => {
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'resume'>('overview');
  const [expandedCompletedStage, setExpandedCompletedStage] = useState<ApplicantStatus | null>(null);
  
  // -- STAGE STATES --
  const [prescreenData, setPrescreenData] = useState(defaultPrescreenState);
  const [onlineTestData, setOnlineTestData] = useState(defaultOnlineTestState);
  const [cognitiveTestData, setCognitiveTestData] = useState(defaultCognitiveTestState);
  const [hmInterviewData, setHmInterviewData] = useState({ ...defaultHmInterviewState, interviewer: job?.hiringManager || '' });
  const [managementInterviewData, setManagementInterviewData] = useState({ ...defaultManagementInterviewState, interviewer: job?.management || '' });
  const [ceoInterviewData, setCeoInterviewData] = useState(defaultCeoInterviewState);
  const [offeringData, setOfferingData] = useState(defaultOfferingState);
  const [signContractData, setSignContractData] = useState(defaultSignContractState);
  const [onboardingData, setOnboardingData] = useState(defaultOnboardingState);

  // Hand-off form state
  const [isHandOffOpen, setIsHandOffOpen] = useState(false);
  const [handOffData, setHandOffData] = useState(null);
  const [isContractDrawerOpen, setIsContractDrawerOpen] = useState(false);
  const [isMoveDrawerOpen, setIsMoveDrawerOpen] = useState(false);
  const [isDropDrawerOpen, setIsDropDrawerOpen] = useState(false);
  const [dropReason, setDropReason] = useState('');
  const [dropNotes, setDropNotes] = useState('');
  const [showMasterFields, setShowMasterFields] = useState(false);
  const [showPhdFields, setShowPhdFields] = useState(false);

  const currentStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset all data states to default when applicant changes
    setPrescreenData({ ...defaultPrescreenState, date: new Date().toISOString().split('T')[0] });
    setOnlineTestData({ 
        ...defaultOnlineTestState, 
        emailDate: new Date(applicant.applicationTimestamp + 86400000).toISOString().split('T')[0], 
        dueDate: new Date(applicant.applicationTimestamp + 604800000).toISOString().split('T')[0], 
        lastFollowUp: '2025-01-16',
        hmInterviewer: job?.hiringManager || '',
        managementInterviewer: job?.management || '',
    });
    setCognitiveTestData(defaultCognitiveTestState);
    setHmInterviewData({ ...defaultHmInterviewState, interviewer: job?.hiringManager || '' });
    setManagementInterviewData({ ...defaultManagementInterviewState, interviewer: job?.management || '' });
    setCeoInterviewData(defaultCeoInterviewState);
    setOfferingData({ ...defaultOfferingState, followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0] });
    setSignContractData(defaultSignContractState);
    setOnboardingData(defaultOnboardingState);
    setShowMasterFields(false);
    setShowPhdFields(false);
    
    // Populate states with data from logs, processing oldest first
    [...applicant.contactLogs].reverse().forEach(log => {
        try {
            const details = JSON.parse(log.reason);
            const data = { ...details, note: details.manualNote || '' };
            if (log.stage === 'Prescreen') {
                setPrescreenData(prev => ({ ...prev, ...data }));
                if (data.onlineTestDueDate) {
                    setOnlineTestData(prev => ({...prev, dueDate: data.onlineTestDueDate}));
                }
            }
            else if (log.stage === 'Online-test') setOnlineTestData(prev => ({ ...prev, ...data }));
            else if (log.stage === 'Cognitive-test') setCognitiveTestData(prev => ({ ...prev, ...data }));
            else if (log.stage === 'HM-interview') {
                setHmInterviewData(prev => ({ ...prev, ...data }));
                // Pass scheduling data to the next stage
                if (data.needsScheduling && data.nextInterviewDate) {
                    setManagementInterviewData(prev => ({
                        ...prev,
                        date: data.nextInterviewDate,
                        time: data.nextInterviewTime || '10:00'
                    }));
                }
            }
            else if (log.stage === 'Management-interview') setManagementInterviewData(prev => ({ ...prev, ...data }));
            else if (log.stage === 'CEO-interview') setCeoInterviewData(prev => ({ ...prev, ...data }));
            else if (log.stage === 'Offering') setOfferingData(prev => ({ ...prev, ...data }));
            else if (log.stage === 'Sign-contract') setSignContractData(prev => ({ ...prev, ...data }));
            else if (log.stage === 'Onboarding') setOnboardingData(prev => ({ ...prev, ...data }));
        } catch (e) { /* Ignore non-JSON logs */ }
    });
  }, [applicant, job]);

  useEffect(() => {
    if (currentStageRef.current) {
        currentStageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
  }, [applicant]);

  const handleOpenHandOff = () => {
    const data = {
        // Candidate
        candidateName: applicant.name,
        positionAppliedFor: job?.title || applicant.role,
        expectedBand: prescreenData.expectedSalary ? `$${prescreenData.expectedSalary}` : 'N/A',
        resume: 'N/A - Link Placeholder',
        recruiterTaName: applicant.assignedTA,
        age: applicant.age,
        educationalBackground: applicant.education,
        universityGraduated: applicant.education,
        jobStabilityScore: 'N/A - Placeholder',

        // Assessment
        onlineTestScoreEnglish: onlineTestData.englishScore || 'N/A',
        onlineTestScoreIq: onlineTestData.iqScore || 'N/A',
        onlineTestResult: onlineTestData.testResult || 'N/A',
        cognitiveTestSet: 'Standard Cognitive Assessment',
        cognitiveTestScore: cognitiveTestData.testScore ? `${cognitiveTestData.testScore} / 100` : 'N/A',
        cognitiveTestResult: cognitiveTestData.testResult || 'N/A',

        // CEO Trigger
        ceoInterviewTrigger: managementInterviewData.ceoTrigger ? 'Yes' : 'No',

        // Stage Completed
        currentStage: applicant.status,
        hiringManager: job?.hiringManager,
        hmInterviewDate: hmInterviewData.date || 'N/A',
        management: job?.management,
        managementInterviewDate: managementInterviewData.date || 'N/A',
    };
    setHandOffData(data);
    setIsHandOffOpen(true);
};

  const handleToggleCompleted = (stageId: ApplicantStatus) => {
    setExpandedCompletedStage(prev => (prev === stageId ? null : stageId));
  };

  const currentStatusIndex = JOURNEY_STAGES.findIndex(s => s.id === applicant.status);
  const canMove = currentStatusIndex < JOURNEY_STAGES.findIndex(s => s.id === 'Offering');
  const canDrop = applicant.status !== 'Disqualified';


  const handleConfirm = (stage: ApplicantStatus) => {
    let result = 'Pass'; let note = ''; let nextStatus: ApplicantStatus | null = null;
    const stageIndex = JOURNEY_STAGES.findIndex(s_ => s_.id === stage);
    const isPastStage = stageIndex < currentStatusIndex;

    const findNextStage = (current: ApplicantStatus): ApplicantStatus | null => {
        const currentIndex = JOURNEY_STAGES.findIndex(s => s.id === current);
        if (currentIndex > -1 && currentIndex < JOURNEY_STAGES.length -1) {
            const next = JOURNEY_STAGES[currentIndex + 1];
            if (['Application', 'Shortlisted', 'Disqualified'].includes(next.id)) {
                return findNextStage(next.id);
            }
            return next.id;
        }
        return null;
    }

    if (stage === 'Prescreen') {
        result = prescreenData.prescreenResult;
        note = JSON.stringify({ ...prescreenData, manualNote: prescreenData.note, date: new Date().toISOString().split('T')[0] });
        if (result === 'Pass') nextStatus = findNextStage(stage); else if (result === 'Fail' || result === 'Candidate Reject') nextStatus = 'Disqualified';
    } else if (stage === 'Online-test') {
        result = onlineTestData.testResult;
        const dataToSave = { ...onlineTestData };
        if (dataToSave.nextDueDate) {
            dataToSave.dueDate = dataToSave.nextDueDate;
            dataToSave.nextDueDate = '';
        }
        note = JSON.stringify({ ...dataToSave, manualNote: onlineTestData.note });
        if (result === 'Pass' && onlineTestData.continueProcess === 'Yes') nextStatus = findNextStage(stage); else if (result === 'Fail' || onlineTestData.continueProcess === 'No') nextStatus = 'Disqualified';
    } else if (stage === 'Cognitive-test') {
        result = cognitiveTestData.testResult;
        note = JSON.stringify({ ...cognitiveTestData, manualNote: cognitiveTestData.note });
        if (result === 'Pass') nextStatus = findNextStage(stage); else if (result === 'Fail') nextStatus = 'Disqualified';
    } else if (stage === 'HM-interview') {
        result = hmInterviewData.result;
        note = JSON.stringify({ ...hmInterviewData, manualNote: hmInterviewData.note });
        if (result === 'Pass') { nextStatus = (job?.hiringManager === job?.management) ? 'Offering' : findNextStage(stage); } else if (result === 'Fail') nextStatus = 'Disqualified';
    } else if (stage === 'Management-interview') {
        result = managementInterviewData.result;
        note = JSON.stringify({ ...managementInterviewData, manualNote: managementInterviewData.note });
        if (result === 'Pass') { nextStatus = managementInterviewData.ceoTrigger ? findNextStage(stage) : 'Offering'; } else if (result === 'Fail') nextStatus = 'Disqualified';
    } else if (stage === 'CEO-interview') {
        result = ceoInterviewData.result;
        note = JSON.stringify({ ...ceoInterviewData, manualNote: ceoInterviewData.note });
        if (result === 'Pass') nextStatus = findNextStage(stage); else if (result === 'Fail') nextStatus = 'Disqualified';
    } else if (stage === 'Offering') {
        result = offeringData.offerResult;
        const finalSalary = offeringData.salary || prescreenData.expectedSalary || '';
        const dataToSave = { ...offeringData, salary: finalSalary };

        if (dataToSave.nextFollowUpDate) {
            dataToSave.followUpDate = dataToSave.nextFollowUpDate;
            dataToSave.nextFollowUpDate = '';
        }
        
        note = JSON.stringify({ ...dataToSave, manualNote: offeringData.note });
        if (result === 'Pass') nextStatus = findNextStage(stage); else if (result === 'Fail') nextStatus = 'Disqualified';
    } else if (stage === 'Sign-contract') {
        result = signContractData.contractStatus;
        note = JSON.stringify({ ...signContractData, manualNote: signContractData.note });
        if (result === 'Signed') nextStatus = findNextStage(stage);
        else if (result === 'Declined') nextStatus = 'Disqualified';
    } else if (stage === 'Onboarding') {
        result = onboardingData.onboardingStatus;
        note = JSON.stringify({ ...onboardingData, manualNote: onboardingData.note });
        if (result === 'Completed') nextStatus = null; // Final stage, no automatic progression
    }

    onConfirmLog(applicant.id, stage, result, note, new Date().toISOString().split('T')[0], new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    if (!isPastStage && nextStatus) {
        onStatusChange(applicant.id, nextStatus);
    }
  };

    const handleHmFeedbackSubmit = () => {
        const stage: ApplicantStatus = 'HM-interview';
        const result = hmInterviewData.result;
        
        const hmNoteData = {
            result: hmInterviewData.result,
            interviewer: hmInterviewData.interviewer,
            note: hmInterviewData.note,
            manualNote: hmInterviewData.note,
        };
        
        const note = JSON.stringify(hmNoteData);
        
        onConfirmLog(applicant.id, stage, result, note, new Date().toISOString().split('T')[0], new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

  const handleMoveAction = (newStatus: 'Application' | 'Shortlisted' | 'Disqualified') => {
    onStatusChange(applicant.id, newStatus);
    
    let result = '';
    const actor = userRole === 'TA' ? 'TA' : 'Hiring Manager';

    if (applicant.status === 'Disqualified') {
        result = `Reactivated by ${actor}`;
    } else if (newStatus === 'Disqualified') {
        result = `Disqualified by ${actor}`;
    } else if (newStatus === 'Shortlisted' && applicant.status === 'Application') {
        result = `Shortlisted by ${actor}`;
    } else {
        result = `Moved by ${actor}`;
    }
    
    const note = `Candidate moved from ${applicant.status} to ${newStatus} by ${actor}.`;
    
    onConfirmLog(
        applicant.id, 
        applicant.status,
        result, 
        note, 
        new Date().toISOString().split('T')[0], 
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };
  
  const handleConfirmDrop = () => {
    if (!dropReason) return;
    const logNote = JSON.stringify({ reason: dropReason, notes: dropNotes });
    const logResult = `Dropped`;

    onConfirmLog(
        applicant.id,
        applicant.status,
        logResult,
        logNote,
        new Date().toISOString().split('T')[0],
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    onStatusChange(applicant.id, 'Disqualified');
    setIsDropDrawerOpen(false);
    setDropReason('');
    setDropNotes('');
  };

  const handleOnlineTestResultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newResult = e.target.value as 'Pending' | 'Pass' | 'Fail';
    setOnlineTestData(prev => ({
        ...prev,
        testResult: newResult,
        continueProcess: newResult === 'Pass' ? 'Yes' : 'No',
    }));
  };

  const renderInterviewForm = (stageId: ApplicantStatus, data: any, setData: any, label: string, isCurrent: boolean, isCompleted: boolean, log: ContactLog | undefined) => (
    <div className="timeline-form-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{label} Details</h4>
            <button className="generate-btn" onClick={handleOpenHandOff}>
                <DocumentTextIcon />
                Generate Hand-off
            </button>
        </div>
        <div className="form-grid">
            <div className="form-field">
                <label>Interview Result</label>
                <select value={data.result} onChange={e => setData({ ...data, result: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="On Hold">On Hold</option>
                </select>
            </div>
            <div className="form-field">
                <label>Interviewer</label>
                <input type="text" value={data.interviewer} onChange={e => setData({ ...data, interviewer: e.target.value })} />
            </div>
        </div>
        
        {stageId === 'Management-interview' && (
            <>
                <div className="form-grid" style={{ marginTop: '16px' }}>
                    <div className="form-field">
                        <label>Interview Date</label>
                        <input type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} />
                    </div>
                    <div className="form-field">
                        <label>Interview Time</label>
                        <input type="time" value={data.time} onChange={e => setData({ ...data, time: e.target.value })} />
                    </div>
                </div>
                <div className="form-field" style={{ marginTop: '16px', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="ceoTrigger" checked={data.ceoTrigger} onChange={e => setData({ ...data, ceoTrigger: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                    <label htmlFor="ceoTrigger" style={{ marginBottom: 0 }}>CEO Trigger Required?</label>
                </div>
            </>
        )}

        <div className="form-field" style={{ marginTop: '16px' }}>
            <label>Feedback Notes</label>
            <textarea rows={3} value={data.note} onChange={e => setData({ ...data, note: e.target.value })} placeholder={`Enter ${label} feedback...`} />
        </div>
        
        {isCompleted && log && <ActionLogDisplay log={log} />}
        
        <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm(stageId)}>
            {isCurrent ? `Confirm ${label}` : `Update ${label} Log`}
        </button>
    </div>
);
  
  const prescreenLog = applicant.contactLogs.find(log => log.stage === 'Prescreen' && log.result === 'Pass');
  let prescreenDate = null;
  if (prescreenLog) {
      if (prescreenLog.reason) {
          try {
              const details = JSON.parse(prescreenLog.reason);
              prescreenDate = details.date ? new Date(details.date).toLocaleDateString() : new Date(prescreenLog.date).toLocaleDateString();
          } catch (e) {
              prescreenDate = new Date(prescreenLog.date).toLocaleDateString();
          }
      } else {
          prescreenDate = new Date(prescreenLog.date).toLocaleDateString();
      }
  }

  const isDueDatePassed = onlineTestData.dueDate && new Date() > new Date(onlineTestData.dueDate);
  const noScoresEntered = !onlineTestData.iqScore && !onlineTestData.englishScore;
  const showFollowUpForm = isDueDatePassed && noScoresEntered;
  
  const renderLogReason = (log: ContactLog) => {
    if (!log.reason) return null;

    if (log.result === 'Dropped') {
        try {
            const parsedReason = JSON.parse(log.reason);
            if (parsedReason.reason) {
                return (
                    <div className="history-item-reason">
                        <p><strong>Reason:</strong> {parsedReason.reason}</p>
                        {parsedReason.notes && <p><strong>Notes:</strong> {parsedReason.notes}</p>}
                    </div>
                );
            }
        } catch (e) {
            // Fallback for non-JSON or malformed JSON
        }
    }
    
    // Fallback for old logs or other log types that might have simple string reasons
    return (
        <div className="history-item-meta" style={{ marginTop: '4px', fontStyle: 'italic', fontSize: '0.7rem', color: '#64748b' }}>
            "{log.reason}"
        </div>
    );
};


  return (
    <>
      <div className="candidate-detail-content">
        <div className="candidate-detail-header">
            <div className="detail-tab-navigation">
                <button className={`detail-nav-btn ${activeDetailTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveDetailTab('overview')}>Overview</button>
                <button className={`detail-nav-btn ${activeDetailTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveDetailTab('resume')}>Resume View</button>
            </div>
            <div className="profile-actions-bar">
                <div className="profile-actions-left">
                  {canMove && (
                    <button className="move-candidate-btn" onClick={() => setIsMoveDrawerOpen(true)}>Move</button>
                  )}
                  {canDrop && (
                    <button className="drop-candidate-btn" onClick={() => setIsDropDrawerOpen(true)}>Drop</button>
                  )}
                </div>
                <div className="profile-actions-center">
                  {(userRole === 'HiringManager' || userRole === 'TA') &&
                    (applicant.status === 'Application' || applicant.status === 'Shortlisted' || applicant.status === 'Disqualified') && (
                      <>
                        {applicant.status === 'Application' && (
                            <>
                                <button className="hm-action-btn shortlist" onClick={() => handleMoveAction('Shortlisted')}>
                                    ✓ Shortlist
                                </button>
                                <button className="hm-action-btn disqualify" onClick={() => setIsDropDrawerOpen(true)}>
                                    ✕ Disqualify
                                </button>
                            </>
                        )}
                        {applicant.status === 'Shortlisted' && (
                            <>
                                <button className="hm-action-btn move" onClick={() => handleMoveAction('Application')}>
                                    ← To Application
                                </button>
                                <button className="hm-action-btn disqualify" onClick={() => setIsDropDrawerOpen(true)}>
                                    ✕ Disqualify
                                </button>
                            </>
                        )}
                        {applicant.status === 'Disqualified' && (
                            <>
                                <button className="hm-action-btn move" onClick={() => handleMoveAction('Application')}>
                                    Reactivate (to Application)
                                </button>
                                <button className="hm-action-btn shortlist" onClick={() => handleMoveAction('Shortlisted')}>
                                    Reactivate (to Shortlisted)
                                </button>
                            </>
                        )}
                      </>
                  )}
                </div>
                <div className="profile-actions-right">
                  <div className="edit-trigger"><EditIcon /></div>
                </div>
            </div>
        </div>
        <div className="overview-grid">
          <div className="info-sidebar">
            <div className="merged-candidate-card">
              
              <div className="card-section">
                  <div className="profile-top">
                      <span className={`status-pill-small ${applicant.status === 'Disqualified' ? 'negative' : 'pending'}`}>UNDER REVIEW</span>
                      <span className="status-badge-inline" style={{ marginLeft: '8px' }}>{applicant.status}</span>
                  </div>
                  <h2 className="profile-title">{applicant.name}</h2>
                  <div className="detail-row"><span className="detail-label">Phone:</span><span className="detail-value">{applicant.phoneNumber} <CopyIcon /></span></div>
                  <div className="detail-row"><span className="detail-label">Location:</span><span className="detail-value">{applicant.location}</span></div>
                  <div className="detail-row"><span className="detail-label">Email:</span><span className="detail-value">{applicant.email}</span></div>
              </div>
              <div className="card-section border-top">
                  <h3 className="section-title">JOB APPLICATION DETAIL</h3>
                  <div className="job-title-pill-clean">{job?.title}</div>
                  <div style={{ marginTop: '12px' }}>
                      {POST_SHORTLIST_STAGES.includes(applicant.status) && (
                          <div className="detail-row">
                              <span className="detail-label">Shortlisted:</span>
                              <span className="detail-value" style={{ color: '#059669', fontWeight: 700 }}>
                                  {new Date(applicant.applicationTimestamp + 86400000).toLocaleDateString()}
                              </span>
                          </div>
                      )}
                      {prescreenDate && (
                          <div className="detail-row">
                              <span className="detail-label">Prescreened:</span>
                              <span className="detail-value" style={{ color: '#059669', fontWeight: 700 }}>
                                  {prescreenDate}
                              </span>
                          </div>
                      )}
                      <div className="detail-row"><span className="detail-label">Hiring Mgr:</span><span className="detail-value">{job?.hiringManager}</span></div>
                      <div className="detail-row"><span className="detail-label">Management:</span><span className="detail-value">{job?.management}</span></div>
                  </div>

                  {applicant.previousApplications && applicant.previousApplications.length > 0 && (
                    <div className="previous-apps-section">
                      <h3 className="section-title">PREVIOUS APPLICATION</h3>
                      {applicant.previousApplications.map((app, index) => (
                        <div key={index} className="previous-app-item">
                          <div className="detail-row"><span className="detail-label">Role:</span><span className="detail-value">{app.role}</span></div>
                          <div className="detail-row"><span className="detail-label">Final Stage:</span><span className="detail-value"><span className={`stage-tag-small ${app.status === 'Disqualified' ? 'negative' : ''}`}>{app.status}</span></span></div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <div className="card-section border-top logs">
                  <h3 className="section-title">LOGS</h3>
                  <div className="history-list">
                      {applicant.contactLogs.map(log => (
                          <div key={log.id} className="history-item">
                              <div className="history-item-top">
                                  <div className={`dot-indicator ${
                                      ['Pass', 'Contactable', 'Interested', 'Signed', 'Completed', 'Accept Offer'].includes(log.result) || 
                                      log.result.includes('Shortlisted') || 
                                      log.result.includes('Reactivated') || 
                                      log.result.includes('Moved') 
                                      ? 'success' : 'fail'
                                  }`}></div>
                                  <span className="history-stage-tag">{log.stage}</span>
                                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{log.result}</span>
                              </div>
                              <div className="history-item-meta">{log.taName} • {log.date}</div>
                              {renderLogReason(log)}
                          </div>
                      ))}
                      {applicant.contactLogs.length === 0 && <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No logs recorded yet.</p>}
                  </div>
              </div>
            </div>
          </div>
          <div className="journey-column">
            {JOURNEY_STAGES.filter(s => !['Application', 'Shortlisted', 'Disqualified'].includes(s.id)).map((stage) => {
              const stageIndex = JOURNEY_STAGES.findIndex(s_ => s_.id === stage.id);
              const isCompleted = stageIndex < currentStatusIndex;
              const isCurrent = stageIndex === currentStatusIndex;
              const statusClass = isCurrent ? 'current' : isCompleted ? 'completed' : 'future';
              const latestLogForStage = [...applicant.contactLogs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).find(log => log.stage === stage.id);
              
              return (
                <div key={stage.id} className="timeline-step" ref={isCurrent ? currentStageRef : null}>
                  <div className="timeline-v-line"></div>
                  <div className={`timeline-node ${statusClass}`}>{isCompleted && <CheckIcon />} {isCurrent && <SparklesIcon />}</div>
                  <div className={`timeline-content ${statusClass}`}>
                    <div className={`timeline-header ${isCompleted ? 'clickable' : ''}`} onClick={() => isCompleted && handleToggleCompleted(stage.id)}>
                      <div>
                        <h3 className="timeline-title">{stage.label}</h3>
                        {isCompleted && latestLogForStage && <p className="timeline-summary">Completed on {latestLogForStage.date} by <strong>{latestLogForStage.taName}</strong> • Result: {latestLogForStage.result}</p>}
                      </div>
                      {isCompleted && <span className="timeline-chevron">{expandedCompletedStage === stage.id ? '▲' : '▼'}</span>}
                    </div>

                    {(isCurrent || (isCompleted && expandedCompletedStage === stage.id)) && (
                      <>
                        {stage.id === 'Prescreen' && (() => {
                            const shouldShowMaster = showMasterFields || !!prescreenData.masterUniversity || !!prescreenData.masterFaculty;
                            const shouldShowPhd = showPhdFields || !!prescreenData.phdUniversity || !!prescreenData.phdFaculty;

                            return (
                          <div className="timeline-form-container">
                            <div className="form-field">
                                <label>Contact Result</label>
                                <select value={prescreenData.contactResult} onChange={e => setPrescreenData({ ...prescreenData, contactResult: e.target.value })}>
                                    <option>Contactable</option>
                                    <option>No Answer</option>
                                    <option>Busy / Call Back</option>
                                    <option>Wrong Number</option>
                                </select>
                            </div>
                            
                            {prescreenData.contactResult === 'Contactable' && (
                            <>
                                <div className="form-field" style={{ marginTop: '16px' }}><label>Current Position & Experience</label><textarea rows={3} value={prescreenData.currentPosition} onChange={e => setPrescreenData({ ...prescreenData, currentPosition: e.target.value })} placeholder="Current company, title, main responsibilities..." /></div>
                                <div className="form-field" style={{ marginTop: '16px' }}><label>Reason for Job Change</label><textarea rows={3} value={prescreenData.reasonForChange} onChange={e => setPrescreenData({ ...prescreenData, reasonForChange: e.target.value })} placeholder="Why are you considering a new role at this time?" /></div>
                                
                                <div className="form-grid" style={{ marginTop: '16px', gridTemplateColumns: '0.5fr 1fr 1fr', alignItems: 'start' }}>
                                    <div className="form-field">
                                        <label>Education (GPA)</label>
                                        <input type="text" placeholder="e.g., 3.45" value={prescreenData.gpa} onChange={e => setPrescreenData({ ...prescreenData, gpa: e.target.value })} />
                                        <div className="ceo-trigger-check">
                                            <input type="checkbox" id="gpaCeoTrigger" checked={!!prescreenData.gpaCeoTrigger} onChange={e => setPrescreenData({ ...prescreenData, gpaCeoTrigger: e.target.checked })} />
                                            <label htmlFor="gpaCeoTrigger">Passes CEO Trigger</label>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>University</label>
                                        <input type="text" placeholder="e.g., Stanford University" value={prescreenData.university} onChange={e => setPrescreenData({ ...prescreenData, university: e.target.value })} />
                                        <div className="ceo-trigger-check">
                                            <input type="checkbox" id="universityCeoTrigger" checked={!!prescreenData.universityCeoTrigger} onChange={e => setPrescreenData({ ...prescreenData, universityCeoTrigger: e.target.checked })} />
                                            <label htmlFor="universityCeoTrigger">Passes CEO Trigger</label>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>Faculty</label>
                                        <input type="text" placeholder="e.g., School of Engineering" value={prescreenData.faculty} onChange={e => setPrescreenData({ ...prescreenData, faculty: e.target.value })} />
                                        <div className="ceo-trigger-check">
                                            <input type="checkbox" id="facultyCeoTrigger" checked={!!prescreenData.facultyCeoTrigger} onChange={e => setPrescreenData({ ...prescreenData, facultyCeoTrigger: e.target.checked })} />
                                            <label htmlFor="facultyCeoTrigger">Passes CEO Trigger</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="add-education-container">
                                    {!shouldShowMaster && (
                                        <button type="button" className="add-education-btn" onClick={() => setShowMasterFields(true)}>
                                            + Add Master's Degree Details
                                        </button>
                                    )}
                                    {!shouldShowPhd && (
                                        <button type="button" className="add-education-btn" onClick={() => setShowPhdFields(true)}>
                                            + Add PhD Details
                                        </button>
                                    )}
                                </div>
                                
                                {shouldShowMaster && (
                                    <div className="form-grid-with-header">
                                        <div className="form-grid-header">
                                            <h4>Master's Degree Details</h4>
                                            {(!prescreenData.masterUniversity && !prescreenData.masterFaculty) && (
                                                <button type="button" className="remove-education-btn" onClick={() => setShowMasterFields(false)}>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-field">
                                                <label>Master's University</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g., Carnegie Mellon University" 
                                                    value={prescreenData.masterUniversity} 
                                                    onChange={e => setPrescreenData({ ...prescreenData, masterUniversity: e.target.value })} 
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Master's Faculty</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g., School of Computer Science" 
                                                    value={prescreenData.masterFaculty} 
                                                    onChange={e => setPrescreenData({ ...prescreenData, masterFaculty: e.target.value })} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {shouldShowPhd && (
                                    <div className="form-grid-with-header">
                                        <div className="form-grid-header">
                                            <h4>PhD Details</h4>
                                            {(!prescreenData.phdUniversity && !prescreenData.phdFaculty) && (
                                                <button type="button" className="remove-education-btn" onClick={() => setShowPhdFields(false)}>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-field">
                                                <label>PhD University</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g., ETH Zurich" 
                                                    value={prescreenData.phdUniversity} 
                                                    onChange={e => setPrescreenData({ ...prescreenData, phdUniversity: e.target.value })} 
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>PhD Faculty</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g., Department of Information Technology" 
                                                    value={prescreenData.phdFaculty} 
                                                    onChange={e => setPrescreenData({ ...prescreenData, phdFaculty: e.target.value })} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="form-grid" style={{ marginTop: '16px' }}>
                                    <div className="form-field">
                                        <label>Current Salary</label>
                                        <input type="number" placeholder="e.g. 50000" value={prescreenData.currentSalary} onChange={e => setPrescreenData({ ...prescreenData, currentSalary: e.target.value })} />
                                        <div className="ceo-trigger-check">
                                            <input type="checkbox" id="currentSalaryCeoTrigger" checked={!!prescreenData.currentSalaryCeoTrigger} onChange={e => setPrescreenData({ ...prescreenData, currentSalaryCeoTrigger: e.target.checked })} />
                                            <label htmlFor="currentSalaryCeoTrigger">Passes CEO Trigger</label>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>Expected Salary</label>
                                        <input type="number" placeholder="e.g. 65000" value={prescreenData.expectedSalary} onChange={e => setPrescreenData({ ...prescreenData, expectedSalary: e.target.value })} />
                                        <div className="ceo-trigger-check">
                                            <input type="checkbox" id="expectedSalaryCeoTrigger" checked={!!prescreenData.expectedSalaryCeoTrigger} onChange={e => setPrescreenData({ ...prescreenData, expectedSalaryCeoTrigger: e.target.checked })} />
                                            <label htmlFor="expectedSalaryCeoTrigger">Passes CEO Trigger</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-grid" style={{ marginTop: '16px' }}>
                                    <div className="form-field">
                                        <label>Location & Time Convenience</label>
                                        <select value={prescreenData.locationConvenience} onChange={e => setPrescreenData({ ...prescreenData, locationConvenience: e.target.value })}>
                                            <option value="Pending">Pending</option>
                                            <option value="Convenient">Convenient</option>
                                            <option value="Not Convenient">Not Convenient</option>
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Notice Period / Earliest Start</label>
                                        <input type="text" placeholder="e.g., 30 days or specific date" value={prescreenData.noticePeriod} onChange={e => setPrescreenData({ ...prescreenData, noticePeriod: e.target.value })} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
                                    <div className="form-field">
                                        <label>Pre-screen Result</label>
                                        <select value={prescreenData.prescreenResult} onChange={e => setPrescreenData({ ...prescreenData, prescreenResult: e.target.value })}>
                                            <option value="Pending">Pending</option>
                                            <option value="Pass">Pass</option>
                                            <option value="Fail">Fail</option>
                                            <option value="Candidate Reject">Candidate Reject</option>
                                        </select>
                                    </div>
                                    {prescreenData.prescreenResult === 'Fail' && (<div className="form-field" style={{ marginTop: '16px' }}><label>Pre-screen Fail Reason</label><select value={prescreenData.failReason} onChange={e => setPrescreenData({ ...prescreenData, failReason: e.target.value })}><option value="">Select Reason</option><option>Technical Skills</option><option>Communication</option><option>Experience Level</option><option>Culture Fit</option><option>Other</option></select></div>)}
                                    {prescreenData.prescreenResult === 'Candidate Reject' && (<div className="form-field" style={{ marginTop: '16px' }}><label>Candidate Reject Reason</label><select value={prescreenData.rejectReason} onChange={e => setPrescreenData({ ...prescreenData, rejectReason: e.target.value })}><option value="">Select Reason</option><option>Salary Package</option><option>Benefits</option><option>Location</option><option>Role Scope</option><option>Other Offer</option></select></div>)}
                                    {prescreenData.prescreenResult === 'Pass' && (
                                        <div className="form-grid" style={{ marginTop: '16px' }}>
                                            <div className="form-field">
                                                <label>Online Test Link</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="https://example.com/test-link" 
                                                    value={prescreenData.onlineTestLink} 
                                                    onChange={e => setPrescreenData({ ...prescreenData, onlineTestLink: e.target.value })} 
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Online Test Due Date</label>
                                                <input
                                                    type="date"
                                                    value={prescreenData.onlineTestDueDate}
                                                    onChange={e => setPrescreenData({ ...prescreenData, onlineTestDueDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="form-field" style={{ marginTop: '16px' }}><label>Internal Notes</label><textarea rows={3} value={prescreenData.note} onChange={e => setPrescreenData({ ...prescreenData, note: e.target.value })} placeholder="Add notes about candidate..." /></div>
                            </>
                            )}

                            {isCompleted && latestLogForStage && <ActionLogDisplay log={latestLogForStage} />}
                            <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('Prescreen')}>{isCurrent ? 'Confirm Prescreen' : 'Update Prescreen Log'}</button>
                          </div>
                            )
                        })()}
                        {stage.id === 'Online-test' && (
                          <div className="timeline-form-container">
                            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                              <div className="form-field"><label>Email Status</label><p className="log-value"><span className="stage-mini-pill-clean" style={{ background: '#dcfce7', color: '#166534' }}>{onlineTestData.emailStatus}</span></p></div>
                              <div className="form-field"><label>Email Date</label><p className="log-value">{onlineTestData.emailDate ? new Date(onlineTestData.emailDate).toLocaleDateString() : 'N/A'}</p></div>
                              <div className="form-field"><label>Due Date</label><p className="log-value">{onlineTestData.dueDate ? new Date(onlineTestData.dueDate).toLocaleDateString() : 'N/A'}</p></div>
                              <div className="form-field"><label>Last Follow Up</label><p className="log-value">{onlineTestData.lastFollowUp ? new Date(onlineTestData.lastFollowUp).toLocaleDateString() : 'N/A'}</p></div>
                            </div>
                            <div className="form-grid"><div className="form-field"><label>Online IQ Test Score</label><input type="number" placeholder="e.g. 120" value={onlineTestData.iqScore} onChange={e => setOnlineTestData({...onlineTestData, iqScore: e.target.value})} /></div><div className="form-field"><label>Online English Test Score</label><input type="number" placeholder="e.g. 95" value={onlineTestData.englishScore} onChange={e => setOnlineTestData({...onlineTestData, englishScore: e.target.value})} /></div></div>
                            
                            {showFollowUpForm && (
                                <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#f97316', marginBottom: '12px', fontWeight: '600' }}>Test is overdue. Please follow up.</p>
                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label>Follow-up Contact Result</label>
                                            <select value={onlineTestData.followUpContactResult} onChange={e => setOnlineTestData({...onlineTestData, followUpContactResult: e.target.value})}>
                                                <option>No Answer</option>
                                                <option>Contactable</option>
                                                <option>Busy / Call Back</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>New Due Date</label>
                                            <input type="date" value={onlineTestData.nextDueDate} onChange={e => setOnlineTestData({...onlineTestData, nextDueDate: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-grid" style={{ marginTop: '16px' }}>
                                <div className="form-field">
                                    <label>Online Test Result</label>
                                    <select value={onlineTestData.testResult} onChange={handleOnlineTestResultChange}>
                                        <option value="Pending">Pending</option>
                                        <option value="Pass">Pass</option>
                                        <option value="Fail">Fail</option>
                                    </select>
                                </div>
                                {(onlineTestData.testResult === 'Pass' || onlineTestData.testResult === 'Fail') && (
                                    <div className="form-field">
                                        <label>Continue Process?</label>
                                        <select value={onlineTestData.continueProcess} onChange={e => setOnlineTestData({...onlineTestData, continueProcess: e.target.value})}>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            {onlineTestData.testResult === 'Pass' && onlineTestData.continueProcess === 'Yes' && (
                                <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
                                    <div className="form-field" style={{marginBottom: '16px'}}>
                                        <label>Interview Type</label>
                                        <select
                                            value={onlineTestData.interviewType}
                                            onChange={e => setOnlineTestData({...onlineTestData, interviewType: e.target.value})}
                                        >
                                            <option value="Offline">Offline</option>
                                            <option value="Online">Online</option>
                                        </select>
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label>Interview Date</label>
                                            <input
                                                type="date"
                                                value={onlineTestData.interviewDate}
                                                onChange={e => setOnlineTestData({...onlineTestData, interviewDate: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Interview Time</label>
                                            <input
                                                type="time"
                                                value={onlineTestData.interviewTime}
                                                onChange={e => setOnlineTestData({...onlineTestData, interviewTime: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-grid" style={{ marginTop: '16px' }}>
                                        <div className="form-field">
                                            <label>HM Interviewer</label>
                                            <select
                                                value={onlineTestData.hmInterviewer}
                                                onChange={e => setOnlineTestData({...onlineTestData, hmInterviewer: e.target.value})}
                                            >
                                                <option value="" disabled>Select Interviewer...</option>
                                                {ALL_EMPLOYEES.map(name => (
                                                    <option key={`hm-${name}`} value={name}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Management Interviewer</label>
                                            <select
                                                value={onlineTestData.managementInterviewer}
                                                onChange={e => setOnlineTestData({...onlineTestData, managementInterviewer: e.target.value})}
                                            >
                                                <option value="" disabled>Select Interviewer...</option>
                                                {ALL_EMPLOYEES.map(name => (
                                                    <option key={`mm-${name}`} value={name}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="form-field" style={{ marginTop: '16px' }}><label>Internal Notes</label><textarea rows={3} value={onlineTestData.note} onChange={e => setOnlineTestData({ ...onlineTestData, note: e.target.value })} placeholder="Add notes about test results..." /></div>
                            {isCompleted && latestLogForStage && <ActionLogDisplay log={latestLogForStage} />}
                            <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('Online-test')}>{isCurrent ? 'Confirm Online Test' : 'Update Online Test Log'}</button>
                          </div>
                        )}
                        {stage.id === 'Cognitive-test' && (
                          <div className="timeline-form-container">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Test Score</label>
                                    <div className="input-with-trigger">
                                        <input type="number" value={cognitiveTestData.testScore} onChange={e => setCognitiveTestData({...cognitiveTestData, testScore: e.target.value})} placeholder="e.g. 85" />
                                        <div className="ceo-trigger-check">
                                            <input type="checkbox" id="testScoreCeoTrigger" checked={!!cognitiveTestData.testScoreCeoTrigger} onChange={e => setCognitiveTestData({ ...cognitiveTestData, testScoreCeoTrigger: e.target.checked })} />
                                            <label htmlFor="testScoreCeoTrigger">Passes CEO Trigger</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Test Result</label>
                                    <select value={cognitiveTestData.testResult} onChange={e => setCognitiveTestData({...cognitiveTestData, testResult: e.target.value})}>
                                        <option value="" disabled>Select Result...</option>
                                        <option value="Pass">Pass</option>
                                        <option value="Fail">Fail</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-field" style={{ marginTop: '16px' }}><label>Notes</label><textarea rows={2} value={cognitiveTestData.note} onChange={e => setCognitiveTestData({...cognitiveTestData, note: e.target.value})} placeholder="e.g., strong analytical skills observed..."/></div>
                            {isCompleted && latestLogForStage && <ActionLogDisplay log={latestLogForStage} />}
                            <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('Cognitive-test')}>{isCurrent ? 'Confirm Cognitive Test' : 'Update Cognitive Test Log'}</button>
                          </div>
                        )}
                        {stage.id === 'HM-interview' && (() => {
                            const hmInterviewLog = applicant.contactLogs.find(log => log.stage === 'HM-interview');
                            const hmHasSubmitted = !!hmInterviewLog;
                            const hmResultIsPass = hmHasSubmitted && JSON.parse(hmInterviewLog?.reason || '{}').result === 'Pass';
                            
                            return (
                                <div className="timeline-form-container">
                                    {/* Section 1: Interview Feedback (For HM) */}
                                    <fieldset disabled={userRole === 'TA' || (hmHasSubmitted && isCurrent) || isCompleted} style={{ border: 'none', padding: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>HM Interview Feedback</h4>
                                            <button className="generate-btn" onClick={handleOpenHandOff} disabled={(userRole === 'TA' && !isCompleted) || (hmHasSubmitted && isCurrent)}>
                                                <DocumentTextIcon />
                                                Generate Hand-off
                                            </button>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-field">
                                                <label>Interview Result</label>
                                                <select value={hmInterviewData.result} onChange={e => setHmInterviewData({ ...hmInterviewData, result: e.target.value })}>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Pass">Pass</option>
                                                    <option value="Fail">Fail</option>
                                                    <option value="On Hold">On Hold</option>
                                                </select>
                                            </div>
                                            <div className="form-field">
                                                <label>Interviewer</label>
                                                <input type="text" value={hmInterviewData.interviewer} onChange={e => setHmInterviewData({ ...hmInterviewData, interviewer: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-field" style={{ marginTop: '16px' }}>
                                            <label>Feedback Notes</label>
                                            <textarea rows={3} value={hmInterviewData.note} onChange={e => setHmInterviewData({ ...hmInterviewData, note: e.target.value })} placeholder="Enter HM Interview feedback..." />
                                        </div>
                                    </fieldset>
                                    
                                    {isCurrent && userRole === 'HiringManager' && !hmHasSubmitted && (
                                        <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={handleHmFeedbackSubmit}>
                                            Submit Feedback
                                        </button>
                                    )}

                                    {/* Section 2: TA Action - Next Step Scheduling */}
                                    {(hmInterviewData.result === 'Pass' || hmResultIsPass) && (
                                        <div style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
                                            <fieldset disabled={userRole === 'HiringManager' || !hmHasSubmitted || isCompleted} style={{ border: 'none', padding: 0 }}>
                                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Next Step Scheduling (TA Action)</h4>
                                                <div className="form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                                    <input type="checkbox" id="needsScheduling" checked={hmInterviewData.needsScheduling || false} onChange={e => setHmInterviewData({ ...hmInterviewData, needsScheduling: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                                                    <label htmlFor="needsScheduling" style={{ marginBottom: 0 }}>Schedule next interview for a later time</label>
                                                </div>
                                                
                                                {(hmInterviewData.needsScheduling) && (
                                                    <div className="form-grid" style={{ marginTop: '16px' }}>
                                                        <div className="form-field">
                                                            <label>Next Interview Date</label>
                                                            <input type="date" value={hmInterviewData.nextInterviewDate || ''} onChange={e => setHmInterviewData({ ...hmInterviewData, nextInterviewDate: e.target.value })} />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Next Interview Time</label>
                                                            <input type="time" value={hmInterviewData.nextInterviewTime || '10:00'} onChange={e => setHmInterviewData({ ...hmInterviewData, nextInterviewTime: e.target.value })} />
                                                        </div>
                                                    </div>
                                                )}
                                            </fieldset>
                                        </div>
                                    )}
                                    
                                    {isCurrent && userRole === 'TA' && hmResultIsPass && (
                                        <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('HM-interview')}>
                                            Confirm & Move to Next Stage
                                        </button>
                                    )}
                                    
                                    {isCompleted && latestLogForStage && <ActionLogDisplay log={latestLogForStage} />}
                                    
                                    {isCompleted && userRole === 'TA' && (
                                        <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('HM-interview')}>
                                            Update HM Interview Log
                                        </button>
                                    )}
                                </div>
                            );
                        })()}
                        {stage.id === 'Management-interview' && renderInterviewForm('Management-interview', managementInterviewData, setManagementInterviewData, 'Management Interview', isCurrent, isCompleted, latestLogForStage)}
                        {stage.id === 'CEO-interview' && renderInterviewForm('CEO-interview', ceoInterviewData, setCeoInterviewData, 'CEO Interview', isCurrent, isCompleted, latestLogForStage)}
                        {stage.id === 'Offering' && (() => {
                            const isFollowUpDatePassed = offeringData.followUpDate && new Date() > new Date(offeringData.followUpDate);
                            const offerIsPending = offeringData.offerResult === 'Pending';
                            const showOfferFollowUpForm = isFollowUpDatePassed && offerIsPending;
                            return (
                                <div className="timeline-form-container">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Offer Details</h4>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <button className="generate-btn" onClick={() => setIsContractDrawerOpen(true)}>
                                            <DocumentTextIcon />
                                            Generate Contract
                                        </button>
                                        <button className="generate-btn" onClick={handleOpenHandOff}>
                                            <DocumentTextIcon />
                                            Generate Hand-off
                                        </button>
                                    </div>
                                </div>
                                {offerIsPending && (
                                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                                        <div className="form-field">
                                          <label>Offer Approval</label>
                                          <p className="log-value"><span className={`stage-mini-pill-clean ${offeringData.isApproveOfferStatus === 'Approved' ? 'approved' : ''}`}>{offeringData.isApproveOfferStatus}</span></p>
                                        </div>
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Contact Status</label>
                                        <select value={offeringData.contactStatus} onChange={e => setOfferingData({...offeringData, contactStatus: e.target.value})}>
                                            <option>Contactable</option>
                                            <option>No Answer</option>
                                            <option>Busy / Call Back</option>
                                            <option>Wrong Number</option>
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Offer Result</label>
                                        <select value={offeringData.offerResult} onChange={e => setOfferingData({...offeringData, offerResult: e.target.value})}>
                                            <option value="Pending">Pending</option>
                                            <option value="Pass">Accept Offer</option>
                                            <option value="Fail">Reject Offer</option>
                                        </select>
                                    </div>
                                </div>

                                {offerIsPending && (
                                    <div className="form-field" style={{ marginTop: '16px' }}>
                                        <label>Follow-up Date</label>
                                        <input type="date" value={offeringData.followUpDate} onChange={e => setOfferingData({...offeringData, followUpDate: e.target.value})} />
                                    </div>
                                )}

                                {showOfferFollowUpForm && (
                                    <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#f97316', marginBottom: '12px', fontWeight: '600' }}>Follow-up is overdue. Please contact the candidate.</p>
                                        <div className="form-grid">
                                            <div className="form-field">
                                                <label>Follow-up Contact Result</label>
                                                <select value={offeringData.followUpContactResult} onChange={e => setOfferingData({...offeringData, followUpContactResult: e.target.value})}>
                                                    <option>No Answer</option>
                                                    <option>Contactable</option>
                                                    <option>Busy / Call Back</option>
                                                </select>
                                            </div>
                                            <div className="form-field">
                                                <label>New Follow-up Date</label>
                                                <input type="date" value={offeringData.nextFollowUpDate} onChange={e => setOfferingData({...offeringData, nextFollowUpDate: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {offeringData.offerResult === 'Pass' && (
                                  <>
                                    <div className="form-grid" style={{ marginTop: '16px' }}>
                                      <div className="form-field"><label>Contract Sign Date</label><input type="date" value={offeringData.contractSignDate} onChange={e => setOfferingData({...offeringData, contractSignDate: e.target.value})} /></div>
                                      <div className="form-field"><label>Contract Sign Time</label><input type="time" value={offeringData.contractSignTime} onChange={e => setOfferingData({...offeringData, contractSignTime: e.target.value})} /></div>
                                    </div>
                                    <div className="form-grid" style={{ marginTop: '16px' }}>
                                      <div className="form-field" style={{ gridColumn: 'span 2' }}>
                                        <label>Planned Onboarding Date</label>
                                        <input type="date" value={offeringData.onboardingDate} onChange={e => setOfferingData({...offeringData, onboardingDate: e.target.value})} />
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="form-field" style={{ marginTop: '16px' }}><label>Internal Notes</label><textarea rows={3} value={offeringData.note} onChange={e => setOfferingData({ ...offeringData, note: e.target.value })} placeholder="Add notes about offer..." /></div>
                                {isCompleted && latestLogForStage && <ActionLogDisplay log={latestLogForStage} />}
                                <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('Offering')}>{isCurrent ? 'Confirm Offer' : 'Update Offer Log'}</button>
                              </div>
                            )
                        })()}
                        {stage.id === 'Sign-contract' && (
                          <div className="timeline-form-container">
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Sign Contract</h4>
                            <div className="form-field">
                              <label>Is Contract Signed?</label>
                              <select value={signContractData.contractStatus} onChange={e => setSignContractData({...signContractData, contractStatus: e.target.value})}>
                                <option value="Pending Signature">Pending</option>
                                <option value="Signed">Yes, Signed</option>
                                <option value="Declined">No, Declined</option>
                              </select>
                            </div>
                            {isCompleted && latestLogForStage && <ActionLogDisplay log={latestLogForStage} />}
                            <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('Sign-contract')}>{isCurrent ? 'Confirm Contract Status' : 'Update Contract Log'}</button>
                          </div>
                        )}
                        {stage.id === 'Onboarding' && (
                          <div className="timeline-form-container">
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Onboarding</h4>
                             <div className="form-field">
                              <label>Is Onboarding Complete?</label>
                              <select value={onboardingData.onboardingStatus} onChange={e => setOnboardingData({...onboardingData, onboardingStatus: e.target.value})}>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Yes, Completed</option>
                              </select>
                            </div>
                            {isCompleted && latestLogForStage && <ActionLogDisplay log={latestLogForStage} />}
                            <button className="confirm-btn-pink" style={{ marginTop: '20px' }} onClick={() => handleConfirm('Onboarding')}>{isCurrent ? 'Confirm Onboarding Status' : 'Update Onboarding Log'}</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <SideDrawer isOpen={isHandOffOpen} onClose={() => setIsHandOffOpen(false)} title="Candidate Hand-off Form">
          <HandOffForm data={handOffData} />
      </SideDrawer>
      <SideDrawer isOpen={isContractDrawerOpen} onClose={() => setIsContractDrawerOpen(false)} title="Employment Contract">
          {job && <EmploymentContract 
            applicant={applicant} 
            job={job} 
            offerData={{
                ...offeringData,
                salary: offeringData.salary || prescreenData.expectedSalary || '',
            }}
            onSalaryChange={(newSalary) => setOfferingData(prev => ({ ...prev, salary: newSalary }))} 
          />}
      </SideDrawer>
      <SideDrawer isOpen={isMoveDrawerOpen} onClose={() => setIsMoveDrawerOpen(false)} title="Move Candidate">
          {job && <MoveCandidateForm 
              currentJobId={applicant.jobId}
              jobs={jobs}
              onConfirmMove={(newJobId) => {
                  onMoveCandidate(applicant.id, newJobId);
                  setIsMoveDrawerOpen(false);
              }}
          />}
      </SideDrawer>
      <SideDrawer isOpen={isDropDrawerOpen} onClose={() => setIsDropDrawerOpen(false)} title="Drop Candidate">
          <div className="drop-candidate-form">
              <div className="form-field">
                  <label>Reason for Dropping*</label>
                  <select value={dropReason} onChange={(e) => setDropReason(e.target.value)}>
                      <option value="" disabled>Select a reason...</option>
                      {DROP_REASONS.map(reason => (
                          <option key={reason} value={reason}>{reason}</option>
                      ))}
                  </select>
              </div>
              <div className="form-field">
                  <label>Additional Notes</label>
                  <textarea 
                      rows={4} 
                      value={dropNotes}
                      onChange={(e) => setDropNotes(e.target.value)}
                      placeholder="Add any extra details here..."
                  />
              </div>
              <button 
                  className="confirm-btn-pink" 
                  style={{marginTop: '20px', background: '#ef4444'}} 
                  onClick={handleConfirmDrop}
                  disabled={!dropReason}
              >
                  Confirm Drop
              </button>
          </div>
      </SideDrawer>
    </>
  );
};
