

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Applicant, JobOpening } from './types';

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

export const INITIAL_JOBS: JobOpening[] = [
    { id: 'job-1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', hiringManager: 'David Chen', management: 'Sarah Zhang', openDate: '2024-03-01', priority: 'High', assignedTA: 'Sarah Jenks', jobFamilyCode: 'D' },
    { id: 'job-2', title: 'Product Designer', department: 'Design', location: 'New York', hiringManager: 'Elena Rodriguez', management: 'Elena Rodriguez', openDate: '2024-03-10', priority: 'Medium', assignedTA: 'Sarah Jenks', jobFamilyCode: 'C' },
    { id: 'job-3', title: 'Backend Developer (Node.js)', department: 'Engineering', location: 'Bangkok', hiringManager: 'Somchai Prasert', management: 'Wichai R.', openDate: '2024-03-12', priority: 'High', assignedTA: 'Mike Ross', jobFamilyCode: 'D' },
    { id: 'job-4', title: 'Marketing Specialist', department: 'Growth', location: 'Singapore', hiringManager: 'Jane Doe', management: 'Robert Ng', openDate: '2024-03-15', priority: 'Low', assignedTA: 'Jessica Pearson', jobFamilyCode: 'R' },
    { id: 'job-5', title: 'QA Automation Engineer', department: 'Engineering', location: 'Remote', hiringManager: 'David Chen', management: 'Sarah Zhang', openDate: '2024-03-18', priority: 'Medium', assignedTA: 'Mike Ross', jobFamilyCode: 'D' }
];

