import { useState } from 'react';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import AppShell from './components/layout/AppShell';
import Dashboard from './components/views/Dashboard';
import Kanban from './components/views/Kanban';
import Calendar from './components/views/Calendar';
import SubList from './components/modules/subscriptions/SubList';
import DataPanel from './components/modules/data/DataPanel';
import Settings from './components/views/Settings';
import { useSettings } from './hooks/useSettings';
import { useAccounts } from './hooks/useAccounts';
import { useCommissions } from './hooks/useCommissions';
import { useLabs } from './hooks/useLabs';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useReminders } from './hooks/useReminders';
import { isOverdue, isTodayOrPast } from './utils/dateUtils';

// ─── Auth Screen ─────────────────────────────────────────────────────────────

function AuthScreen({ hasAccounts, onCreateAdmin, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'setup'
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('admin');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const isSetup = !hasAccounts;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const u = username.trim();
    if (!u) { setError('Please enter a username.'); return; }
    if (!pw) { setError('Please enter a password.'); return; }

    if (isSetup) {
      if (pw !== confirm) { setError('Passwords do not match.'); return; }
      try {
        onCreateAdmin(u, pw);
      } catch (err) {
        setError(err.message);
      }
    } else {
      const ok = onLogin(u, role, pw);
      if (!ok) setError('Invalid username, role, or password.');
    }
  };

  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
  const inputClass = 'w-full rounded px-3 py-2 text-sm outline-none';

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0E1A' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#D4A843', fontFamily: 'Playfair Display, serif' }}>
            Preludio
          </h1>
          <p className="text-sm" style={{ color: '#8A9BB0' }}>Brass Note Labs · Internal Operations</p>
        </div>

        <div className="rounded-xl p-6" style={{ background: '#0F172A', border: '1px solid #1E293B' }}>
          {isSetup && (
            <p className="text-xs mb-4 p-2 rounded" style={{ color: '#D4A843', background: '#D4A84311' }}>
              First time setup — create your admin account.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-xs p-2 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{error}</p>
            )}

            <div>
              <label className="text-xs block mb-1" style={{ color: '#8A9BB0' }}>Username</label>
              <input
                className={inputClass}
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
                autoComplete="username"
              />
            </div>

            {/* Role selector — hidden during first-run setup (always admin) */}
            {!isSetup && (
              <div>
                <label className="text-xs block mb-1" style={{ color: '#8A9BB0' }}>Role</label>
                <div className="flex rounded overflow-hidden" style={{ border: '1px solid #1E293B' }}>
                  {['admin', 'employee'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className="flex-1 py-2 text-sm font-medium capitalize transition-colors"
                      style={{
                        background: role === r ? '#D4A843' : '#0A0E1A',
                        color: role === r ? '#0A0E1A' : '#8A9BB0',
                      }}
                    >
                      {r === 'admin' ? 'Admin' : 'Employee'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs block mb-1" style={{ color: '#8A9BB0' }}>Password</label>
              <input
                className={inputClass}
                style={inputStyle}
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Password"
                autoComplete={isSetup ? 'new-password' : 'current-password'}
              />
            </div>

            {isSetup && (
              <div>
                <label className="text-xs block mb-1" style={{ color: '#8A9BB0' }}>Confirm Password</label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded text-sm font-semibold"
              style={{ background: '#D4A843', color: '#0A0E1A' }}
            >
              {isSetup ? 'Create Admin Account' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { settings, updateSettings, nextClientNumber, nextGlobalSongNumber, nextLabsGlobalNumber } = useSettings();
  const { accounts, hasAccounts, adminCount, createAccount, deleteAccount, updatePassword, login } = useAccounts();
  const { commissions, createCommission, updateCommission, moveStage, addRevision, addCommLog, replaceAllCommissions, mergeCommissions } = useCommissions();
  const { labs, createExperiment, updateExperiment, replaceAllLabs, mergeLabs } = useLabs();
  const { subscriptions, createSubscription, updateSubscription, deleteSubscription, monthlyTotal, replaceAllSubscriptions, mergeSubscriptions } = useSubscriptions();
  const { reminders, createReminder } = useReminders();

  const [currentUser, setCurrentUser] = useState(null); // { username, role }
  const [activeView, setActiveView] = useState('dashboard');
  const [activeModule, setActiveModule] = useState('pipeline');
  const [showSettings, setShowSettings] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  // ── Auth handlers ──────────────────────────────────────────────────────────

  const handleCreateAdmin = (username, password) => {
    createAccount(username, password, 'admin'); // throws if duplicate
    const user = login(username, 'admin', password);
    setCurrentUser(user);
  };

  const handleLogin = (username, role, password) => {
    const user = login(username, role, password);
    if (user) { setCurrentUser(user); return true; }
    return false;
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
    setActiveModule('pipeline');
  };

  if (!currentUser) {
    return (
      <AuthScreen
        hasAccounts={hasAccounts}
        onCreateAdmin={handleCreateAdmin}
        onLogin={handleLogin}
      />
    );
  }

  // ── App logic ──────────────────────────────────────────────────────────────

  const overdueCount = commissions.filter((c) => isOverdue(c.deliveryDeadline, c.stage)).length;
  const followupsDue = commissions.filter((c) => c.followUpDate && isTodayOrPast(c.followUpDate) && !c.followUpDismissed).length;
  const badges = {
    pipeline: overdueCount,
    comms: followupsDue,
    revisions: commissions.filter((c) => c.revisionsUsed >= (c.revisionsIncluded + (c.revisionPackSessions || 0))).length,
  };

  const handleCreateCommission = (formData) => {
    const clientNum = nextClientNumber();
    const songStart = nextGlobalSongNumber();
    for (let i = 1; i < formData.songCount; i++) nextGlobalSongNumber();
    createCommission(formData, clientNum, songStart, settings);
  };

  const handleCreateExperiment = (formData) => {
    const labsNum = nextLabsGlobalNumber();
    createExperiment(formData, labsNum);
  };

  const handleImport = (data, mode) => {
    if (mode === 'replace') {
      replaceAllCommissions(data.commissions);
      replaceAllLabs(data.labs);
      replaceAllSubscriptions(data.subscriptions);
    } else {
      mergeCommissions(data.commissions);
      mergeLabs(data.labs);
      mergeSubscriptions(data.subscriptions);
    }
    const maxSong = data.commissions.flatMap((c) => c.songs || []).reduce((m, s) => Math.max(m, s.globalNumber || 0), 0);
    const maxLabs = data.labs.reduce((m, l) => Math.max(m, l.labsGlobalNumber || 0), 0);
    const updates = {};
    if (maxSong > (settings.lastGlobalSongNumber || 0)) updates.lastGlobalSongNumber = maxSong;
    if (maxLabs > (settings.lastLabsGlobalNumber || 0)) updates.lastLabsGlobalNumber = maxLabs;
    if (mode === 'replace') updates.lastClientNumber = data.commissions.length;
    if (Object.keys(updates).length) updateSettings(updates);
  };

  const renderContent = () => {
    if (activeModule === 'subscriptions') {
      return (
        <SubList
          subscriptions={subscriptions}
          monthlyTotal={monthlyTotal}
          onAdd={createSubscription}
          onUpdate={updateSubscription}
          onDelete={deleteSubscription}
        />
      );
    }

    if (activeModule === 'data') {
      return (
        <DataPanel
          commissions={commissions}
          subscriptions={subscriptions}
          labs={labs}
          onImport={handleImport}
          userRole={currentUser.role}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            commissions={commissions}
            labs={labs}
            subscriptions={subscriptions}
            monthlyTotal={monthlyTotal}
          />
        );
      case 'kanban':
        return (
          <Kanban
            commissions={commissions}
            onMoveStage={moveStage}
            onAddRevision={addRevision}
            onUpdateCommission={updateCommission}
            onAddCommLog={addCommLog}
            onCreateCommission={handleCreateCommission}
            labs={labs}
            onCreateExperiment={handleCreateExperiment}
            onUpdateExperiment={updateExperiment}
          />
        );
      case 'calendar':
        return (
          <Calendar
            commissions={commissions}
            labs={labs}
            subscriptions={subscriptions}
            reminders={reminders}
            onAddReminder={createReminder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A' }}>
      <TopNav
        activeView={activeView}
        setActiveView={(v) => { setActiveView(v); setActiveModule('pipeline'); }}
        currentUser={currentUser}
        onSettings={() => setShowSettings(true)}
        onSignOut={handleSignOut}
      />
      <Sidebar
        activeModule={activeModule}
        setActiveModule={(m) => setActiveModule(m)}
        badges={badges}
        userRole={currentUser.role}
      />
      <AppShell>
        {renderContent()}
      </AppShell>

      {showSettings && (
        <Settings
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
          currentUser={currentUser}
          accounts={accounts}
          adminCount={adminCount}
          onAddEmployee={(username, password) => createAccount(username, password, 'employee')}
          onDeleteAccount={deleteAccount}
          onUpdatePassword={updatePassword}
        />
      )}
    </div>
  );
}
