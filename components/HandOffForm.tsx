
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ClipboardIcon, CheckIcon, DownloadIcon } from './Icons';

interface HandOffData {
    candidateName: string;
    positionAppliedFor: string;
    expectedBand: string;
    resume: string;
    recruiterTaName: string;
    age: number;
    educationalBackground: string;
    universityGraduated: string;
    jobStabilityScore: string;
    onlineTestScoreEnglish: string;
    onlineTestScoreIq: string;
    onlineTestResult: string;
    cognitiveTestSet: string;
    cognitiveTestScore: string;
    cognitiveTestResult: string;
    ceoInterviewTrigger: string;
    currentStage: string;
    hiringManager: string;
    hmInterviewDate: string;
    management: string;
    managementInterviewDate: string;
}

interface HandOffFormProps {
    data: HandOffData | null;
}

const HandOffItem: React.FC<{label: string, value: string | number}> = ({label, value}) => (
    <>
        <div className="handoff-item-label">{label}:</div>
        <div className="handoff-item-value">{value}</div>
    </>
);

export const HandOffForm: React.FC<HandOffFormProps> = ({ data }) => {
    const [copyText, setCopyText] = useState('Copy to Clipboard');
    const handoffRef = useRef<HTMLDivElement>(null);

    if (!data) return null;

    const generatePlainText = () => {
        return `
Candidate Hand-off Form
=========================

1. Candidate
-------------------------
- Candidate Name: ${data.candidateName}
- Position Applied For: ${data.positionAppliedFor}
- Expected Band: ${data.expectedBand}
- Resume: ${data.resume}
- Recruiter/TA Name: ${data.recruiterTaName}
- Age: ${data.age}
- Educational background: ${data.educationalBackground}
- University graduated: ${data.universityGraduated}
- Job Stability score: ${data.jobStabilityScore}

2. Assessment - Quantitative Results
-------------------------
- Online Test Score - English: ${data.onlineTestScoreEnglish}
- Online Test Score - IQ: ${data.onlineTestScoreIq}
- Online Test Result: ${data.onlineTestResult}
- Cognitive Test Set: ${data.cognitiveTestSet}
- Cognitive Test Score: ${data.cognitiveTestScore}
- Cognitive Test Result: ${data.cognitiveTestResult}

3. CEO Interview Trigger
-------------------------
- Trigger CEO Interview: ${data.ceoInterviewTrigger}

4. Stage Just Completed
-------------------------
- Current Stage: ${data.currentStage}
- Hiring Manager: ${data.hiringManager}
- HM interview date: ${data.hmInterviewDate}
- Management: ${data.management}
- Management interview date: ${data.managementInterviewDate}
        `.trim();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatePlainText());
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy to Clipboard'), 2000);
    };

    const handleDownloadPdf = () => {
        const input = handoffRef.current;
        if (input && data) {
            html2canvas(input, { scale: 2, backgroundColor: null }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = pdfWidth / imgWidth;
                const pdfHeight = imgHeight * ratio;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Hand-off - ${data.candidateName}.pdf`);
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
                <button className="copy-btn" onClick={handleCopy}>
                    {copyText === 'Copied!' ? <CheckIcon /> : <ClipboardIcon />}
                    {copyText}
                </button>
            </div>

            <div className="handoff-container" ref={handoffRef} style={{padding: '1rem', background: 'white'}}>
                <div className="handoff-section">
                    <h3>1. Candidate</h3>
                    <div className="handoff-grid">
                        <HandOffItem label="Candidate Name" value={data.candidateName} />
                        <HandOffItem label="Position Applied For" value={data.positionAppliedFor} />
                        <HandOffItem label="Expected Band" value={data.expectedBand} />
                        <HandOffItem label="Resume" value={data.resume} />
                        <HandOffItem label="Recruiter/TA Name" value={data.recruiterTaName} />
                        <HandOffItem label="Age" value={data.age} />
                        <HandOffItem label="Educational background" value={data.educationalBackground} />
                        <HandOffItem label="University graduated" value={data.universityGraduated} />
                        <HandOffItem label="Job Stability score" value={data.jobStabilityScore} />
                    </div>
                </div>

                <div className="handoff-section">
                    <h3>2. Assessment - Quantitative Results</h3>
                    <div className="handoff-grid">
                        <HandOffItem label="Online Test Score - English" value={data.onlineTestScoreEnglish} />
                        <HandOffItem label="Online Test Score - IQ" value={data.onlineTestScoreIq} />
                        <HandOffItem label="Online Test Result" value={data.onlineTestResult} />
                        <HandOffItem label="Cognitive Test Set" value={data.cognitiveTestSet} />
                        <HandOffItem label="Cognitive Test Score" value={data.cognitiveTestScore} />
                        <HandOffItem label="Cognitive Test Result" value={data.cognitiveTestResult} />
                    </div>
                </div>
                
                <div className="handoff-section">
                    <h3>3. CEO Interview Trigger</h3>
                    <div className="handoff-grid">
                        <HandOffItem label="Trigger CEO Interview" value={data.ceoInterviewTrigger} />
                    </div>
                </div>

                <div className="handoff-section">
                    <h3>4. Stage Just Completed</h3>
                    <div className="handoff-grid">
                        <HandOffItem label="Current Stage" value={data.currentStage} />
                        <HandOffItem label="Hiring Manager" value={data.hiringManager || 'N/A'} />
                        <HandOffItem label="HM interview date" value={data.hmInterviewDate} />
                        <HandOffItem label="Management" value={data.management || 'N/A'} />
                        <HandOffItem label="Management interview date" value={data.managementInterviewDate} />
                    </div>
                </div>
            </div>
        </div>
    );
};