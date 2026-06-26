import { Plus } from 'lucide-react';
import CommissionCard from './CommissionCard';
import { STAGE_COLORS, STAGE_LABELS } from '../../../utils/constants';

export default function StageColumn({ stage, commissions, onCardClick, onMoveStage, onAddNew }) {
  const color = STAGE_COLORS[stage];
  const isArchive = stage === 'archive';

  const sorted = [...commissions].sort((a, b) => {
    if (a.isRush && !b.isRush) return -1;
    if (!a.isRush && b.isRush) return 1;
    return 0;
  });

  return (
    <div
      className="flex-shrink-0 flex flex-col rounded-lg overflow-hidden"
      style={{ width: 260, background: '#0A0E1A', border: '1px solid #1E293B' }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ background: '#0F172A', borderBottom: `2px solid ${color}` }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-sm font-semibold" style={{ color: '#FAF3E0' }}>
            {STAGE_LABELS[stage]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{ color, background: `${color}22` }}
          >
            {commissions.length}
          </span>
          {stage === 'brief' && onAddNew && (
            <button
              onClick={onAddNew}
              className="p-0.5 rounded transition-colors hover:bg-white/10"
              style={{ color: '#D4A843' }}
              title="New Commission"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-xs" style={{ color: '#4A5568' }}>
            No commissions
          </div>
        ) : (
          sorted.map((c) => (
            <CommissionCard
              key={c.internalId}
              commission={c}
              onClick={() => onCardClick(c)}
              onMoveStage={onMoveStage}
            />
          ))
        )}
      </div>
    </div>
  );
}
