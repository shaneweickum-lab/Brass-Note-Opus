import { useState } from 'react';
import Modal from '../../shared/Modal';
import { SUBSCRIPTION_CATEGORIES } from '../../../utils/constants';

const INITIAL = { name: '', monthlyCost: '', dueDate: 1, category: 'subscription', autoRenew: true, notes: '' };

export default function SubForm({ onClose, onSubmit, existing }) {
  const [form, setForm] = useState(existing || INITIAL);
  const [error, setError] = useState('');
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.monthlyCost) { setError('Name and monthly cost required.'); return; }
    onSubmit(form);
  };

  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
  const inputClass = 'w-full rounded px-3 py-2 text-sm outline-none';
  const Field = ({ label, children }) => (
    <div className="space-y-1"><label className="text-xs" style={{ color: '#8A9BB0' }}>{label}</label>{children}</div>
  );

  return (
    <Modal title={existing ? 'Edit Subscription' : 'Add Subscription'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm p-2 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{error}</p>}

        <Field label="Service Name *">
          <input className={inputClass} style={inputStyle} value={form.name}
            onChange={(e) => set('name', e.target.value)} placeholder="e.g. Suno AI Premier" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Monthly Cost ($) *">
            <input className={inputClass} style={inputStyle} type="number" min={0} step="0.01"
              value={form.monthlyCost} onChange={(e) => set('monthlyCost', e.target.value)} placeholder="0.00" />
          </Field>
          <Field label="Due Day of Month">
            <input className={inputClass} style={inputStyle} type="number" min={1} max={31}
              value={form.dueDate} onChange={(e) => set('dueDate', Number(e.target.value))} />
          </Field>
        </div>

        <Field label="Category">
          <select className={inputClass} style={inputStyle} value={form.category}
            onChange={(e) => set('category', e.target.value)}>
            {Object.entries(SUBSCRIPTION_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>

        <Field label="Notes">
          <input className={inputClass} style={inputStyle} value={form.notes}
            onChange={(e) => set('notes', e.target.value)} placeholder="Plan tier, account, etc." />
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.autoRenew} onChange={(e) => set('autoRenew', e.target.checked)} />
          <span className="text-sm" style={{ color: '#FAF3E0' }}>Auto-renews</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded text-sm"
            style={{ background: '#1E293B', color: '#8A9BB0' }}>Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded text-sm font-semibold"
            style={{ background: '#D4A843', color: '#0A0E1A' }}>
            {existing ? 'Save Changes' : 'Add Subscription'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
