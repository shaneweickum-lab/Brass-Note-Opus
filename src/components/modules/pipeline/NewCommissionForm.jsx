import { useState } from 'react';
import Modal from '../../shared/Modal';
import { COMMISSION_TYPES, GENRE_CODES, LYRIC_CODES, VOCAL_CODES, PACKAGES } from '../../../utils/constants';

const INITIAL = {
  clientName: '', clientEmail: '', clientPhone: '',
  commissionType: 'individual', package: 'First Song',
  songCount: 1, totalPayment: '', songwriterBuyout: false, buyoutSongs: 0,
  isRush: false, deliveryDeadline: '',
  genreCode: '01', lyricCode: 'L', vocalCode: 'M',
  briefSummary: '', genre: '', vocalType: '',
};

export default function NewCommissionForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName || !form.clientEmail || !form.deliveryDeadline) {
      setError('Client name, email, and delivery deadline are required.');
      return;
    }
    onSubmit({ ...form, songCount: Number(form.songCount) });
  };

  const inputClass = "w-full rounded px-3 py-2 text-sm outline-none focus:ring-1";
  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0', focusRingColor: '#0D9488' };

  const Field = ({ label, children }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium" style={{ color: '#8A9BB0' }}>{label}</label>
      {children}
    </div>
  );

  return (
    <Modal title="New Commission" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm p-2 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Client Name *">
            <input className={inputClass} style={inputStyle} value={form.clientName}
              onChange={(e) => set('clientName', e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Commission Type *">
            <select className={inputClass} style={inputStyle} value={form.commissionType}
              onChange={(e) => set('commissionType', e.target.value)}>
              {Object.entries(COMMISSION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email *">
            <input className={inputClass} style={inputStyle} type="email" value={form.clientEmail}
              onChange={(e) => set('clientEmail', e.target.value)} placeholder="client@email.com" />
          </Field>
          <Field label="Phone">
            <input className={inputClass} style={inputStyle} value={form.clientPhone}
              onChange={(e) => set('clientPhone', e.target.value)} placeholder="Optional" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Package *">
            <select className={inputClass} style={inputStyle} value={form.package}
              onChange={(e) => set('package', e.target.value)}>
              {PACKAGES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="# Songs *">
            <input className={inputClass} style={inputStyle} type="number" min={1} max={50}
              value={form.songCount} onChange={(e) => set('songCount', e.target.value)} />
          </Field>
          <Field label="Total Payment ($)">
            <input className={inputClass} style={inputStyle} type="number" min={0}
              value={form.totalPayment} onChange={(e) => set('totalPayment', e.target.value)} placeholder="0.00" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Genre">
            <select className={inputClass} style={inputStyle} value={form.genreCode}
              onChange={(e) => set('genreCode', e.target.value)}>
              {Object.entries(GENRE_CODES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Lyrics">
            <select className={inputClass} style={inputStyle} value={form.lyricCode}
              onChange={(e) => set('lyricCode', e.target.value)}>
              {Object.entries(LYRIC_CODES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Vocal">
            <select className={inputClass} style={inputStyle} value={form.vocalCode}
              onChange={(e) => set('vocalCode', e.target.value)}>
              {Object.entries(VOCAL_CODES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Delivery Deadline *">
          <input className={inputClass} style={inputStyle} type="date"
            value={form.deliveryDeadline} onChange={(e) => set('deliveryDeadline', e.target.value)} />
        </Field>

        <Field label="Brief Summary">
          <textarea className={inputClass} style={inputStyle} rows={3}
            value={form.briefSummary} onChange={(e) => set('briefSummary', e.target.value)}
            placeholder="Occasion, story, key details..." />
        </Field>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isRush} onChange={(e) => set('isRush', e.target.checked)}
              className="rounded" />
            <span className="text-sm" style={{ color: '#D4A843' }}>⚡ Rush Order</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.songwriterBuyout} onChange={(e) => set('songwriterBuyout', e.target.checked)}
              className="rounded" />
            <span className="text-sm" style={{ color: '#FAF3E0' }}>Songwriter Buyout</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded text-sm font-medium transition-colors"
            style={{ background: '#1E293B', color: '#8A9BB0' }}>
            Cancel
          </button>
          <button type="submit" className="flex-1 py-2 rounded text-sm font-semibold transition-colors"
            style={{ background: '#D4A843', color: '#0A0E1A' }}>
            Create Commission
          </button>
        </div>
      </form>
    </Modal>
  );
}
