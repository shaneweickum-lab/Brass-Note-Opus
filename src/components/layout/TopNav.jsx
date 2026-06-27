import { LayoutDashboard, Columns, Calendar, Settings, LogOut, UserCircle } from 'lucide-react';

const VIEWS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'kanban', label: 'Kanban', icon: Columns },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

export default function TopNav({ activeView, setActiveView, currentUser, onSettings, onSignOut }) {
  const roleColor = currentUser?.role === 'admin' ? '#D4A843' : '#0D9488';
  const roleBg = currentUser?.role === 'admin' ? '#D4A84322' : '#0D948822';
  const roleBorder = currentUser?.role === 'admin' ? '#D4A84344' : '#0D948844';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4"
      style={{ height: 48, background: '#0A0E1A', borderBottom: '1px solid #1E293B' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-wide" style={{ color: '#D4A843', fontFamily: 'Playfair Display, serif' }}>
          BNStudio
        </span>
        <span className="text-xs hidden sm:block" style={{ color: '#8A9BB0' }}>
          Brass Note Labs
        </span>
      </div>

      <nav className="flex items-center gap-1">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              color: activeView === id ? '#D4A843' : '#8A9BB0',
              background: activeView === id ? '#D4A84322' : 'transparent',
              border: activeView === id ? '1px solid #D4A84344' : '1px solid transparent',
            }}
          >
            <Icon size={14} />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {currentUser && (
          <div className="flex items-center gap-1.5">
            <UserCircle size={14} style={{ color: '#8A9BB0' }} />
            <span className="text-xs hidden sm:block" style={{ color: '#FAF3E0' }}>
              {currentUser.username}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full capitalize"
              style={{ color: roleColor, background: roleBg, border: `1px solid ${roleBorder}` }}
            >
              {currentUser.role}
            </span>
          </div>
        )}
        <button
          onClick={onSettings}
          className="p-1.5 rounded transition-colors hover:bg-white/10"
          style={{ color: '#8A9BB0' }}
          title="Settings"
        >
          <Settings size={16} />
        </button>
        <button
          onClick={onSignOut}
          className="p-1.5 rounded transition-colors hover:bg-white/10"
          style={{ color: '#8A9BB0' }}
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
