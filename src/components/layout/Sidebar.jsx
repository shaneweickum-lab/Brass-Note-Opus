import { GitBranch, MessageSquare, RefreshCw, FlaskConical, CreditCard } from 'lucide-react';

const MODULES = [
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { id: 'comms', label: 'Communications', icon: MessageSquare },
  { id: 'revisions', label: 'Revisions', icon: RefreshCw },
  { id: 'labs', label: 'Labs', icon: FlaskConical },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
];

export default function Sidebar({ activeModule, setActiveModule, badges = {} }) {
  return (
    <aside
      className="fixed left-0 top-12 bottom-0 flex flex-col py-4 overflow-y-auto"
      style={{ width: 240, background: '#0F172A', borderRight: '1px solid #1E293B' }}
    >
      <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A9BB0' }}>
        Modules
      </p>
      {MODULES.map(({ id, label, icon: Icon }) => {
        const badge = badges[id];
        const isActive = activeModule === id;
        const accentColor = id === 'labs' ? '#4A148C' : '#0D9488';

        return (
          <button
            key={id}
            onClick={() => setActiveModule(id)}
            className="flex items-center justify-between px-4 py-2.5 mx-2 rounded text-sm font-medium transition-colors text-left"
            style={{
              color: isActive ? '#FAF3E0' : '#8A9BB0',
              background: isActive ? '#131D30' : 'transparent',
              borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Icon size={15} style={{ color: isActive ? accentColor : '#8A9BB0' }} />
              {label}
            </div>
            {badge > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                style={{ background: '#C0392B', color: '#FAF3E0', fontSize: 10 }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}

      <div className="mt-auto px-4 pt-4 border-t" style={{ borderColor: '#1E293B' }}>
        <p className="text-xs" style={{ color: '#8A9BB0' }}>
          Brass Note Labs
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#4A5568' }}>
          Preludio v1.0
        </p>
      </div>
    </aside>
  );
}
