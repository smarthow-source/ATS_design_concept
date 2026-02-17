
import React, { useState, useMemo, useEffect } from 'react';
import { Applicant, ApplicantStatus, JobOpening, UserRole } from '../types';
import { CandidateProfile } from './CandidateProfile';
import { SparklesIcon } from './Icons';
import { JOURNEY_STAGES, POST_PRESCREEN_STAGES } from '../constants';

interface WorklistPageProps {
  applicants: Applicant[];
  jobs: JobOpening[];
  selectedApplicantId: string | null;
  onApplicantClick: (id: string) => void;
  onStatusChange: (id: string, status: ApplicantStatus) => void;
  onConfirmLog: (applicantId: string, stage: ApplicantStatus, result: string, note: string, date: string, time: string, actor: UserRole) => void;
  onMoveCandidate: (applicantId: string, newJobId: string) => void;
  selectedJobId?: string | null;
  userRole: UserRole;
  currentUserTA: string;
}

export const WorklistPage: React.FC<WorklistPageProps> = ({ 
  applicants, 
  jobs, 
  selectedApplicantId, 
  onApplicantClick, 
  onStatusChange, 
  onConfirmLog,
  onMoveCandidate,
  selectedJobId,
  userRole,
  currentUserTA
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState<string>(selectedJobId || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Update internal job filter if props change
  useEffect(() => {
    if (selectedJobId) {
      setJobFilter(selectedJobId);
    }
  }, [selectedJobId]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJob = jobFilter === 'all' ? true : a.jobId === jobFilter;
      const matchesStatus = statusFilter === 'all' ? true : a.status === statusFilter;
      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [applicants, searchTerm, jobFilter, statusFilter]);

  // Ensure an active applicant is always selected if available in the filtered list
  const activeApplicant = useMemo(() => {
    if (selectedApplicantId) {
      const selected = filteredApplicants.find(a => a.id === selectedApplicantId);
      if (selected) return selected;
    }
    return filteredApplicants.length > 0 ? filteredApplicants[0] : null;
  }, [filteredApplicants, selectedApplicantId]);

  return (
    <div className="split-pipeline-view">
      <div className="pipeline-list-pane">
        {/* Search & Multi-Filter Bar */}
        <div className="worklist-filter-bar">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search-input"
            />
          </div>
          
          <div className="filter-row">
            <select 
              className="filter-job-select" 
              value={jobFilter} 
              onChange={(e) => setJobFilter(e.target.value)}
              disabled={!!selectedJobId}
            >
              <option value="all">All Jobs</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>

            <select 
              className="filter-job-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {JOURNEY_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="card-container">
          {filteredApplicants.map(a => {
            const prescreenLog = a.contactLogs.find(log => log.stage === 'Prescreen' && log.result === 'Pass');
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

            const onlineTestLog = a.contactLogs.find(log => log.stage === 'Online-test' && log.result === 'Pass');
            let interviewDetails = null;
            if (onlineTestLog && onlineTestLog.reason) {
                try {
                    const details = JSON.parse(onlineTestLog.reason);
                    if (details.interviewDate) {
                        interviewDetails = {
                            type: details.interviewType || 'N/A',
                            date: new Date(details.interviewDate).toLocaleDateString()
                        };
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            }
            
            const hmInterviewStageIndex = JOURNEY_STAGES.findIndex(s => s.id === 'HM-interview');
            const currentStageIndex = JOURNEY_STAGES.findIndex(s => s.id === a.status);
            const showInterviewDetails = currentStageIndex >= hmInterviewStageIndex;
            
            const isHighlighted = userRole === 'TA' && a.assignedTA === currentUserTA;
            
            return (
              <div 
                key={a.id} 
                className={`cdd-card ${activeApplicant?.id === a.id ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`} 
                onClick={() => onApplicantClick(a.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="cdd-date">{new Date(a.lastActionDate).toLocaleDateString()}</span>
                  <span className={`stage-tag-small ${a.status === 'Disqualified' ? 'negative' : ''}`}>{a.status}</span>
                </div>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0f172a', marginBottom: '8px' }}>{a.name}</strong>
                
                <div className="cdd-card-info">
                    <div className="cdd-info-item">📞 {a.phoneNumber}</div>
                    {POST_PRESCREEN_STAGES.includes(a.status) && prescreenDate && (
                      <div className="cdd-info-item prescreened">
                          🗓️ Prescreened: {prescreenDate}
                      </div>
                    )}
                    {showInterviewDetails && interviewDetails && (
                        <div className="cdd-info-item interview">
                            🗓️ Interview: {interviewDetails.date} ({interviewDetails.type})
                        </div>
                    )}
                </div>
              </div>
            );
          })}
          {filteredApplicants.length === 0 && (
            <div className="empty-state-list">
              <p>No candidates match your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <div className="pipeline-detail-pane">
        {activeApplicant ? (
          <CandidateProfile 
            applicant={activeApplicant} 
            job={jobs.find(j => j.id === activeApplicant.jobId)}
            jobs={jobs}
            onStatusChange={onStatusChange}
            onConfirmLog={(...args) => onConfirmLog(...args, userRole)}
            onMoveCandidate={onMoveCandidate}
            userRole={userRole}
          />
        ) : (
          <div className="placeholder-pane">
            <SparklesIcon style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.2, color: 'var(--brand-primary)' }} />
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 500 }}>Select a candidate to inspect their profile</p>
          </div>
        )}
      </div>
    </div>
  );
};
