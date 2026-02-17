

import React, { useState } from 'react';
import { TrashIcon } from './Icons';
import { JobRole } from '../types';
import { generateId } from '../utils';

interface JobRoleMasterSettingsPageProps {
    roles: JobRole[];
    setRoles: React.Dispatch<React.SetStateAction<JobRole[]>>;
    jobFamilies: { code: string; name: string; }[];
}

const initialNewRoleData = { name: '', division: '', jobFamilyCode: '', hmInterviewer: '', managementInterviewer: '' };

export const JobRoleMasterSettingsPage: React.FC<JobRoleMasterSettingsPageProps> = ({ roles, setRoles, jobFamilies }) => {
    const [newRoleData, setNewRoleData] = useState(initialNewRoleData);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingRole, setEditingRole] = useState<JobRole | null>(null);

    const handleNewRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRoleData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRole = () => {
        if (newRoleData.name.trim() && newRoleData.division.trim() && newRoleData.jobFamilyCode && newRoleData.hmInterviewer.trim() && newRoleData.managementInterviewer.trim()) {
            if (!roles.some(role => role.name.toLowerCase() === newRoleData.name.trim().toLowerCase())) {
                const newRole: JobRole = {
                    id: generateId(),
                    name: newRoleData.name.trim(),
                    division: newRoleData.division.trim(),
                    jobFamilyCode: newRoleData.jobFamilyCode,
                    hmInterviewer: newRoleData.hmInterviewer.trim(),
                    managementInterviewer: newRoleData.managementInterviewer.trim(),
                };
                setRoles(prev => [...prev, newRole].sort((a, b) => a.name.localeCompare(b.name)));
                setNewRoleData(initialNewRoleData);
            } else {
                alert('A role with this name already exists.');
            }
        } else {
            alert('Please fill out all fields to add a new role.');
        }
    };

    const handleRemoveRole = (indexToRemove: number) => {
        setRoles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleStartEditing = (role: JobRole, index: number) => {
        setEditingIndex(index);
        setEditingRole({ ...role });
    };

    const handleCancelEditing = () => {
        setEditingIndex(null);
        setEditingRole(null);
    };
    
    const handleEditingChange = (field: keyof Omit<JobRole, 'id'>, value: string) => {
        if (editingRole) {
            setEditingRole(prev => ({ ...prev!, [field]: value }));
        }
    };

    const handleSaveEdit = () => {
        if (editingRole && editingIndex !== null) {
            if (!editingRole.name.trim() || !editingRole.division.trim() || !editingRole.jobFamilyCode || !editingRole.hmInterviewer.trim() || !editingRole.managementInterviewer.trim()) {
                alert('All fields are required.');
                return;
            }
            if (roles.some((role, index) => index !== editingIndex && role.name.toLowerCase() === editingRole.name.trim().toLowerCase())) {
                alert('A role with this name already exists.');
                return;
            }
            setRoles(prev => {
                const updatedRoles = [...prev];
                updatedRoles[editingIndex] = editingRole;
                return updatedRoles.sort((a, b) => a.name.localeCompare(b.name));
            });
            handleCancelEditing();
        }
    };


    return (
        <div className="settings-grid">
            <div className="settings-grid-header">
                <h2>Job Role Master</h2>
            </div>
            <p className="settings-description" style={{paddingTop: '0', borderBottom: 'none'}}>Manage the master list of job roles, their families, and divisions.</p>
            <div className="job-role-master-container">
                <div className="role-input-grid">
                    <input
                        type="text"
                        name="name"
                        value={newRoleData.name}
                        onChange={handleNewRoleChange}
                        placeholder="Enter job role name..."
                    />
                     <select name="jobFamilyCode" value={newRoleData.jobFamilyCode} onChange={handleNewRoleChange}>
                        <option value="" disabled>Select Job Family</option>
                        {jobFamilies.map(fam => <option key={fam.code} value={fam.code}>{fam.name}</option>)}
                    </select>
                    <input
                        type="text"
                        name="division"
                        value={newRoleData.division}
                        onChange={handleNewRoleChange}
                        placeholder="Enter division..."
                    />
                    <input
                        type="text"
                        name="hmInterviewer"
                        value={newRoleData.hmInterviewer}
                        onChange={handleNewRoleChange}
                        placeholder="HM Interviewer..."
                    />
                    <input
                        type="text"
                        name="managementInterviewer"
                        value={newRoleData.managementInterviewer}
                        onChange={handleNewRoleChange}
                        placeholder="Mng. Interviewer..."
                    />
                    <button onClick={handleAddRole}>+ Add Role</button>
                </div>
                <div className="table-container">
                    <table className="settings-table job-role-table">
                        <thead>
                            <tr>
                                <th>Job Role</th>
                                <th>Job Family</th>
                                <th>Division</th>
                                <th>HM Interviewer</th>
                                <th>Mng. Interviewer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={role.id}>
                                    {editingIndex === index && editingRole ? (
                                        <>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={editingRole.name} 
                                                    onChange={(e) => handleEditingChange('name', e.target.value)} 
                                                    autoFocus
                                                />
                                            </td>
                                            <td>
                                                <select value={editingRole.jobFamilyCode} onChange={(e) => handleEditingChange('jobFamilyCode', e.target.value)}>
                                                     {jobFamilies.map(fam => <option key={fam.code} value={fam.code}>{fam.name}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={editingRole.division} 
                                                    onChange={(e) => handleEditingChange('division', e.target.value)} 
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={editingRole.hmInterviewer} 
                                                    onChange={(e) => handleEditingChange('hmInterviewer', e.target.value)} 
                                                />
                                            </td>
                                             <td>
                                                <input 
                                                    type="text" 
                                                    value={editingRole.managementInterviewer} 
                                                    onChange={(e) => handleEditingChange('managementInterviewer', e.target.value)} 
                                                />
                                            </td>
                                            <td className="actions-cell">
                                                <button className="action-btn save" onClick={handleSaveEdit}>Save</button>
                                                <button className="action-btn cancel" onClick={handleCancelEditing}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{role.name}</td>
                                            <td>{jobFamilies.find(f => f.code === role.jobFamilyCode)?.name || 'N/A'}</td>
                                            <td>{role.division}</td>
                                            <td>{role.hmInterviewer}</td>
                                            <td>{role.managementInterviewer}</td>
                                            <td className="actions-cell">
                                                <button className="action-btn edit" onClick={() => handleStartEditing(role, index)}>Edit</button>
                                                <button className="action-btn remove" onClick={() => handleRemoveRole(index)}>
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