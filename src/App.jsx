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
import { useCommissions } from './hooks/useCommissions';
import { useLabs } from './hooks/useLabs';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useReminders } from './hooks/useReminders';
import { isOverdue, isTodayOrPast, verifyPassword } from './utils/dateUtils';

function AuthGate({ hasPassword, onSetPassword, onAuth }) {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const setting = !hasPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (setting) {
      if (!pw) { setError('Please enter a password.'); return; }
      if (pw !== confirm) { setError('Passwords do not match.'); return; }
      onSetPassword(pw);
      onAuth(null, true);
    } else {
      const ok = onAuth(pw, false);
      if (!ok) setError('Incorrect password.');
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm p-2 rounded" style={{ color: '#C0392B', background: '#C0392B11' }}>{error}</p>}
            {setting && (
              <p className="text-xs" style={{ color: '#8A9BB0' }}>First time setup — set your access password.</p>
            )}
            <div>
              <label className="text-xs block mb-1" style={{ color: '#8A9BB0' }}>
                {setting ? 'Set Password' : 'Password'}
              </label>
              <input type="password" className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{ background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' }}
                value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" autoFocus />
            </div>
            {setting && (
              <div>
                <label className="text-xs block mb-1" style={{ color: '#8A9BB0' }}>Confirm Password</label>
                <input type="password" className="w-full rounded px-3 py-2 text-sm outline-none"
                  style={{ background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' }}
                  value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm" />
              </div>
            )}
            <button type="submit" className="w-full py-2.5 rounded text-sm font-semibold"
              style={{ background: '#D4A843', color: '#0A0E1A' }}>
              {setting ? 'Set Password & Enter' : 'Enter Preludio'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { settings, updateSettings, nextClientNumber, nextGlobalSongNumber, nextLabsGlobalNumber, setPassword, isPasswordSet } = useSettings();
  const { commissions, createCommission, updateCommission, moveStage, addRevision, addCommLog, replaceAllCommissions, mergeCommissions } = useCommissions();
  const { labs, createExperiment, updateExperiment, replaceAllLabs, mergeLabs } = useLabs();
  const { subscriptions, createSubscription, updateSubscription, deleteSubscription, monthlyTotal, replaceAllSubscriptions, mergeSubscriptions } = useSubscriptions();
  const { reminders, createReminder } = useReminders();

  const [authed, setAuthed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [activeModule, setActiveModule] = useState('pipeline');
  const [showSettings, setShowSettings] = useState(false);

  const handleAuth = (pw, isSetup) => {
    if (isSetup || !isPasswordSet) { setAuthed(true); return true; }
    if (verifyPassword(pw, settings.appPassword)) { setAuthed(true); return true; }
    return false;
  };

  if (!authed) {
    return (
      <AuthGate
        hasPassword={isPasswordSet}
        onSetPassword={setPassword}
        onAuth={handleAuth}
      />
    );
  }

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

  const handleSidebarModule = (m) => {
    setActiveModule(m);
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

    // Update global number counters so new items don't collide
    const maxSong = data.commissions.flatMap((c) => c.songs || []).reduce((m, s) => Math.max(m, s.globalNumber || 0), 0);
    const maxLabs = data.labs.reduce((m, l) => Math.max(m, l.labsGlobalNumber || 0), 0);
    const updates = {};
    if (maxSong > (settings.lastGlobalSongNumber || 0)) updates.lastGlobalSongNumber = maxSong;
    if (maxLabs > (settings.lastLabsGlobalNumber || 0)) updates.lastLabsGlobalNumber = maxLabs;
    if (mode === 'replace') {
      updates.lastClientNumber = data.commissions.length;
    }
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
        role={settings.currentUserRole}
        onSettings={() => setShowSettings(true)}
      />
      <Sidebar
        activeModule={activeModule}
        setActiveModule={handleSidebarModule}
        badges={badges}
      />
      <AppShell>
        {renderContent()}
      </AppShell>

      {showSettings && (
        <Settings
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
