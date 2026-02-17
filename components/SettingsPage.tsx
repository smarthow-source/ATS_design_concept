

import React, { useState } from 'react';
import { CEOSettingsPage } from './CEOSettingsPage';
import { JobFamilySettingsPage } from './JobFamilySettingsPage';
import { HiringProcessSettingsPage } from './HiringProcessSettingsPage';
import { BriefcaseIcon, SettingsIcon, UsersIcon, ListBulletIcon } from './Icons';
import { JobRoleMasterSettingsPage } from './JobRoleMasterSettingsPage';
import { INITIAL_JOBS } from '../constants';
import { JobRole } from '../types';
import { JOB_FAMILIES } from '../ceoTriggerSettings';
import { generateId } from '../utils';

type SettingsSubTab = 'jobFamily' | 'ceoTrigger' | 'taAllocation' | 'jobRoleMaster';

// Extract unique roles from initial jobs data to populate the master list
const initialJobRoles: JobRole[] = [...new Map(INITIAL_JOBS.map(job => [job.title, job])).values()].map((job, index) => ({
    id: generateId(),
    name: job.title,
    division: job.department,
    jobFamilyCode: JOB_FAMILIES[index % JOB_FAMILIES.length].code, // Assign a default family in round-robin fashion
    hmInterviewer: job.hiringManager,
    managementInterviewer: job.management,
}));


export const SettingsPage: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('jobFamily');
    const [masterRoles, setMasterRoles] = useState<JobRole[]>(initialJobRoles);

    return (
        <div className="settings-page-container">
            <div className="settings-tabs">
                <button
                    className={`settings-tab-item ${activeSubTab === 'jobFamily' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('jobFamily')}
                >
                    <BriefcaseIcon /> Job Family
                </button>
                <button
                    className={`settings-tab-item ${activeSubTab === 'ceoTrigger' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('ceoTrigger')}
                >
                    <SettingsIcon /> CEO Trigger
                </button>
                 <button
                    className={`settings-tab-item ${activeSubTab === 'taAllocation' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('taAllocation')}
                >
                    <UsersIcon /> TA Allocation
                </button>
                 <button
                    className={`settings-tab-item ${activeSubTab === 'jobRoleMaster' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('jobRoleMaster')}
                >
                    <ListBulletIcon /> Job Role Master
                </button>
            </div>
            <div className="settings-content">
                {activeSubTab === 'jobFamily' && <JobFamilySettingsPage />}
                {activeSubTab === 'ceoTrigger' && <CEOSettingsPage />}
                {activeSubTab === 'taAllocation' && <HiringProcessSettingsPage />}
                {activeSubTab === 'jobRoleMaster' && <JobRoleMasterSettingsPage roles={masterRoles} setRoles={setMasterRoles} jobFamilies={JOB_FAMILIES} />}
            </div>
        </div>
    );
};