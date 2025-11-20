
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { ArrowLeft, Trash2, Plus, Mail, Shield, User as UserIcon, Search, Camera, Upload, X, Check, Briefcase, Edit2 } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface TeamManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onBack: () => void;
}

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Caleb',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Red',
];

export const TeamManagement: React.FC<TeamManagementProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 'NEW' means editing the invite form avatar, otherwise it's a User ID
  const [avatarModalTarget, setAvatarModalTarget] = useState<string | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    jobTitle: '',
    role: 'Member' as UserRole,
    avatarUrl: '', 
  });

  const [emailError, setEmailError] = useState('');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; jobTitle: string; alias: string }>({ name: '', jobTitle: '', alias: '' });

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDangerous: boolean;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDangerous: true });

  const openConfirm = (title: string, message: string, action: () => void, isDangerous = true) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm: action,
      isDangerous
    });
  };

  const handleConfirmAction = () => {
      confirmConfig.onConfirm();
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.alias.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAdd = () => {
    if (!newUser.name || !newUser.email) return;
    
    if (!isValidEmail(newUser.email)) {
        setEmailError('Please enter a valid email address');
        return;
    }
    
    const user: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: newUser.name,
      alias: newUser.email, // Using alias field to store email
      jobTitle: newUser.jobTitle,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${newUser.name}`,
    };

    onAddUser(user);
    setNewUser({ name: '', email: '', jobTitle: '', role: 'Member', avatarUrl: '' });
    setEmailError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateAvatar = (url: string) => {
    if (avatarModalTarget === 'NEW') {
      setNewUser(prev => ({ ...prev, avatarUrl: url }));
    } else if (avatarModalTarget) {
      const userToUpdate = users.find(u => u.id === avatarModalTarget);
      if (userToUpdate) {
        onUpdateUser({ ...userToUpdate, avatarUrl: url });
      }
    }
    setAvatarModalTarget(null);
  };

  const handleStartEdit = (user: User) => {
      setEditingId(user.id);
      setEditData({
          name: user.name,
          jobTitle: user.jobTitle || '',
          alias: user.alias
      });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setEditData({ name: '', jobTitle: '', alias: '' });
  };

  const handleSaveEdit = (userId: string) => {
      const user = users.find(u => u.id === userId);
      if (user && editData.name && editData.alias) {
          onUpdateUser({
              ...user,
              name: editData.name,
              jobTitle: editData.jobTitle,
              alias: editData.alias
          });
          setEditingId(null);
      }
  };

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Team Management</h1>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8 relative">
        
        {/* Invite Card - Only if Admin */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Invite New Member</h2>
                <p className="text-sm text-gray-500">Add a new member to your team workspace.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Avatar Picker for New User */}
              <div className="relative group cursor-pointer flex-shrink-0" onClick={() => setAvatarModalTarget('NEW')}>
                  <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-primary-400 transition-colors">
                      {newUser.avatarUrl ? (
                          <img src={newUser.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                          <Camera className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                      )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-2 h-2" />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sarah Connor"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="sarah@company.com"
                      value={newUser.email}
                      onChange={(e) => {
                          setNewUser({...newUser, email: e.target.value});
                          if (emailError) setEmailError('');
                      }}
                      className={`w-full p-2.5 bg-gray-50 border ${emailError ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none`}
                    />
                    {emailError && <span className="text-xs text-red-500">{emailError}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Frontend Dev"
                      value={newUser.jobTitle}
                      onChange={(e) => setNewUser({...newUser, jobTitle: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Access Level</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
              </div>

              <button 
                onClick={handleAdd}
                disabled={!newUser.name || !newUser.email}
                className="w-full md:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
              >
                <Plus className="w-4 h-4" /> Invite
              </button>
            </div>
          </div>
        )}

        {/* Team List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Team Members ({users.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search members..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition-colors group gap-4">
                <div className="flex items-center gap-4 flex-1 w-full">
                  <div 
                    className="relative cursor-pointer group/avatar flex-shrink-0"
                    onClick={() => isAdmin && setAvatarModalTarget(user.id)}
                    title={isAdmin ? "Change Avatar" : ""}
                  >
                      <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                      {isAdmin && (
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                           <Camera className="w-4 h-4 text-white" />
                        </div>
                      )}
                  </div>
                  
                  {/* Edit Mode vs View Mode */}
                  {editingId === user.id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 mr-4 animate-in fade-in duration-200">
                           <input 
                                value={editData.name}
                                onChange={e => setEditData({...editData, name: e.target.value})}
                                placeholder="Full Name"
                                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                                autoFocus
                           />
                           <input 
                                value={editData.jobTitle}
                                onChange={e => setEditData({...editData, jobTitle: e.target.value})}
                                placeholder="Job Title"
                                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                           />
                           <input 
                                value={editData.alias}
                                onChange={e => setEditData({...editData, alias: e.target.value})}
                                placeholder="Email"
                                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none md:col-span-2 font-mono text-xs"
                           />
                      </div>
                  ) : (
                      <div>
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                          {user.name}
                          {user.role === 'Admin' && <Shield className="w-3 h-3 text-primary-500 fill-primary-500" />}
                        </div>
                        <div className="flex flex-col">
                          {user.jobTitle && <div className="text-xs font-medium text-gray-700 flex items-center gap-1"><Briefcase className="w-3 h-3 text-gray-400"/> {user.jobTitle}</div>}
                          <div className="text-xs text-gray-500 font-mono">{user.alias}</div>
                        </div>
                      </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <select
                    value={user.role}
                    disabled={!isAdmin}
                    onChange={(e) => onUpdateUser({...user, role: e.target.value as UserRole})}
                    className={`text-sm font-medium bg-transparent border-none focus:ring-0 ${isAdmin ? 'cursor-pointer hover:text-primary-600 text-gray-600' : 'cursor-default text-gray-400 appearance-none pointer-events-none'}`}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  
                  {isAdmin && (
                      <div className="flex items-center gap-1">
                          {editingId === user.id ? (
                              <>
                                <button 
                                    onClick={() => handleSaveEdit(user.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Save Changes"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleCancelEdit}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Cancel"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                              </>
                          ) : (
                              <>
                                <button 
                                    onClick={() => handleStartEdit(user)}
                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    title="Edit Details"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => {
                                        openConfirm(
                                            'Remove Member',
                                            `Are you sure you want to remove ${user.name} from the team? This action cannot be undone.`,
                                            () => onDeleteUser(user.id)
                                        );
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove User"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                          )}
                      </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500 italic">
                No team members found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {avatarModalTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-gray-800">Choose Avatar</h3>
                   <button onClick={() => setAvatarModalTarget(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                       <X className="w-5 h-5 text-gray-500" />
                   </button>
               </div>

               <div className="space-y-6">
                   {/* Upload Section */}
                   <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all"
                   >
                       <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileUpload}
                       />
                       <div className="bg-primary-100 p-3 rounded-full mb-3 text-primary-600">
                           <Upload className="w-6 h-6" />
                       </div>
                       <p className="text-sm font-bold text-gray-700">Upload Image</p>
                       <p className="text-xs text-gray-500 mt-1">Click to browse files</p>
                   </div>

                   {/* Presets Section */}
                   <div>
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Or choose a preset</label>
                       <div className="grid grid-cols-4 gap-3">
                           {AVATAR_PRESETS.map((url, idx) => (
                               <button 
                                   key={idx}
                                   onClick={() => updateAvatar(url)}
                                   className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-primary-500 transition-all"
                               >
                                   <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                               </button>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        isDangerous={confirmConfig.isDangerous}
      />
    </div>
  );
};