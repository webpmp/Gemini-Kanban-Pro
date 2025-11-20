
import React from 'react';
import { Task, Priority, TaskType, TaskStatus, User } from '../types';
import { Calendar, CheckCircle2, Paperclip, User as UserIcon, AlertCircle, Layers, Link as LinkIcon, Flag } from 'lucide-react';

interface CardProps {
  task: Task;
  users: User[];
  onClick: (task: Task) => void;
  isDimmed?: boolean;
}

export const Card: React.FC<CardProps> = ({ task, users, onClick, isDimmed }) => {
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const isEpic = task.type === TaskType.EPIC;
  
  // Priority Colors
  const priorityColor = {
      [Priority.LOW]: 'border-l-green-400',
      [Priority.MEDIUM]: 'border-l-yellow-400',
      [Priority.HIGH]: 'border-l-orange-500',
      [Priority.CRITICAL]: 'border-l-red-600',
  };

  const statusColor = {
      [TaskStatus.COMPLETE]: 'bg-green-100 text-green-700',
      [TaskStatus.IN_PROGRESS]: 'bg-primary-100 text-primary-700',
      [TaskStatus.BLOCKED]: 'bg-red-100 text-red-700',
      [TaskStatus.ON_HOLD]: 'bg-gray-200 text-gray-700',
      [TaskStatus.PLANNING]: 'bg-secondary-100 text-secondary-700',
      [TaskStatus.NOT_STARTED]: 'bg-gray-100 text-gray-600',
  };

  const assignee = users.find(u => u.name === task.assignee);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
      className={`
        group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer border border-gray-100
        ${isEpic ? 'ring-2 ring-secondary-100' : `border-l-4 ${priorityColor[task.priority]}`}
        ${task.isMilestone ? 'bg-yellow-50/50' : ''}
        ${isDimmed ? 'opacity-10 grayscale pointer-events-none' : 'opacity-100'}
        transition-all duration-500
      `}
    >
      {/* Epic Badge */}
      {isEpic && (
         <div className="absolute -top-2 -right-2 bg-secondary-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            EPIC
            <span className="bg-secondary-800 px-1 rounded text-white">{task.subTaskIds?.length || 0}</span>
         </div>
      )}

      {/* Milestone Badge */}
      {task.isMilestone && !isEpic && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
              <Flag className="w-3 h-3 fill-white" />
              MILESTONE
          </div>
      )}

      {/* Milestone Badge for Epic (stacked) */}
      {task.isMilestone && isEpic && (
          <div className="absolute -top-2 right-16 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
              <Flag className="w-3 h-3 fill-white" />
          </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusColor[task.status]}`}>
          {task.customStatusText || task.status}
        </span>
        {task.priority === Priority.CRITICAL && <AlertCircle className="w-4 h-4 text-red-500" />}
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-gray-800 mb-1 leading-tight ${isEpic ? 'text-lg text-secondary-900' : 'text-sm'}`}>
        {task.title || 'Untitled Task'}
      </h3>

      {/* Attributes / Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
         {task.tags.slice(0, 3).map(tag => (
             <span key={tag} className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">#{tag}</span>
         ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2 text-gray-400">
            {assignee ? (
                <img src={assignee.avatarUrl} alt={assignee.name} className="w-6 h-6 rounded-full border border-white shadow-sm" title={assignee.name} />
            ) : (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"><UserIcon className="w-3 h-3" /></div>
            )}
        </div>

        <div className="flex items-center gap-3">
            {task.comments.length > 0 && (
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <span className="font-medium">{task.comments.length}</span>
                    <span className="text-[10px]">msg</span>
                </div>
            )}
            {task.projectLinks && task.projectLinks.length > 0 && (
                <a 
                    href={task.projectLinks[0].url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-primary-500 hover:text-primary-600 p-1 hover:bg-primary-50 rounded transition-colors flex items-center"
                    onClick={(e) => e.stopPropagation()}
                    title={task.projectLinks[0].title || "View Documentation"}
                >
                    <LinkIcon className="w-3 h-3" />
                    {task.projectLinks.length > 1 && <span className="text-[9px] ml-0.5 -mt-1 font-bold">{task.projectLinks.length}</span>}
                </a>
            )}
            <div className={`flex items-center gap-1 text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
            </div>
        </div>
      </div>

      {/* Attribute Dots */}
      <div className="flex gap-1 mt-2">
        {task.attributes.Development && <div className="w-2 h-2 rounded-full bg-primary-400" title="Development"></div>}
        {task.attributes.IXD && <div className="w-2 h-2 rounded-full bg-pink-400" title="IXD"></div>}
        {task.attributes.QA && <div className="w-2 h-2 rounded-full bg-green-400" title="QA"></div>}
      </div>

    </div>
  );
};