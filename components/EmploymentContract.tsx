
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Applicant, JobOpening } from '../types';
import { DownloadIcon } from './Icons';

interface EmploymentContractProps {
    applicant: Applicant;
    job: JobOpening;
    offerData: {
        onboardingDate: string;
        salary: string;
    };
    onSalaryChange: (newSalary: string) => void;
}

export const EmploymentContract: React.FC<EmploymentContractProps> = ({ applicant, job, offerData, onSalaryChange }) => {
    const contractRef = useRef<HTMLDivElement>(null);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleDownloadPdf = () => {
        const input = contractRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = pdfWidth / canvasWidth;
                const pdfHeight = canvasHeight * ratio;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Employment Contract - ${applicant.name}.pdf`);
            });
        }
    };

    return (
        <div>
            <div className="handoff-actions">
                 <button className="download-btn" onClick={handleDownloadPdf}>
                    <DownloadIcon />
                    Download PDF
                </button>
            </div>
            <div style={{ padding: '0 1rem 1.5rem 1rem', background: '#fff', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                <div className="form-field">
                    <label>Offered Salary (Annual Gross USD)</label>
                    <input
                        type="number"
                        placeholder="Enter offered salary..."
                        value={offerData.salary}
                        onChange={(e) => onSalaryChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="contract-container" ref={contractRef}>
                <div className="contract-header">
                    <h1>Employment Contract</h1>
                </div>
                <div className="contract-body">
                    <p>This Employment Contract ("Contract") is entered into as of {today} ("Effective Date"), by and between:</p>
                    <p><strong>Employer:</strong> Nexus ATS Corp., a company organized and existing under the laws of Delaware, with its principal office located at 123 Innovation Drive, Tech City, USA ("Company"), and</p>
                    <p><strong>Employee:</strong> {applicant.name}, residing at {applicant.location} ("Employee").</p>

                    <div className="contract-section">
                        <h2>1. Position</h2>
                        <p>The Company agrees to employ the Employee in the capacity of <strong>{job.title}</strong> within the {job.department} department. The Employee's duties will include those typically associated with such a position and any other duties as may be assigned by the Company from time to time.</p>
                    </div>

                    <div className="contract-section">
                        <h2>2. Start Date and Term</h2>
                        <p>The Employee's employment will commence on <strong>{offerData.onboardingDate ? new Date(offerData.onboardingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[START DATE]'}</strong>. This Contract is for an indefinite term, subject to termination as provided herein.</p>
                    </div>
                    
                    <div className="contract-section">
                        <h2>3. Compensation</h2>
                        <p>The Company will pay the Employee an annual gross salary of <strong>${Number(offerData.salary || 0).toLocaleString()} USD</strong>, payable in monthly installments in accordance with the Company's standard payroll practices.</p>
                    </div>

                    <div className="contract-section">
                        <h2>4. Confidentiality</h2>
                        <p>The Employee agrees to maintain the confidentiality of all proprietary information of the Company, both during and after the term of employment.</p>
                    </div>

                    <div className="contract-section">
                        <h2>5. Governing Law</h2>
                        <p>This Contract shall be governed by and construed in accordance with the laws of the State of Delaware.</p>
                    </div>
                </div>
                <div className="contract-footer">
                     <div className="signature-block">
                        <p>Employer: Nexus ATS Corp.</p>
                        <p>By: _________________________</p>
                        <p>Name: {job.hiringManager}</p>
                        <p>Title: Hiring Manager</p>
                    </div>
                    <div className="signature-block">
                        <p>Employee</p>
                        <p>By: _________________________</p>
                        <p>Name: {applicant.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
