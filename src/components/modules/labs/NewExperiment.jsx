import { useState } from 'react';
import Modal from '../../shared/Modal';
import { EXPERIMENT_CODES } from '../../../utils/constants';

const INITIAL = {
  experimentCode: 'EXP001', sunoVersion: '4', weirdness: 50, constraint: 50,
  hypothesis: '', expectedResult: '', stylePrompt: '', lyricPrompt: '',
  tier2Symbols: '', tier3Applied: false, notes: '',
  status: 'scheduled', date: new Date().toISOString().slice(0, 10),
};

export default function NewExperiment({ onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.hypothesis) { setError('Hypothesis is required.'); return; }
    onSubmit(form);
  };

  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
  const inputClass = 'w-full rounded px-3 py-2 text-sm outline-none';
  const Field = ({ label, children }) => (
    <div className="space-y-1"><label className="text-xs" style={{ color: '#8A9BB0' }}>{label}</label>{children}</div>
  );

  return (
    <Modal title="New Labs Experiment" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm p-2 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Experiment Type *">
            <select className={inputClass} style={inputStyle} value={form.experimentCode}
              onChange={(e) => set('experimentCode', e.target.value)}>
              {Object.entries(EXPERIMENT_CODES).map(([k, v]) => (
                <option key={k} value={k}>{k} — {v}</option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input className={inputClass} style={inputStyle} type="date"
              value={form.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Suno Version">
            <input className={inputClass} style={inputStyle} value={form.sunoVersion}
              onChange={(e) => set('sunoVersion', e.target.value)} placeholder="e.g. 4.0" />
          </Field>
          <Field label={`Weirdness: ${form.weirdness}`}>
            <input type="range" min={0} max={100} value={form.weirdness}
              onChange={(e) => set('weirdness', Number(e.target.value))}
              className="w-full" style={{ accentColor: '#4A148C' }} />
          </Field>
          <Field label={`Constraint: ${form.constraint}`}>
            <input type="range" min={0} max={100} value={form.constraint}
              onChange={(e) => set('constraint', Number(e.target.value))}
              className="w-full" style={{ accentColor: '#4A148C' }} />
          </Field>
        </div>

        <Field label="Hypothesis *">
          <textarea className={inputClass} style={inputStyle} rows={2}
            value={form.hypothesis} onChange={(e) => set('hypothesis', e.target.value)}
            placeholder="What are we testing?" />
        </Field>

        <Field label="Expected Result">
          <textarea className={inputClass} style={inputStyle} rows={2}
            value={form.expectedResult} onChange={(e) => set('expectedResult', e.target.value)}
            placeholder="What do we predict?" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Style Prompt">
            <textarea className={inputClass} style={inputStyle} rows={2}
              value={form.stylePrompt} onChange={(e) => set('stylePrompt', e.target.value)}
              placeholder="Full style prompt..." />
          </Field>
          <Field label="Lyric Prompt">
            <textarea className={inputClass} style={inputStyle} rows={2}
              value={form.lyricPrompt} onChange={(e) => set('lyricPrompt', e.target.value)}
              placeholder="Lyric prompt or N/A" />
          </Field>
        </div>

        <Field label="Status">
          <select className={inputClass} style={inputStyle} value={form.status}
            onChange={(e) => set('status', e.target.value)}>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="analysis">Analysis</option>
            <option value="complete">Complete</option>
          </select>
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.tier3Applied}
            onChange={(e) => set('tier3Applied', e.target.checked)} />
          <span className="text-sm" style={{ color: '#FAF3E0' }}>Tier 3 Phonetic Description Applied</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded text-sm"
            style={{ background: '#1E293B', color: '#8A9BB0' }}>Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded text-sm font-semibold"
            style={{ background: '#4A148C', color: '#FAF3E0' }}>
            Create Experiment
          </button>
        </div>
      </form>
    </Modal>
  );
}
