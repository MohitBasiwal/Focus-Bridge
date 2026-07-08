import React, { useState } from 'react';
import { WebsiteRuleMode, WebsiteRule } from '../../domain/models/Timetable';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  mode: WebsiteRuleMode;
  onModeChange: (m: WebsiteRuleMode) => void;
  rules: WebsiteRule[];
  onRulesChange: (r: WebsiteRule[]) => void;
}

export const WebsiteRuleEditor: React.FC<Props> = ({ mode, onModeChange, rules, onRulesChange }) => {
  const [newDomain, setNewDomain] = useState('');

  const addDomain = () => {
    if (!newDomain.trim()) return;
    const rule: WebsiteRule = { id: crypto.randomUUID(), domain: newDomain.trim().toLowerCase() };
    onRulesChange([...rules, rule]);
    setNewDomain('');
  };

  const removeRule = (id: string) => {
    onRulesChange(rules.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
        <button 
          onClick={() => onModeChange('allowlist')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'allowlist' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
        >
          Allow List
        </button>
        <button 
          onClick={() => onModeChange('blocklist')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'blocklist' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
        >
          Block List
        </button>
      </div>
      
      <p className="text-sm text-slate-400">
        {mode === 'allowlist' ? 'Only the following websites can be accessed. All others are blocked.' : 'The following websites are blocked. All others can be accessed.'}
      </p>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="e.g. wikipedia.org" 
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addDomain()}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500 text-sm"
        />
        <button onClick={addDomain} className="bg-white/10 border border-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {rules.map(rule => (
          <div key={rule.id} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl">
            <span className="text-sm font-medium text-white">{rule.domain}</span>
            <button onClick={() => removeRule(rule.id)} className="p-1 hover:bg-rose-500/20 rounded-md text-rose-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {rules.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-4">No rules added yet.</p>
        )}
      </div>
    </div>
  );
};
