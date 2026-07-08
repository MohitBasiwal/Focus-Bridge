import React, { useState } from 'react';
import { BreakSession } from '../../domain/models/Timetable';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Props {
  breaks: BreakSession[];
  onChange: (b: BreakSession[]) => void;
}

export const BreakSessionEditor: React.FC<Props> = ({ breaks, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newBreak, setNewBreak] = useState<Partial<BreakSession>>({ title: '', startTime: '12:00', endTime: '12:15' });

  const addBreak = () => {
    if (!newBreak.title || !newBreak.startTime || !newBreak.endTime) return;
    onChange([...breaks, { ...newBreak, id: crypto.randomUUID() } as BreakSession]);
    setIsAdding(false);
    setNewBreak({ title: '', startTime: '12:00', endTime: '12:15' });
  };

  const removeBreak = (id: string) => {
    onChange(breaks.filter(b => b.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      {breaks.map(b => (
        <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-white text-sm mb-1">{b.title}</h4>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="w-3 h-3" />
              <span>{b.startTime} - {b.endTime}</span>
            </div>
          </div>
          <button onClick={() => removeBreak(b.id)} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      
      {breaks.length === 0 && !isAdding && (
         <p className="text-center text-slate-500 text-sm py-4">No breaks scheduled.</p>
      )}

      {isAdding ? (
        <div className="bg-white/5 border border-indigo-500/50 rounded-xl p-4 flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Break Title (e.g. Lunch)" 
            className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
            value={newBreak.title}
            onChange={e => setNewBreak({...newBreak, title: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="time" 
              className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
              value={newBreak.startTime}
              onChange={e => setNewBreak({...newBreak, startTime: e.target.value})}
            />
            <input 
              type="time" 
              className="bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
              value={newBreak.endTime}
              onChange={e => setNewBreak({...newBreak, endTime: e.target.value})}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setIsAdding(false)} className="flex-1 py-2 text-sm font-bold text-slate-400 hover:bg-white/5 rounded-lg transition-colors">Cancel</button>
            <button onClick={addBreak} className="flex-1 py-2 text-sm font-bold bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">Save Break</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-bold"
        >
          <Plus className="w-4 h-4" /> Add Break
        </button>
      )}
    </div>
  );
};
