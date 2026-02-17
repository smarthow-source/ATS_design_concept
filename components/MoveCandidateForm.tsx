
import React, { useState } from 'react';
import { JobOpening } from '../types';

interface MoveCandidateFormProps {
    currentJobId: string;
    jobs: JobOpening[];
    onConfirmMove: (newJobId: string) => void;
}

export const MoveCandidateForm: React.FC<MoveCandidateFormProps> = ({ currentJobId, jobs, onConfirmMove }) => {
    const [selectedJobId, setSelectedJobId] = useState('');

    const availableJobs = jobs.filter(j => j.id !== currentJobId);

    const handleConfirm = () => {
        if (selectedJobId) {
            onConfirmMove(selectedJobId);
        } else {
            alert('Please select a new job opening.');
        }
    };

    return (
        <div className="move-candidate-form">
            <div className="form-field">
                <label>Move to New Job Opening</label>
                <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
                    <option value="" disabled>Select a new role...</option>
                    {availableJobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                </select>
            </div>
            <div className="warning-box">
                <strong>Cognitive Test Rules:</strong>
                <ul>
                    <li>
                        <strong>Same Job Family:</strong> The candidate's cognitive test score will be carried over. If they have already passed this stage, their status will be reset to 'Cognitive Test' for the new hiring manager's review.
                    </li>
                    <li>
                        <strong>Different Job Family:</strong> The candidate must retake the cognitive test. Their previous score will be cleared and their status will be reset to 'Cognitive Test' if they were at or past that stage.
                    </li>
                </ul>
            </div>
            <button className="confirm-btn-pink" onClick={handleConfirm} disabled={!selectedJobId}>
                Confirm Move
            </button>
        </div>
    );
};