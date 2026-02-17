

import React, { useState } from 'react';
import { JobFamilySetting } from '../ceoTriggerSettings';
import { TrashIcon } from './Icons';

interface JobFamilySettingsProps {
    settings: JobFamilySetting[];
    onUpdate: (index: number, updatedFamily: JobFamilySetting) => void;
    onRemoveFamily: (familyIndex: number) => void;
}

export const JobFamilySettings: React.FC<JobFamilySettingsProps> = ({ settings, onUpdate, onRemoveFamily }) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingFamily, setEditingFamily] = useState<JobFamilySetting | null>(null);

    const handleStartEditing = (family: JobFamilySetting, index: number) => {
        setEditingIndex(index);
        setEditingFamily({ ...family });
    };

    const handleCancelEditing = () => {
        setEditingIndex(null);
        setEditingFamily(null);
    };

    const handleSaveEdit = () => {
        if (editingFamily && editingIndex !== null) {
            onUpdate(editingIndex, editingFamily);
            handleCancelEditing();
        }
    };

    const handleEditingChange = (field: keyof JobFamilySetting | 'onlineTestScore' | 'cognitiveTestScore', value: string) => {
        if (!editingFamily) return;

        if (field === 'onlineTestScore' || field === 'cognitiveTestScore') {
            setEditingFamily(prev => ({
                ...prev!,
                testCriteria: {
                    ...prev!.testCriteria,
                    [field]: Number(value)
                }
            }));
        } else if (field === 'name') {
             setEditingFamily(prev => ({
                ...prev!,
                [field]: value
            }));
        }
    };


    return (
        <div className="table-container">
            <table className="settings-table job-family-table">
                <thead>
                    <tr>
                        <th>Family Name</th>
                        <th>Online Test Score</th>
                        <th>Cognitive Test Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {settings.map((family, index) => (
                        <tr key={family.code}>
                            {editingIndex === index && editingFamily ? (
                                <>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={editingFamily.name}
                                            onChange={(e) => handleEditingChange('name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number"
                                            value={editingFamily.testCriteria.onlineTestScore}
                                            onChange={(e) => handleEditingChange('onlineTestScore', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number"
                                            value={editingFamily.testCriteria.cognitiveTestScore}
                                            onChange={(e) => handleEditingChange('cognitiveTestScore', e.target.value)}
                                        />
                                    </td>
                                    <td className="actions-cell">
                                        <button className="action-btn save" onClick={handleSaveEdit}>Save</button>
                                        <button className="action-btn cancel" onClick={handleCancelEditing}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{family.name}</td>
                                    <td>{family.testCriteria.onlineTestScore}</td>
                                    <td>{family.testCriteria.cognitiveTestScore}</td>
                                    <td className="actions-cell">
                                        <button className="action-btn edit" onClick={() => handleStartEditing(family, index)}>Edit</button>
                                        <button className="action-btn remove" onClick={() => onRemoveFamily(index)}>
                                            <TrashIcon /> Remove
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};