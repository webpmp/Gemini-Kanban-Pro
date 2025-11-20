
import React, { useState } from 'react';
import { StatusUpdate, User } from '../types';
import { ArrowLeft, Check, Info, Lightbulb, Calendar } from 'lucide-react';

interface CreateStatusUpdateProps {
  currentUser: User;
  onSave: (update: StatusUpdate) => void;
  onCancel: () => void;
}

export const CreateStatusUpdate: React.FC<CreateStatusUpdateProps> = ({ currentUser, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<StatusUpdate['type']>('Weekly');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title || !content) return;

    const newUpdate: StatusUpdate = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      date,
      type,
      content,
      author: currentUser.name,
    };

    onSave(newUpdate);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">New Status Update</h1>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Update Title</label>
                <input
                  type="text"
                  placeholder="e.g. Week 4 Sprint Summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                  autoFocus
                />
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Update Type</label>
                 <select
                    value={type}
                    onChange={(e) => setType(e.target.value as StatusUpdate['type'])}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                 >
                    <option value="Daily">Daily Standup</option>
                    <option value="Weekly">Weekly Report</option>
                    <option value="Monthly">Monthly Review</option>
                    <option value="Ad-hoc">Ad-hoc / Announcement</option>
                 </select>
              </div>
            </div>

            <div className="mb-6">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Date</label>
               <div className="relative">
                   <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                   <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                   />
               </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Update Content</label>
              <textarea
                rows={12}
                placeholder="What did the team achieve? What's blocked? What's next?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={onCancel}
                className="px-6 py-2.5 text-gray-500 hover:bg-gray-50 rounded-lg font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!title || !content}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Publish Update
              </button>
            </div>

          </div>
        </div>

        {/* Tips Section */}
        <div className="lg:col-span-1">
           <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 text-primary-800 font-bold mb-4">
                 <Lightbulb className="w-5 h-5" />
                 <h3>Writing Effective Updates</h3>
              </div>
              
              <div className="space-y-5">
                 <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                       <h4 className="text-sm font-bold text-primary-900 mb-1">Be Concise</h4>
                       <p className="text-xs text-primary-800/80 leading-relaxed">
                          Focus on high-level achievements. Use bullet points to make it scannable.
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                       <h4 className="text-sm font-bold text-primary-900 mb-1">Highlight Blockers</h4>
                       <p className="text-xs text-primary-800/80 leading-relaxed">
                          Clearly state any risks or impediments that need attention from leadership.
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                       <h4 className="text-sm font-bold text-primary-900 mb-1">Next Steps</h4>
                       <p className="text-xs text-primary-800/80 leading-relaxed">
                          Briefly outline the primary focus for the upcoming period.
                       </p>
                    </div>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-primary-200">
                    <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg">
                       <Info className="w-4 h-4 text-primary-500 mt-0.5" />
                       <p className="text-xs text-primary-700 italic">
                          "A good status update answers three questions: What did we do? What are we doing next? Is anything stopping us?"
                       </p>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};