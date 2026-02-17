
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { Applicant, UserRole, ActiveTab, ApplicantStatus, JobOpening } from './types';
import { INITIAL_APPLICANTS, INITIAL_JOBS, JOURNEY_STAGES } from './constants';
import DottedGlowBackground from './components/DottedGlowBackground';
import { SparklesIcon, GridIcon, CodeIcon, ArrowLeftIcon, UserPlusIcon, SettingsIcon, MenuIcon } from './components/Icons';
import { WorklistPage } from './components/WorklistPage';
import SideDrawer from './components/SideDrawer';
import { AddCandidateForm } from './components/AddCandidateForm';
import { generateId } from './utils';
import { SettingsPage } from './components/SettingsPage';

function App() {
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [jobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeStageTab, setActiveStageTab] = useState<ApplicantStatus | 'All Work'>('All Work');
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('TA');
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const currentUserTA = 'Sarah Jenks'; // Represents the "logged-in" TA user

  const activeJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [selectedJobId, jobs]);

  const toggleSidebar = () => setIsSidebarVisible(prev => !prev);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(a => {
      const matchesJob = selectedJobId ? a.jobId === selectedJobId : true;
      const matchesStage = activeStageTab === 'All Work' || a.status === activeStageTab;
      return matchesJob && matchesStage;
    });
  }, [applicants, selectedJobId, activeStageTab]);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveTab('worklist');
    setActiveStageTab('All Work');
    setSelectedApplicantId(null);
  };

  const handleSidebarTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedJobId(null);
    setSelectedApplicantId(null);
    setActiveStageTab('All Work');
  };

  const handleStatusChange = (applicantId: string, newStatus: ApplicantStatus) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: newStatus, lastActionDate: Date.now() } : a));
  };

  const handleConfirmLog = (applicantId: string, stage: ApplicantStatus, result: string, note: string, date: string, time: string, actor: UserRole) => {
    const actorName = actor === 'TA' ? 'Sarah Jenks' : jobs.find(j => j.id === applicants.find(a => a.id === applicantId)?.jobId)?.hiringManager || 'Hiring Manager';
    const logEntry = { id: Math.random().toString(36).substr(2, 9), date, time, result, taName: actorName, stage, reason: note };
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, lastActionDate: Date.now(), contactLogs: [logEntry, ...a.contactLogs] } : a));
  };

  const handleAddCandidate = (data: Omit<Applicant, 'id' | 'status' | 'lastActionDate' | 'applicationTimestamp' | 'testScores' | 'contactLogs' | 'interviewFeedback'>) => {
    const newApplicant: Applicant = {
      ...data,
      id: generateId(),
      status: 'Application',
      lastActionDate: Date.now(),
      applicationTimestamp: Date.now(),
      assignedTA: 'Sarah Jenks', // Default TA
      hiringManager: jobs.find(j => j.id === data.jobId)?.hiringManager || '',
      testScores: [],
      contactLogs: [],
      interviewFeedback: [],
      lineId: '',
      militaryStatus: 'N/A',
      drivingAbility: 'N/A',
    };
    setApplicants(prev => [newApplicant, ...prev]);
    setIsAddCandidateOpen(false);
  };

  const handleMoveCandidate = (applicantId: string, newJobId: string) => {
    setApplicants(prev => {
        const applicantToMove = prev.find(a => a.id === applicantId);
        if (!applicantToMove) return prev;

        const oldJob = jobs.find(j => j.id === applicantToMove.jobId);
        const newJob = jobs.find(j => j.id === newJobId);
        if (!newJob || !oldJob) return prev;

        const actorName = userRole === 'TA' ? 'Sarah Jenks' : newJob.hiringManager;
        const logEntry = {
            id: generateId(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            result: 'Moved',
            stage: applicantToMove.status,
            taName: actorName,
            reason: `Moved from "${oldJob.title}" to "${newJob.title}".`
        };

        const currentStageIndex = JOURNEY_STAGES.findIndex(s => s.id === applicantToMove.status);
        const cognitiveTestStageIndex = JOURNEY_STAGES.findIndex(s => s.id === 'Cognitive-test');
        
        let newStatus = applicantToMove.status;
        let newContactLogs = [logEntry, ...applicantToMove.contactLogs];

        const sameFamily = oldJob.jobFamilyCode === newJob.jobFamilyCode;

        if (sameFamily) {
            // If in the same family and past cognitive test, reset to cognitive test for review.
            if (currentStageIndex > cognitiveTestStageIndex) {
                newStatus = 'Cognitive-test';
            }
        } else {
            // If in a different family and at or past cognitive test, reset to cognitive test and clear old score log.
            if (currentStageIndex >= cognitiveTestStageIndex) {
                newStatus = 'Cognitive-test';
                // Filter out old cognitive test logs to force a re-test.
                newContactLogs = newContactLogs.filter(log => log.stage !== 'Cognitive-test');
            }
        }

        return prev.map(a => 
            a.id === applicantId 
            ? {
                ...a,
                jobId: newJobId,
                role: newJob.title,
                hiringManager: newJob.hiringManager,
                status: newStatus,
                lastActionDate: Date.now(),
                contactLogs: newContactLogs
              } 
            : a
        );
    });
};

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const baseList = applicants.filter(a => selectedJobId ? a.jobId === selectedJobId : true);
    counts['All Work'] = baseList.length;
    JOURNEY_STAGES.forEach(s => {
      counts[s.id] = baseList.filter(a => a.status === s.id).length;
    });
    return counts;
  }, [applicants, selectedJobId]);

  const getHeaderText = () => {
    if (activeTab === 'settings') return 'Application Settings';
    if (selectedJobId) return activeJob?.title;
    if (activeTab === 'jobs') return 'Positions';
    return 'Worklist';
  };

  const getHeaderSubtitle = () => {
    if (activeTab === 'settings') return 'Manage application-wide configurations';
    if (selectedJobId) return `${activeJob?.department} • ${activeJob?.location}`;
    return 'Unified candidate pipelines';
  };


  return (
    <>
      <div className={`ats-container ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}>
        <DottedGlowBackground gap={35} radius={1} speedScale={0.2} opacity={0.6} color="rgba(0,0,0,0.2)" glowColor="rgba(0,0,0,0.4)" />
        
        <nav className="ats-sidebar">
          <div className="ats-logo"><SparklesIcon /><span>Nexus ATS</span></div>
          <div className="nav-items">
            <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => handleSidebarTabClick('jobs')}><GridIcon /> Job Openings</button>
            <button className={activeTab === 'worklist' && !selectedJobId ? 'active' : ''} onClick={() => handleSidebarTabClick('worklist')}><CodeIcon /> Global Worklist</button>
            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => handleSidebarTabClick('settings')}><SettingsIcon /> Settings</button>
          </div>
          <div className="role-switcher">
            <label>User Role</label>
            <select value={userRole} onChange={(e) => setUserRole(e.target.value as UserRole)}>
              <option value="TA">Talent Acquisition</option>
              <option value="HiringManager">Hiring Manager</option>
            </select>
          </div>
        </nav>

        <main className="ats-main">
          <header className="ats-header">
            <div className="header-left">
              <button className="sidebar-toggle-btn" onClick={toggleSidebar}><MenuIcon /></button>
              {(selectedJobId || (activeTab === 'worklist' && selectedJobId === null)) && (
                <button className="back-btn" onClick={() => { setActiveTab('jobs'); setSelectedJobId(null); }}><ArrowLeftIcon /></button>
              )}
              <div className="header-text">
                <h1>{getHeaderText()}</h1>
                <span className="header-subtitle">{getHeaderSubtitle()}</span>
              </div>
            </div>
            <div className="header-right">
              <button className="add-candidate-btn" onClick={() => setIsAddCandidateOpen(true)}>
                <UserPlusIcon />
                <span>Add Candidate</span>
              </button>
            </div>
          </header>

          {activeTab === 'worklist' && (
            <div className="stage-tab-container">
              <div className="stage-tabs">
                <button className={`stage-tab-item ${activeStageTab === 'All Work' ? 'active' : ''}`} onClick={() => setActiveStageTab('All Work')}>
                  All <span className="stage-count">{stageCounts['All Work']}</span>
                </button>
                {JOURNEY_STAGES.map(stage => (
                  <button key={stage.id} className={`stage-tab-item ${activeStageTab === stage.id ? 'active' : ''}`} onClick={() => setActiveStageTab(stage.id)}>
                    {stage.label} <span className="stage-count">{stageCounts[stage.id]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ats-content">
            {activeTab === 'jobs' && (
              <div className="jobs-grid">
                {jobs.map(job => (
                  <div 
                    key={job.id} 
                    className={`job-card-premium ${userRole === 'TA' && job.assignedTA === currentUserTA ? 'highlighted' : ''}`} 
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="job-card-header">
                      <span className={`priority-badge ${job.priority.toLowerCase()}`}>{job.priority} Priority</span>
                      <span className="job-open-date">{job.openDate}</span>
                    </div>
                    <div className="job-card-body">
                      <h3>{job.title}</h3>
                      <p className="job-meta">{job.department} • {job.location}</p>
                      <div className="job-hiring-manager"><div className="avatar-small">{job.hiringManager.charAt(0)}</div><span>{job.hiringManager}</span></div>
                    </div>
                    <div className="job-card-footer">
                      <button className="view-pipeline-btn">Manage Pipeline →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'worklist' && (
              <WorklistPage 
                applicants={filteredApplicants}
                jobs={jobs}
                selectedApplicantId={selectedApplicantId}
                onApplicantClick={setSelectedApplicantId}
                onStatusChange={handleStatusChange}
                onConfirmLog={handleConfirmLog}
                onMoveCandidate={handleMoveCandidate}
                selectedJobId={selectedJobId}
                userRole={userRole}
                currentUserTA={currentUserTA}
              />
            )}
            
            {activeTab === 'settings' && (
              <SettingsPage />
            )}
          </div>
        </main>
      </div>

      <SideDrawer isOpen={isAddCandidateOpen} onClose={() => setIsAddCandidateOpen(false)} title="Add New Candidate">
        <AddCandidateForm 
          jobs={jobs}
          onSave={handleAddCandidate}
          onClose={() => setIsAddCandidateOpen(false)}
          initialJobId={selectedJobId}
        />
      </SideDrawer>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
