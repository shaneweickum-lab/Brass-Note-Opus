import { useState } from 'react';
import Modal from '../shared/Modal';
import { Trash2, UserPlus, Shield, User } from 'lucide-react';
import { verifyPassword } from '../../utils/dateUtils';

export default function Settings({
  settings, onUpdate, onClose,
  currentUser, accounts, adminCount,
  onAddEmployee, onDeleteAccount, onUpdatePassword,
}) {
  const isAdmin = currentUser?.role === 'admin';

  const [form, setForm] = useState({
    ownerName: settings.ownerName || 'Shane',
    revisionWindowDays: settings.revisionWindowDays || 14,
    followUpDelayDays: settings.followUpDelayDays || 7,
  });
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const [empForm, setEmpForm] = useState({ username: '', password: '', confirm: '' });
  const [empError, setEmpError] = useState('');
  const [empSuccess, setEmpSuccess] = useState('');

  const handleSave = () => {
    onUpdate(form);
    onClose();
  };

  const handleChangePassword = () => {
    setPwError('');
    setPwSuccess(false);
    const account = accounts.find((a) => a.username === currentUser?.username);
    if (!account) { setPwError('Account not found.'); return; }
    if (!verifyPassword(pwForm.current, account.passwordHash)) {
      setPwError('Current password incorrect.');
      return;
    }
    if (!pwForm.next) { setPwError('New password cannot be empty.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
    onUpdatePassword(currentUser.username, pwForm.next);
    setPwSuccess(true);
    setPwForm({ current: '', next: '', confirm: '' });
  };

  const handleAddEmployee = () => {
    setEmpError('');
    setEmpSuccess('');
    const u = empForm.username.trim();
    if (!u) { setEmpError('Username is required.'); return; }
    if (!empForm.password) { setEmpError('Password is required.'); return; }
    if (empForm.password !== empForm.confirm) { setEmpError('Passwords do not match.'); return; }
    try {
      onAddEmployee(u, empForm.password);
      setEmpSuccess(`Employee "${u}" added.`);
      setEmpForm({ username: '', password: '', confirm: '' });
    } catch (err) {
      setEmpError(err.message);
    }
  };

  const handleDeleteAccount = (username) => {
    if (username === currentUser?.username) return; // can't delete yourself
    onDeleteAccount(username);
  };

  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
  const inputClass = 'w-full rounded px-3 py-2 text-sm outline-none';
  const Field = ({ label, children }) => (
    <div className="space-y-1">
      <label className="text-xs" style={{ color: '#8A9BB0' }}>{label}</label>
      {children}
    </div>
  );

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="space-y-6">

        {/* General */}
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

        {/* Change own password */}
        <div className="pt-4 border-t" style={{ borderColor: '#1E293B' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8A9BB0' }}>Change My Password</p>
          {pwSuccess && (
            <p className="text-xs mb-2 p-2 rounded" style={{ color: '#0D9488', background: '#0D948811' }}>Password updated.</p>
          )}
          {pwError && (
            <p className="text-xs mb-2 p-2 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{pwError}</p>
          )}
          <div className="space-y-2">
            <input className={inputClass} style={inputStyle} type="password" placeholder="Current password"
              value={pwForm.current} onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} />
            <input className={inputClass} style={inputStyle} type="password" placeholder="New password"
              value={pwForm.next} onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))} />
            <input className={inputClass} style={inputStyle} type="password" placeholder="Confirm new password"
              value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} />
            <button onClick={handleChangePassword} className="w-full py-2 rounded text-sm font-medium"
              style={{ background: '#1E293B', color: '#8A9BB0' }}>
              Update Password
            </button>
          </div>
        </div>

        {/* Team Accounts — admin only */}
        {isAdmin && (
          <div className="pt-4 border-t" style={{ borderColor: '#1E293B' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8A9BB0' }}>Team Accounts</p>

            {/* Existing accounts list */}
            <div className="space-y-2 mb-4">
              {accounts.map((a) => {
                const isSelf = a.username === currentUser?.username;
                const isOnlyAdmin = a.role === 'admin' && adminCount <= 1;
                const canDelete = !isSelf && !isOnlyAdmin;
                return (
                  <div
                    key={a.username}
                    className="flex items-center justify-between px-3 py-2 rounded"
                    style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}
                  >
                    <div className="flex items-center gap-2">
                      {a.role === 'admin'
                        ? <Shield size={13} style={{ color: '#D4A843' }} />
                        : <User size={13} style={{ color: '#0D9488' }} />
                      }
                      <span className="text-sm" style={{ color: '#FAF3E0' }}>{a.username}</span>
                      {isSelf && (
                        <span className="text-xs" style={{ color: '#4A5568' }}>(you)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full capitalize"
                        style={{
                          color: a.role === 'admin' ? '#D4A843' : '#0D9488',
                          background: a.role === 'admin' ? '#D4A84322' : '#0D948822',
                        }}
                      >
                        {a.role}
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteAccount(a.username)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                          style={{ color: '#C0392B' }}
                          title="Remove account"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add employee form */}
            <div className="rounded p-3 space-y-2" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <UserPlus size={13} style={{ color: '#0D9488' }} />
                <p className="text-xs font-semibold" style={{ color: '#FAF3E0' }}>Add Employee Account</p>
              </div>
              {empSuccess && (
                <p className="text-xs p-1.5 rounded" style={{ color: '#0D9488', background: '#0D948811' }}>{empSuccess}</p>
              )}
              {empError && (
                <p className="text-xs p-1.5 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{empError}</p>
              )}
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="Username"
                value={empForm.username}
                onChange={(e) => setEmpForm((p) => ({ ...p, username: e.target.value }))}
              />
              <input
                className={inputClass}
                style={inputStyle}
                type="password"
                placeholder="Password"
                value={empForm.password}
                onChange={(e) => setEmpForm((p) => ({ ...p, password: e.target.value }))}
              />
              <input
                className={inputClass}
                style={inputStyle}
                type="password"
                placeholder="Confirm password"
                value={empForm.confirm}
                onChange={(e) => setEmpForm((p) => ({ ...p, confirm: e.target.value }))}
              />
              <button
                onClick={handleAddEmployee}
                className="w-full py-2 rounded text-sm font-medium"
                style={{ background: '#0D9488', color: '#FAF3E0' }}
              >
                Add Employee
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
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
