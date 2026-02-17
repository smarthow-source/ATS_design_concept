

import React, { useState } from 'react';
import { 
    INITIAL_AGE_SETTINGS,
    INITIAL_BAND_SETTINGS,
    INITIAL_TOP_UNI_SETTINGS,
    INITIAL_GPA_SETTINGS,
    INITIAL_ASSESSMENT_SETTINGS,
    INITIAL_TOP_UNIVERSITIES,
    SettingRule,
    TopUniversity
} from '../ceoTriggerSettings';
import { TopUniversitySettings } from './TopUniversitySettings';

interface SettingsGridProps {
    title: string;
    settings: SettingRule[];
    onUpdate: (index: number, field: 'operator' | 'value', value: string) => void;
    valueInputType?: 'text' | 'number' | 'select-yes-no';
}

const SettingsGrid: React.FC<SettingsGridProps> = ({ title, settings, onUpdate, valueInputType = 'text' }) => {
    return (
        <div className="settings-grid">
            <h2>{title}</h2>
            <div className="table-container">
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th>Job Family</th>
                            <th>Operator</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settings.map((rule, index) => (
                            <tr key={rule.jobFamily}>
                                <td>{rule.jobFamily}</td>
                                <td>
                                    <select 
                                        value={rule.operator}
                                        onChange={(e) => onUpdate(index, 'operator', e.target.value)}
                                    >
                                        <option value=">">&gt;</option>
                                        <option value=">=">&gt;=</option>
                                        <option value="<">&lt;</option>
                                        <option value="<=">&lt;=</option>
                                        <option value="is">is</option>
                                        <option value="is not">is not</option>
                                    </select>
                                </td>
                                <td>
                                    {valueInputType === 'select-yes-no' ? (
                                        <select
                                            value={rule.value.toString()}
                                            onChange={(e) => onUpdate(index, 'value', e.target.value)}
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    ) : (
                                        <input 
                                            type={typeof rule.value === 'number' && valueInputType !== 'text' ? 'number' : 'text'}
                                            value={rule.value}
                                            onChange={(e) => onUpdate(index, 'value', e.target.value)}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export const CEOSettingsPage: React.FC = () => {
    const [ageSettings, setAgeSettings] = useState(INITIAL_AGE_SETTINGS);
    const [bandSettings, setBandSettings] = useState(INITIAL_BAND_SETTINGS);
    const [topUniSettings, setTopUniSettings] = useState(INITIAL_TOP_UNI_SETTINGS);
    const [gpaSettings, setGpaSettings] = useState(INITIAL_GPA_SETTINGS);
    const [assessmentSettings, setAssessmentSettings] = useState(INITIAL_ASSESSMENT_SETTINGS);
    const [topUniversities, setTopUniversities] = useState<TopUniversity[]>(INITIAL_TOP_UNIVERSITIES);
    const [activeSubTab, setActiveSubTab] = useState<'rules' | 'universities'>('rules');


    const handleUpdate = (setter: React.Dispatch<React.SetStateAction<SettingRule[]>>) => 
        (index: number, field: 'operator' | 'value', value: string) => {
        setter(prev => {
            const newSettings = [...prev];
            const originalValue = newSettings[index].value;
            newSettings[index] = { 
                ...newSettings[index], 
                [field]: typeof originalValue === 'number' && field === 'value' ? Number(value) : value 
            };
            return newSettings;
        });
    };

    return (
        <>
            <div className="settings-sub-nav">
                <button 
                    className={`settings-sub-nav-btn ${activeSubTab === 'rules' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('rules')}
                >
                    Trigger Rules
                </button>
                <button
                    className={`settings-sub-nav-btn ${activeSubTab === 'universities' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('universities')}
                >
                    Top University List
                </button>
            </div>

            {activeSubTab === 'rules' && (
                <div className="settings-content-grid">
                    <SettingsGrid title="Age Trigger" settings={ageSettings} onUpdate={handleUpdate(setAgeSettings)} />
                    <SettingsGrid title="Band Trigger" settings={bandSettings} onUpdate={handleUpdate(setBandSettings)} />
                    <SettingsGrid title="Top University Trigger" settings={topUniSettings} onUpdate={handleUpdate(setTopUniSettings)} valueInputType="select-yes-no" />
                    <SettingsGrid title="GPA Trigger" settings={gpaSettings} onUpdate={handleUpdate(setGpaSettings)} />
                    <SettingsGrid title="Assessment Trigger" settings={assessmentSettings} onUpdate={handleUpdate(setAssessmentSettings)} />
                </div>
            )}
            
            {activeSubTab === 'universities' && (
                <TopUniversitySettings universities={topUniversities} setUniversities={setTopUniversities} />
            )}
        </>
    );
};