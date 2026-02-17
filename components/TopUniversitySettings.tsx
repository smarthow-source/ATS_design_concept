

import React, { useState } from 'react';
import { TrashIcon } from './Icons';
import { TopUniversity } from '../ceoTriggerSettings';

interface TopUniversitySettingsProps {
    universities: TopUniversity[];
    setUniversities: React.Dispatch<React.SetStateAction<TopUniversity[]>>;
}

const initialNewEntry = { university: '', faculty: '' };

export const TopUniversitySettings: React.FC<TopUniversitySettingsProps> = ({ universities, setUniversities }) => {
    const [newEntry, setNewEntry] = useState(initialNewEntry);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingEntry, setEditingEntry] = useState<TopUniversity | null>(null);

    const handleNewEntryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUniversity = () => {
        if (newEntry.university.trim() && newEntry.faculty.trim()) {
            const isDuplicate = universities.some(u => 
                u.university.toLowerCase() === newEntry.university.trim().toLowerCase() && 
                u.faculty.toLowerCase() === newEntry.faculty.trim().toLowerCase()
            );
            if (!isDuplicate) {
                setUniversities(prev => 
                    [...prev, { university: newEntry.university.trim(), faculty: newEntry.faculty.trim() }]
                    .sort((a, b) => a.university.localeCompare(b.university) || a.faculty.localeCompare(b.faculty))
                );
                setNewEntry(initialNewEntry);
            } else {
                alert('This university and faculty combination already exists.');
            }
        } else {
            alert('Both university and faculty fields are required.');
        }
    };

    const handleRemoveUniversity = (indexToRemove: number) => {
        setUniversities(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleStartEditing = (uni: TopUniversity, index: number) => {
        setEditingIndex(index);
        setEditingEntry({ ...uni });
    };
    
    const handleEditingChange = (field: 'university' | 'faculty', value: string) => {
        if(editingEntry) {
            setEditingEntry(prev => ({ ...prev!, [field]: value }));
        }
    };

    const handleCancelEditing = () => {
        setEditingIndex(null);
        setEditingEntry(null);
    };

    const handleSaveEdit = () => {
        if (!editingEntry || editingIndex === null) return;

        if (editingEntry.university.trim() && editingEntry.faculty.trim()) {
            const isDuplicate = universities.some((u, i) => 
                i !== editingIndex &&
                u.university.toLowerCase() === editingEntry.university.trim().toLowerCase() && 
                u.faculty.toLowerCase() === editingEntry.faculty.trim().toLowerCase()
            );

            if (!isDuplicate) {
                const updatedUnis = [...universities];
                updatedUnis[editingIndex] = { university: editingEntry.university.trim(), faculty: editingEntry.faculty.trim() };
                setUniversities(updatedUnis.sort((a, b) => a.university.localeCompare(b.university) || a.faculty.localeCompare(b.faculty)));
                handleCancelEditing();
            } else {
                 alert('This university and faculty combination already exists.');
            }
        } else {
            alert('Both university and faculty fields are required.');
        }
    };

    return (
        <div className="settings-grid">
            <h2>Top University Master List</h2>
            <p className="settings-description">Manage the master list of universities and faculties considered "top tier" for triggering CEO review.</p>
            <div className="job-role-master-container">
                <div className="role-input-grid" style={{ gridTemplateColumns: '2fr 2fr auto', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <input
                        type="text"
                        name="university"
                        value={newEntry.university}
                        onChange={handleNewEntryChange}
                        placeholder="Enter a university name..."
                    />
                     <input
                        type="text"
                        name="faculty"
                        value={newEntry.faculty}
                        onChange={handleNewEntryChange}
                        placeholder="Enter a faculty..."
                    />
                    <button onClick={handleAddUniversity}>+ Add</button>
                </div>
                <div className="table-container">
                    <table className="settings-table">
                        <thead>
                            <tr>
                                <th>University Name</th>
                                <th>Faculty</th>
                                <th style={{textAlign: 'right'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {universities.map((uni, index) => (
                                <tr key={`${uni.university}-${uni.faculty}-${index}`}>
                                    {editingIndex === index && editingEntry ? (
                                        <>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={editingEntry.university} 
                                                    onChange={(e) => handleEditingChange('university', e.target.value)} 
                                                    autoFocus
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={editingEntry.faculty} 
                                                    onChange={(e) => handleEditingChange('faculty', e.target.value)}
                                                />
                                            </td>
                                            <td className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                                                <button className="action-btn save" onClick={handleSaveEdit}>Save</button>
                                                <button className="action-btn cancel" onClick={handleCancelEditing}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{uni.university}</td>
                                            <td>{uni.faculty}</td>
                                            <td className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                                                <button className="action-btn edit" onClick={() => handleStartEditing(uni, index)}>Edit</button>
                                                <button className="action-btn remove" onClick={() => handleRemoveUniversity(index)}>
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
            </div>
        </div>
    );
};