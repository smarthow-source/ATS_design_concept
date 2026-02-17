

import React, { useState } from 'react';
import { INITIAL_JOBS } from '../constants';
import { JobOpening } from '../types';

const AVAILABLE_TAS = ['Sarah Jenks', 'Mike Ross', 'Jessica Pearson', 'Louis Litt'];

export const HiringProcessSettingsPage: React.FC = () => {
    const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);

    const handleTaChange = (jobId: string, newTa: string) => {
        setJobs(prevJobs => 
            prevJobs.map(job => 
                job.id === jobId ? { ...job, assignedTA: newTa } : job
            )
        );
    };

    return (
        <div className="settings-grid">
            <h2>TA Role Allocation</h2>
            <p className="settings-description">Assign a Talent Acquisition partner to each job opening.</p>
            <div className="table-container">
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Department</th>
                            <th>Hiring Manager</th>
                            <th>Assigned TA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id}>
                                <td>{job.title}</td>
                                <td>{job.department}</td>
                                <td>{job.hiringManager}</td>
                                <td>
                                    <select 
                                        value={job.assignedTA} 
                                        onChange={(e) => handleTaChange(job.id, e.target.value)}
                                    >
                                        {AVAILABLE_TAS.map(ta => (
                                            <option key={ta} value={ta}>{ta}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};