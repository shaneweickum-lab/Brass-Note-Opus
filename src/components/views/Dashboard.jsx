import { AlertCircle, Clock, RotateCcw, FlaskConical, CreditCard, Package, Users, Bell } from 'lucide-react';
import { isOverdue, isDueThisWeek, isRevisionWindowOpen, isTodayOrPast, isWithinDays, formatDate } from '../../utils/dateUtils';

function KPICard({ label, value, sub, color = '#0D9488', icon: Icon, danger }) {
  return (
    <div className="rounded-lg p-4" style={{ background: '#0F172A', border: `1px solid ${danger ? '#C0392B33' : '#1E293B'}` }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium" style={{ color: '#8A9BB0' }}>{label}</p>
        {Icon && <Icon size={16} style={{ color: danger ? '#C0392B' : color }} />}
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: danger ? '#C0392B' : '#FAF3E0' }}>
        {value}
      </p>
      {sub && <p className="text-xs" style={{ color: '#8A9BB0' }}>{sub}</p>}
    </div>
  );
}

function TaskItem({ label, type, meta }) {
  const typeColors = {
    overdue: '#C0392B', revision: '#D4A843', followup: '#0D9488',
    renewal: '#C0392B', labs: '#4A148C',
  };
  const color = typeColors[type] || '#8A9BB0';
  return (
    <div className="flex items-start gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#1E293B' }}>
      <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: '#FAF3E0' }}>{label}</p>
        {meta && <p className="text-xs mt-0.5" style={{ color: '#8A9BB0' }}>{meta}</p>}
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 capitalize"
        style={{ color, background: `${color}22`, border: `1px solid ${color}33` }}>
        {type}
      </span>
    </div>
  );
}

export default function Dashboard({ commissions, labs, subscriptions, monthlyTotal }) {
  const active = commissions.filter((c) => c.stage !== 'archive');
  const overdue = commissions.filter((c) => isOverdue(c.deliveryDeadline, c.stage));
  const dueThisWeek = commissions.filter((c) => isDueThisWeek(c.deliveryDeadline) && c.stage !== 'delivery' && c.stage !== 'archive');
  const inRevWindow = commissions.filter((c) => c.stage === 'delivery' && isRevisionWindowOpen(c.revisionWindowEnd));
  const labsThisWeek = labs.filter((l) => isDueThisWeek(l.date));
  const revPacksSold = commissions.filter((c) => c.revisionPackPurchased).length;
  const followupsDue = commissions.filter((c) => c.followUpDate && isTodayOrPast(c.followUpDate) && !c.followUpDismissed);

  // Today's tasks
  const tasks = [];
  overdue.forEach((c) => tasks.push({ key: c.internalId + 'o', label: `${c.clientName} is overdue`, type: 'overdue', meta: formatDate(c.deliveryDeadline) }));
  commissions.filter((c) => c.revisionWindowEnd && isWithinDays(c.revisionWindowEnd, 1)).forEach((c) =>
    tasks.push({ key: c.internalId + 'r', label: `Revision window closing — ${c.clientName}`, type: 'revision', meta: `Closes ${formatDate(c.revisionWindowEnd)}` })
  );
  followupsDue.forEach((c) => tasks.push({ key: c.internalId + 'f', label: `Follow up with ${c.clientName}`, type: 'followup' }));
  subscriptions.filter((s) => s.status === 'active' && s.dueDate).forEach((s) => {
    const now = new Date();
    const due = new Date(now.getFullYear(), now.getMonth(), s.dueDate);
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    if (diff >= -1 && diff <= 7) {
      tasks.push({ key: s.id + 'sub', label: `${s.name} renewal`, type: 'renewal', meta: `$${s.monthlyCost}/mo · Day ${s.dueDate}` });
    }
  });
  labsThisWeek.forEach((l) => tasks.push({ key: l.internalId + 'l', label: `Labs: ${l.experimentCode}`, type: 'labs', meta: formatDate(l.date) }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
          Good morning
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8A9BB0' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard label="Active Commissions" value={active.length} icon={Package} />
        <KPICard label="Due This Week" value={dueThisWeek.length} icon={Clock} color="#D4A843" />
        <KPICard label="Overdue" value={overdue.length} icon={AlertCircle} danger={overdue.length > 0} />
        <KPICard label="In Revision Window" value={inRevWindow.length} icon={RotateCcw} color="#D4A843" />
        <KPICard label="Labs This Week" value={labsThisWeek.length} icon={FlaskConical} color="#4A148C" />
        <KPICard label="Monthly Spend" value={`$${monthlyTotal.toFixed(0)}`} sub="active subscriptions" icon={CreditCard} color="#D4A843" />
        <KPICard label="Revision Packs Sold" value={revPacksSold} icon={Users} />
        <KPICard label="Follow-ups Due" value={followupsDue.length} icon={Bell} danger={followupsDue.length > 0} />
      </div>

      {/* Today's tasks */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #1E293B' }}>
        <div className="px-4 py-3" style={{ background: '#0F172A', borderBottom: '1px solid #1E293B' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#FAF3E0' }}>Today's Tasks</h2>
        </div>
        <div className="px-4" style={{ background: '#0A0E1A' }}>
          {tasks.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#4A5568' }}>No tasks for today</p>
          ) : (
            tasks.map((t) => <TaskItem key={t.key} {...t} />)
          )}
        </div>
      </div>
    </div>
  );
}
