

import React, { useState } from 'react';
import { INITIAL_JOB_FAMILY_SETTINGS, JobFamilySetting } from '../ceoTriggerSettings';
import { JobFamilySettings } from './JobFamilySettings';

export const JobFamilySettingsPage: React.FC = () => {
    const [jobFamilySettings, setJobFamilySettings] = useState(INITIAL_JOB_FAMILY_SETTINGS);

    const handleAddFamily = () => {
        const newFamily: JobFamilySetting = {
            code: `new-${Date.now()}`,
            name: 'New Job Family',
            testCriteria: { onlineTestScore: 70, cognitiveTestScore: 70 }
        };
        setJobFamilySettings(prev => [...prev, newFamily]);
    };

    const handleRemoveFamily = (indexToRemove: number) => {
        setJobFamilySettings(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleJobFamilyUpdate = (index: number, updatedFamily: JobFamilySetting) => {
        setJobFamilySettings(prev => 
            prev.map((family, i) => (i === index ? updatedFamily : family))
        );
    };

    return (
        <div className="settings-grid job-family-grid">
            <div className="settings-grid-header">
                    <h2>Job Family Settings</h2>
                    <button className="add-family-btn" onClick={handleAddFamily}>+ Add New Family</button>
            </div>
            <JobFamilySettings 
                settings={jobFamilySettings} 
                onUpdate={handleJobFamilyUpdate}
                onRemoveFamily={handleRemoveFamily}
            />
        </div>
    );
};