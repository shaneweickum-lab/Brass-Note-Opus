import { useState } from 'react';
import { Plus, Edit2, Trash2, Pause, Play } from 'lucide-react';
import SubForm from './SubForm';
import EmptyState from '../../shared/EmptyState';
import { SUBSCRIPTION_CATEGORIES } from '../../../utils/constants';

export default function SubList({ subscriptions, monthlyTotal, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const active = subscriptions.filter((s) => s.status === 'active');
  const paused = subscriptions.filter((s) => s.status === 'paused');
  const cancelled = subscriptions.filter((s) => s.status === 'cancelled');

  const handleSubmit = (form) => {
    if (editing) {
      onUpdate(editing.id, form);
      setEditing(null);
    } else {
      onAdd(form);
      setShowForm(false);
    }
  };

  const SubRow = ({ sub }) => (
    <div className="flex items-center justify-between px-4 py-3 rounded transition-colors"
      style={{ background: '#0F172A', border: '1px solid #1E293B' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium truncate" style={{ color: '#FAF3E0' }}>{sub.name}</p>
          <span className="text-xs px-1.5 py-0.5 rounded capitalize"
            style={{ color: '#8A9BB0', background: '#1E293B' }}>
            {SUBSCRIPTION_CATEGORIES[sub.category] || sub.category}
          </span>
        </div>
        <p className="text-xs" style={{ color: '#8A9BB0' }}>
          Due day {sub.dueDate} · {sub.autoRenew ? 'Auto-renews' : 'Manual'}
          {sub.notes ? ` · ${sub.notes}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <span className="text-sm font-semibold" style={{ color: sub.status === 'active' ? '#D4A843' : '#8A9BB0' }}>
          ${sub.monthlyCost?.toFixed(2)}/mo
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditing(sub); setShowForm(false); }}
            className="p-1 rounded hover:bg-white/10" style={{ color: '#8A9BB0' }}>
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onUpdate(sub.id, { status: sub.status === 'paused' ? 'active' : 'paused' })}
            className="p-1 rounded hover:bg-white/10" style={{ color: '#8A9BB0' }}>
            {sub.status === 'paused' ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button onClick={() => onDelete(sub.id)}
            className="p-1 rounded hover:bg-white/10" style={{ color: '#C0392B' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
            Subscriptions
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#8A9BB0' }}>
            Monthly total: <span style={{ color: '#D4A843' }}>${monthlyTotal.toFixed(2)}</span>
          </p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors"
          style={{ background: '#D4A843', color: '#0A0E1A' }}>
          <Plus size={14} /> Add Subscription
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <EmptyState icon="💳" title="No subscriptions" description="Track your recurring costs here" />
      ) : (
        <>
          {active.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#0D9488' }}>
                Active ({active.length})
              </p>
              <div className="space-y-2">{active.map((s) => <SubRow key={s.id} sub={s} />)}</div>
            </div>
          )}
          {paused.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8A9BB0' }}>
                Paused ({paused.length})
              </p>
              <div className="space-y-2">{paused.map((s) => <SubRow key={s.id} sub={s} />)}</div>
            </div>
          )}
          {cancelled.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#4A5568' }}>
                Cancelled
              </p>
              <div className="space-y-2">{cancelled.map((s) => <SubRow key={s.id} sub={s} />)}</div>
            </div>
          )}
        </>
      )}

      {(showForm) && <SubForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
      {editing && <SubForm existing={editing} onClose={() => setEditing(null)} onSubmit={handleSubmit} />}
    </div>
  );
}