export const INITIAL_APPLICANTS: Applicant[] = [
    {
        id: '1', jobId: 'job-1', name: 'Pam Beesly', email: 'pam.art@dpm.com', role: 'Senior Frontend Engineer', status: 'CEO-interview',
        lastActionDate: NOW - (1 * DAY), applicationTimestamp: NOW - (20 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'David Chen', 
        previousApplications: [
            { role: 'Junior UI/UX Designer', status: 'Disqualified' }
        ],
        gender: 'Female', age: 29, phoneNumber: '0623334455', lineId: 'pam_art', location: 'Scranton', education: 'Bachelor Degree', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l1-5', date: '2025-01-20', time: '10:30', result: 'Pass', stage: 'Management-interview', taName: 'Sarah Jenks', reason: '{"result":"Pass","interviewer":"Sarah Zhang","date":"2025-01-20","time":"10:00","ceoTrigger":true,"note":"CEO Triggered due to high-impact role potential.","manualNote":"CEO Triggered due to high-impact role potential."}' },
            { id: 'l1-4', date: '2025-01-18', time: '11:45', result: 'Pass', stage: 'HM-interview', taName: 'Sarah Jenks', reason: '{"result":"Pass","interviewer":"David Chen","date":"2025-01-18","time":"11:00","note":"Technical skills are superb.","manualNote":"Technical skills are superb."}' },
            { id: 'l1-3', date: '2025-01-15', time: '16:00', result: 'Pass', stage: 'Cognitive-test', taName: 'Sarah Jenks', reason: '{"testScore":"92","testResult":"Pass","note":"Score: 92/100","manualNote":"Score: 92/100"}' },
            { id: 'l1-2', date: '2025-01-12', time: '09:05', result: 'Pass', stage: 'Online-test', taName: 'Sarah Jenks', reason: '{"testResult":"Pass","iqScore":"128","englishScore":"95","continueProcess":"Yes","interviewDate":"2025-01-18","interviewTime":"11:00","manualNote":"Passed with high marks."}' },
            { id: 'l1-1', date: '2025-01-10', time: '14:20', result: 'Pass', stage: 'Prescreen', taName: 'Sarah Jenks', reason: '{"contactResult":"Contactable","prescreenResult":"Pass","failReason":"","rejectReason":"","currentSalary":"80000","expectedSalary":"95000","note":"Excellent communication skills, seems very motivated.","date":"2025-01-10","currentPosition":"UI Designer at Dunder Mifflin","reasonForChange":"Seeking growth","gpa":"3.8","university":"Pratt Institute","faculty":"School of Art","locationConvenience":"Convenient","noticePeriod":"2 weeks","onlineTestLink":"https://example.com/test-pam","manualNote":"Excellent communication skills, seems very motivated."}' }
        ], interviewFeedback: []
    },
    {
        id: '2', jobId: 'job-1', name: 'Jim Halpert', email: 'jim.h@dpm.com', role: 'Senior Frontend Engineer', status: 'Management-interview',
        lastActionDate: NOW - (2 * DAY), applicationTimestamp: NOW - (15 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'David Chen', 
        gender: 'Male', age: 30, phoneNumber: '0812223344', lineId: 'jim_h', location: 'Scranton', education: 'Bachelor Degree', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l2-4', date: '2025-01-19', time: '10:00', result: 'Pass', stage: 'HM-interview', taName: 'Sarah Jenks', reason: '{"result":"Pass","interviewer":"David Chen","date":"2025-01-19","time":"10:00","note":"Great communication and leadership potential.","manualNote":"Great communication and leadership potential."}' },
            { id: 'l2-3', date: '2025-01-16', time: '17:30', result: 'Pass', stage: 'Cognitive-test', taName: 'Sarah Jenks', reason: '{"testScore":"85","testResult":"Pass","note":"Score: 85/100","manualNote":"Score: 85/100"}' },
            { id: 'l2-2', date: '2025-01-14', time: '11:00', result: 'Pass', stage: 'Online-test', taName: 'Sarah Jenks', reason: '{"testResult":"Pass","iqScore":"120","englishScore":"90","continueProcess":"Yes","manualNote":"Solid test results."}' },
            { id: 'l2-1', date: '2025-01-12', time: '15:00', result: 'Pass', stage: 'Prescreen', taName: 'Sarah Jenks', reason: '{"contactResult":"Contactable","prescreenResult":"Pass","date":"2025-01-12","manualNote":"Very personable and seems like a great culture fit."}' }
        ], interviewFeedback: []
    },
    {
        id: '3', jobId: 'job-5', name: 'Dwight Schrute', email: 'dwight.s@beets.com', role: 'QA Automation Engineer', status: 'Offering',
        lastActionDate: NOW - (5 * 60 * 60 * 1000), applicationTimestamp: NOW - (30 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'David Chen', 
        gender: 'Male', age: 35, phoneNumber: '0887776655', lineId: 'beet_king', location: 'Beet Farm', education: 'Bachelor Degree', militaryStatus: 'Completed', drivingAbility: 'Tractor, Car',
        testScores: [], contactLogs: [
            { id: 'l3-5', date: '2025-01-21', result: 'Pass', stage: 'CEO-interview', taName: 'Sarah Jenks', reason: 'Approved by CEO.' },
            { id: 'l3-4', date: '2025-01-19', result: 'Pass', stage: 'Management-interview', taName: 'Sarah Jenks', reason: 'Discipline and focus are unmatched.' }
        ], interviewFeedback: []
    },
    {
        id: '4', jobId: 'job-2', name: 'Angela Martin', email: 'angela.m@dpm.com', role: 'Product Designer', status: 'Disqualified',
        lastActionDate: NOW - (4 * DAY), applicationTimestamp: NOW - (10 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'Elena Rodriguez', 
        gender: 'Female', age: 32, phoneNumber: '0912223333', lineId: 'cat_mom', location: 'Scranton', education: 'Master Degree', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l4-1', date: '2025-01-18', result: 'Fail', stage: 'HM-interview', taName: 'Sarah Jenks', reason: 'Did not meet technical requirements for design system knowledge.' }
        ], interviewFeedback: []
    },
    {
        id: '5', jobId: 'job-3', name: 'Oscar Martinez', email: 'oscar.m@dpm.com', role: 'Backend Developer (Node.js)', status: 'Cognitive-test',
        lastActionDate: NOW - (1 * DAY), applicationTimestamp: NOW - (5 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'Somchai Prasert', 
        gender: 'Male', age: 34, phoneNumber: '0851112222', lineId: 'actually_oscar', location: 'Bangkok', education: 'Master Degree', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l5-1', date: '2025-01-20', result: 'Pass', stage: 'Online-test', taName: 'Sarah Jenks', reason: 'Perfect scores on technical modules.' }
        ], interviewFeedback: []
    },
    {
        id: '6', jobId: 'job-4', name: 'Kevin Malone', email: 'kevin.m@chili.com', role: 'Marketing Specialist', status: 'Prescreen',
        lastActionDate: NOW - (2 * 60 * 60 * 1000), applicationTimestamp: NOW - (1 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'Jane Doe', 
        gender: 'Male', age: 40, phoneNumber: '0621110000', lineId: 'big_kev', location: 'Scranton', education: 'High School', militaryStatus: 'Completed', drivingAbility: 'Car',
        testScores: [], contactLogs: [], interviewFeedback: []
    },
    {
        id: '7', jobId: 'job-1', name: 'Stanley Hudson', email: 'stanley.h@crossword.com', role: 'Senior Frontend Engineer', status: 'Online-test',
        lastActionDate: NOW - (3 * DAY), applicationTimestamp: NOW - (8 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'David Chen', 
        gender: 'Male', age: 55, phoneNumber: '0895554433', lineId: 'pretzel_day', location: 'Florida', education: 'Bachelor Degree', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l7-1', date: '2025-01-15', result: 'Pass', stage: 'Prescreen', taName: 'Sarah Jenks', reason: '{"contactResult":"Contactable","prescreenResult":"Pass","date":"2025-01-15","currentSalary":"95000","expectedSalary":"110000","onlineTestDueDate":"2025-01-20","manualNote":"Wants to work remotely exclusively."}' }
        ], interviewFeedback: []
    },
    {
        id: '8', jobId: 'job-2', name: 'Kelly Kapoor', email: 'kelly.k@fashion.com', role: 'Product Designer', status: 'HM-interview',
        lastActionDate: NOW - (12 * 60 * 60 * 1000), applicationTimestamp: NOW - (12 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'Elena Rodriguez', 
        gender: 'Female', age: 25, phoneNumber: '0928881111', lineId: 'kelly_queen', location: 'New York', education: 'Bachelor Degree', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l8-3', date: '2025-01-20', result: 'Pass', stage: 'Cognitive-test', taName: 'Sarah Jenks', reason: 'Score: 78/100. High creativity markers.' },
            { id: 'l8-2', date: '2025-01-18', result: 'Pass', stage: 'Online-test', taName: 'Sarah Jenks', reason: 'Portfolio is very strong.' },
            { id: 'l8-1', date: '2025-01-15', result: 'Pass', stage: 'Prescreen', taName: 'Sarah Jenks', reason: '{"contactResult":"Contactable","prescreenResult":"Pass","date":"2025-01-15","manualNote":"Enthusiastic and eager."}' }
        ], interviewFeedback: []
    },
    {
        id: '9', jobId: 'job-1', name: 'Ryan Howard', email: 'ryan.h@wuphf.com', role: 'Senior Frontend Engineer', status: 'Sign-contract',
        lastActionDate: NOW - (6 * DAY), applicationTimestamp: NOW - (45 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'David Chen', 
        gender: 'Male', age: 24, phoneNumber: '0814445555', lineId: 'wuphf_ceo', location: 'Silicon Valley', education: 'MBA', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l9-1', date: '2025-01-10', result: 'Pass', stage: 'Offering', taName: 'Sarah Jenks', reason: 'Offer accepted.' }
        ], interviewFeedback: []
    },
    {
        id: '10', jobId: 'job-3', name: 'Andy Bernard', email: 'andy.b@cornell.com', role: 'Backend Developer (Node.js)', status: 'Application',
        lastActionDate: NOW - (1 * 12 * 60 * 60 * 1000), applicationTimestamp: NOW - (2 * DAY), assignedTA: 'Mike Ross', hiringManager: 'Somchai Prasert', 
        gender: 'Male', age: 31, phoneNumber: '0881234567', lineId: 'nard_dog', location: 'Scranton', education: 'Bachelor Degree', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [], interviewFeedback: []
    },
    {
        id: '11', jobId: 'job-1', name: 'Erin Hannon', email: 'erin.h@dpm.com', role: 'Senior Frontend Engineer', status: 'Onboarding',
        lastActionDate: NOW - (10 * DAY), applicationTimestamp: NOW - (60 * DAY), assignedTA: 'Sarah Jenks', hiringManager: 'David Chen', 
        gender: 'Female', age: 26, phoneNumber: '0918765432', lineId: 'erin_h', location: 'Scranton', education: 'High School', militaryStatus: 'N/A', drivingAbility: 'Car',
        testScores: [], contactLogs: [
            { id: 'l11-1', date: '2025-01-15', result: 'Signed', stage: 'Sign-contract', taName: 'Sarah Jenks', reason: 'Contract signed and returned.' }
        ], interviewFeedback: []
    }
];

export const JOURNEY_STAGES: { id: Applicant['status']; label: string }[] = [
    { id: 'Application', label: 'Application' },
    { id: 'Shortlisted', label: 'Shortlisted' },
    { id: 'Disqualified', label: 'Disqualified' },
    { id: 'Prescreen', label: 'Pre-screen' },
    { id: 'Online-test', label: 'Online Test' },
    { id: 'Cognitive-test', label: 'Cognitive Test' },
    { id: 'HM-interview', label: 'HM Interview' },
    { id: 'Management-interview', label: 'Management Interview' },
    { id: 'CEO-interview', label: 'CEO Interview' },
    { id: 'Offering', label: 'Offer' },
    { id: 'Sign-contract', label: 'Sign Contract' },
    { id: 'Onboarding', label: 'Onboarding' }
];

export const POST_SHORTLIST_STAGES: Applicant['status'][] = [
  'Shortlisted', 
  'Prescreen', 
  'Online-test', 
  'Cognitive-test', 
  'HM-interview', 
  'Management-interview', 
  'CEO-interview', 
  'Offering', 
  'Sign-contract', 
  'Onboarding'
];

export const POST_PRESCREEN_STAGES: Applicant['status'][] = [
  'Online-test', 
  'Cognitive-test', 
  'HM-interview', 
  'Management-interview', 
  'CEO-interview', 
  'Offering', 
  'Sign-contract', 
  'Onboarding'
];