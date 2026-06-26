import { useState } from 'react';
import Modal from '../shared/Modal';
import { hashPassword, verifyPassword } from '../../utils/dateUtils';

export default function Settings({ settings, onUpdate, onClose }) {
  const [form, setForm] = useState({
    ownerName: settings.ownerName || 'Shane',
    revisionWindowDays: settings.revisionWindowDays || 14,
    followUpDelayDays: settings.followUpDelayDays || 7,
  });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = () => {
    onUpdate(form);
    onClose();
  };

  const handleChangePassword = () => {
    setPwError('');
    if (!settings.appPassword) {
      if (!pwForm.next || pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
      onUpdate({ appPassword: hashPassword(pwForm.next) });
      setPwSuccess(true);
      setPwForm({ current: '', next: '', confirm: '' });
      return;
    }
    if (!verifyPassword(pwForm.current, settings.appPassword)) { setPwError('Current password incorrect.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
    if (!pwForm.next) { setPwError('New password cannot be empty.'); return; }
    onUpdate({ appPassword: hashPassword(pwForm.next) });
    setPwSuccess(true);
    setPwForm({ current: '', next: '', confirm: '' });
  };

  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
  const inputClass = 'w-full rounded px-3 py-2 text-sm outline-none';
  const Field = ({ label, children }) => (
    <div className="space-y-1"><label className="text-xs" style={{ color: '#8A9BB0' }}>{label}</label>{children}</div>
  );

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8A9BB0' }}>General</p>
          <div className="space-y-3">
            <Field label="Owner Name">
              <input className={inputClass} style={inputStyle} value={form.ownerName}
                onChange={(e) => set('ownerName', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Revision Window (days)">
                <input className={inputClass} style={inputStyle} type="number" min={1}
                  value={form.revisionWindowDays} onChange={(e) => set('revisionWindowDays', Number(e.target.value))} />
              </Field>
              <Field label="Follow-Up Delay (days)">
                <input className={inputClass} style={inputStyle} type="number" min={1}
                  value={form.followUpDelayDays} onChange={(e) => set('followUpDelayDays', Number(e.target.value))} />
              </Field>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: '#1E293B' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8A9BB0' }}>Password</p>
          {pwSuccess && <p className="text-sm mb-2 p-2 rounded" style={{ color: '#1A5C38', background: '#1A5C3811' }}>Password updated.</p>}
          {pwError && <p className="text-sm mb-2 p-2 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{pwError}</p>}
          <div className="space-y-2">
            {settings.appPassword && (
              <input className={inputClass} style={inputStyle} type="password" placeholder="Current password"
                value={pwForm.current} onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} />
            )}
            <input className={inputClass} style={inputStyle} type="password" placeholder="New password"
              value={pwForm.next} onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))} />
            <input className={inputClass} style={inputStyle} type="password" placeholder="Confirm new password"
              value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} />
            <button onClick={handleChangePassword} className="w-full py-2 rounded text-sm font-medium mt-1"
              style={{ background: '#1E293B', color: '#8A9BB0' }}>
              {settings.appPassword ? 'Change Password' : 'Set Password'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t" style={{ borderColor: '#1E293B' }}>
          <button onClick={onClose} className="flex-1 py-2 rounded text-sm"
            style={{ background: '#1E293B', color: '#8A9BB0' }}>Close</button>
          <button onClick={handleSave} className="flex-1 py-2 rounded text-sm font-semibold"
            style={{ background: '#D4A843', color: '#0A0E1A' }}>Save Settings</button>
        </div>
      </div>
    </Modal>
  );
}
