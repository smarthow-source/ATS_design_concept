
import React, { useState, useEffect } from 'react';
import { JobOpening } from '../types';

interface AddCandidateFormProps {
    jobs: JobOpening[];
    onSave: (data: any) => void;
    onClose: () => void;
    initialJobId?: string | null;
}

const initialFormState = {
    name: '',
    email: '',
    phoneNumber: '',
    jobId: '',
    location: '',
    education: '',
    age: '',
    gender: 'Other',
    role: '',
};

export const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ jobs, onSave, onClose, initialJobId }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialJobId) {
            const job = jobs.find(j => j.id === initialJobId);
            setFormData(prev => ({
                ...prev,
                jobId: initialJobId,
                role: job?.title || '',
            }));
        }
    }, [initialJobId, jobs]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'jobId') {
            const selectedJob = jobs.find(job => job.id === value);
            setFormData(prev => ({ ...prev, role: selectedJob?.title || '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Candidate name is required.';
        if (!formData.jobId) newErrors.jobId = 'Please select a job opening.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...formData,
                age: Number(formData.age) || 0, // Convert age to number
            });
        }
    };

    return (
        <form className="add-candidate-form" onSubmit={handleSubmit}>
            <div className="add-candidate-form-body">
                <div className="form-field">
                    <label>Position Applied For*</label>
                    <select name="jobId" value={formData.jobId} onChange={handleChange} required>
                        <option value="" disabled>Select a position...</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                    </select>
                    {errors.jobId && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{errors.jobId}</p>}
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label>Candidate Name*</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., John Doe" required />
                        {errors.name && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{errors.name}</p>}
                    </div>
                    <div className="form-field">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g., john.doe@example.com" />
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label>Phone Number</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="e.g., 0812345678" />
                    </div>
                    <div className="form-field">
                        <label>Current Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Bangkok, Thailand" />
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label>Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 28" />
                    </div>
                    <div className="form-field">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-field">
                    <label>Educational Background</label>
                    <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="e.g., Bachelor of Science in Computer Science" />
                </div>
                
                <div className="form-field">
                    <label>Upload Resume</label>
                    <input type="file" />
                </div>
            </div>

            <div className="add-candidate-form-footer">
                <button type="submit" className="confirm-btn-pink">Save Candidate</button>
            </div>
        </form>
    );
};
