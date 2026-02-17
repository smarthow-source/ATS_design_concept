

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface SettingRule {
    jobFamily: string;
    operator: string;
    value: string | number;
}

export interface JobFamilySetting {
    code: string;
    name: string;
    testCriteria: {
        onlineTestScore: number;
        cognitiveTestScore: number;
    };
}

export interface TopUniversity {
    university: string;
    faculty: string;
}

export const JOB_FAMILIES = [
    { code: 'L', name: 'Enterprise Leadership & Strategy' },
    { code: 'E', name: 'Specialist Expertise & Advisory' },
    { code: 'G', name: 'Generalist' },
    { code: 'D', name: 'System, Product & Solution Development' },
    { code: 'A', name: 'Administrative & Operational Support' },
    { code: 'R', name: 'Relationship & Value Management' },
    { code: 'C', name: 'Creative & Content Production' },
    { code: 'O', name: 'Process Execution & Delivery' },
    { code: 'F', name: 'Facility Services' }
];

export const INITIAL_JOB_FAMILY_SETTINGS: JobFamilySetting[] = [
    { code: 'L', name: 'Enterprise Leadership & Strategy', testCriteria: { onlineTestScore: 85, cognitiveTestScore: 85 } },
    { code: 'E', name: 'Specialist Expertise & Advisory', testCriteria: { onlineTestScore: 80, cognitiveTestScore: 80 } },
    { code: 'G', name: 'Generalist', testCriteria: { onlineTestScore: 70, cognitiveTestScore: 75 } },
    { code: 'D', name: 'System, Product & Solution Development', testCriteria: { onlineTestScore: 90, cognitiveTestScore: 80 } },
    { code: 'A', name: 'Administrative & Operational Support', testCriteria: { onlineTestScore: 65, cognitiveTestScore: 70 } },
    { code: 'R', name: 'Relationship & Value Management', testCriteria: { onlineTestScore: 75, cognitiveTestScore: 75 } },
    { code: 'C', name: 'Creative & Content Production', testCriteria: { onlineTestScore: 75, cognitiveTestScore: 80 } },
    { code: 'O', name: 'Process Execution & Delivery', testCriteria: { onlineTestScore: 70, cognitiveTestScore: 70 } },
    { code: 'F', name: 'Facility Services', testCriteria: { onlineTestScore: 60, cognitiveTestScore: 60 } }
];

export const INITIAL_AGE_SETTINGS: SettingRule[] = JOB_FAMILIES.map(jf => ({
    jobFamily: jf.name,
    operator: '>',
    value: jf.code === 'F' ? 45 : 35
}));

export const INITIAL_BAND_SETTINGS: SettingRule[] = JOB_FAMILIES.map(jf => ({
    jobFamily: jf.name,
    operator: '>=',
    value: ['A', 'O', 'F'].includes(jf.code) ? (jf.code === 'F' ? 9 : 10) : 11
}));

export const INITIAL_TOP_UNI_SETTINGS: SettingRule[] = JOB_FAMILIES.map(jf => ({
    jobFamily: jf.name,
    operator: 'is',
    value: 'Yes'
}));

export const INITIAL_TOP_UNIVERSITIES: TopUniversity[] = [
    { university: 'Harvard University', faculty: 'All' },
    { university: 'Stanford University', faculty: 'School of Engineering' },
    { university: 'Stanford University', faculty: 'Graduate School of Business' },
    { university: 'Massachusetts Institute of Technology (MIT)', faculty: 'All' },
    { university: 'University of Cambridge', faculty: 'All' },
    { university: 'University of Oxford', faculty: 'All' },
    { university: 'Princeton University', faculty: 'School of Engineering and Applied Science' },
    { university: 'Yale University', faculty: 'All' },
    { university: 'Columbia University', faculty: 'All' },
    { university: 'California Institute of Technology (Caltech)', faculty: 'All' },
    { university: 'University of Chicago', faculty: 'Booth School of Business' },
];

export const INITIAL_GPA_SETTINGS: SettingRule[] = JOB_FAMILIES.map(jf => ({
    jobFamily: jf.name,
    operator: '>=',
    value: ['L', 'E', 'G'].includes(jf.code) ? 2 : 3
}));

export const INITIAL_ASSESSMENT_SETTINGS: SettingRule[] = JOB_FAMILIES.map(jf => ({
    jobFamily: jf.name,
    operator: 'is',
    value: ''
}));