import { useState } from 'react';
import { X } from 'lucide-react';
import { EXPERIMENT_CODES, RESULT_CODES, INTEGRATION_STATUSES } from '../../../utils/constants';
import { formatDateFull } from '../../../utils/dateUtils';

const STATUS_COLORS = { scheduled: '#8A9BB0', in_progress: '#D4A843', analysis: '#0D9488', complete: '#1A5C38', archived: '#333' };
const RESULT_COLORS = { PASS: '#1A5C38', FAIL: '#C0392B', PARTIAL: '#D4A843', ANOMALY: '#4A148C' };

export default function LabsDetail({ experiment, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    actualResult: experiment.actualResult || '',
    resultCode: experiment.resultCode || '',
    keyFinding: experiment.keyFinding || '',
    integrationStatus: experiment.integrationStatus || '',
    notes: experiment.notes || '',
    status: experiment.status,
  });

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const e = experiment;

  const handleSave = () => {
    onUpdate(e.internalId, form);
    setEditing(false);
  };

  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
  const inputClass = 'w-full rounded px-3 py-2 text-sm outline-none';

  return (
    <div className="fixed right-0 top-12 bottom-0 z-30 flex flex-col overflow-hidden"
      style={{ width: 440, background: '#0F172A', borderLeft: '1px solid #1E293B' }}>
      <div className="flex items-start justify-between px-5 py-4 border-b" style={{ borderColor: '#1E293B' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded" style={{ color: '#4A148C', background: '#4A148C22', border: '1px solid #4A148C44' }}>
              {e.experimentCode}
            </span>
            <span className="text-xs px-2 py-0.5 rounded capitalize"
              style={{ color: STATUS_COLORS[e.status], background: `${STATUS_COLORS[e.status]}22` }}>
              {e.status?.replace('_', ' ')}
            </span>
          </div>
          <h2 className="text-base font-semibold" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
            {EXPERIMENT_CODES[e.experimentCode]}
          </h2>
          <p className="text-xs mt-0.5 font-mono" style={{ color: '#4A5568' }}>{e.id}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10" style={{ color: '#8A9BB0' }}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div><span style={{ color: '#8A9BB0' }}>Date: </span><span style={{ color: '#FAF3E0' }}>{formatDateFull(e.date)}</span></div>
          <div><span style={{ color: '#8A9BB0' }}>Suno: </span><span style={{ color: '#FAF3E0' }}>{e.sunoVersion || '—'}</span></div>
          <div><span style={{ color: '#8A9BB0' }}>Weirdness: </span><span style={{ color: '#FAF3E0' }}>{e.weirdness}</span></div>
          <div><span style={{ color: '#8A9BB0' }}>Constraint: </span><span style={{ color: '#FAF3E0' }}>{e.constraint}</span></div>
          <div><span style={{ color: '#8A9BB0' }}>Labs #: </span><span style={{ color: '#FAF3E0' }}>{e.labsGlobalDisplay}</span></div>
          <div><span style={{ color: '#8A9BB0' }}>Tier 3: </span><span style={{ color: '#FAF3E0' }}>{e.tier3Applied ? 'Yes' : 'No'}</span></div>
        </div>

        <div className="rounded p-3" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
          <p className="text-xs mb-1" style={{ color: '#8A9BB0' }}>Hypothesis</p>
          <p className="text-sm" style={{ color: '#FAF3E0' }}>{e.hypothesis}</p>
        </div>

        {e.expectedResult && (
          <div className="rounded p-3" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
            <p className="text-xs mb-1" style={{ color: '#8A9BB0' }}>Expected Result</p>
            <p className="text-sm" style={{ color: '#FAF3E0' }}>{e.expectedResult}</p>
          </div>
        )}

        {/* Results */}
        {editing ? (
          <div className="rounded p-4 space-y-3" style={{ background: '#0A0E1A', border: '1px solid #4A148C44' }}>
            <p className="text-sm font-medium" style={{ color: '#FAF3E0' }}>Log Results</p>

            <div><label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Status</label>
              <select className={inputClass} style={inputStyle} value={form.status} onChange={(e) => set('status', e.target.value)}>
                {['scheduled', 'in_progress', 'analysis', 'complete', 'archived'].map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div><label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Result Code</label>
              <select className={inputClass} style={inputStyle} value={form.resultCode} onChange={(e) => set('resultCode', e.target.value)}>
                <option value="">— Select —</option>
                {RESULT_CODES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div><label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Actual Result</label>
              <textarea className={inputClass} style={inputStyle} rows={2}
                value={form.actualResult} onChange={(e) => set('actualResult', e.target.value)}
                placeholder="What happened?" />
            </div>

            <div><label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Key Finding</label>
              <input className={inputClass} style={inputStyle} value={form.keyFinding}
                onChange={(e) => set('keyFinding', e.target.value)} placeholder="One-sentence summary" />
            </div>

            <div><label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Integration Status</label>
              <select className={inputClass} style={inputStyle} value={form.integrationStatus}
                onChange={(e) => set('integrationStatus', e.target.value)}>
                <option value="">— Select —</option>
                {INTEGRATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div><label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Notes</label>
              <textarea className={inputClass} style={inputStyle} rows={2}
                value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded text-sm"
                style={{ background: '#1E293B', color: '#8A9BB0' }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 rounded text-sm font-medium"
                style={{ background: '#4A148C', color: '#FAF3E0' }}>Save</button>
            </div>
          </div>
        ) : (
          <>
            {e.resultCode ? (
              <div className="rounded p-3" style={{ background: `${RESULT_COLORS[e.resultCode]}11`, border: `1px solid ${RESULT_COLORS[e.resultCode]}44` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: RESULT_COLORS[e.resultCode] }}>{e.resultCode}</span>
                  {e.integrationStatus && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ color: '#8A9BB0', background: '#1E293B' }}>
                      {e.integrationStatus}
                    </span>
                  )}
                </div>
                {e.keyFinding && <p className="text-sm mb-2" style={{ color: '#FAF3E0' }}>{e.keyFinding}</p>}
                {e.actualResult && <p className="text-xs" style={{ color: '#8A9BB0' }}>{e.actualResult}</p>}
              </div>
            ) : (
              <p className="text-xs text-center py-4" style={{ color: '#4A5568' }}>No results logged yet</p>
            )}
            <button onClick={() => setEditing(true)} className="w-full py-2 rounded text-sm font-medium transition-colors"
              style={{ background: '#4A148C22', color: '#4A148C', border: '1px solid #4A148C44' }}>
              {e.resultCode ? 'Edit Results' : 'Log Results'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
