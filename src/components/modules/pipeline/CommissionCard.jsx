import { Zap, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import RevisionDots from '../../shared/RevisionDots';
import { isOverdue, daysOverdue, formatDate } from '../../../utils/dateUtils';
import { GENRE_CODES, VOCAL_CODES, COMMISSION_TYPES, STAGE_LABELS, STAGES } from '../../../utils/constants';

const STAGE_ORDER = ['brief', 'architecture', 'generation', 'quality_review', 'delivery', 'archive'];

export default function CommissionCard({ commission, onClick, onMoveStage }) {
  const { stage, deliveryDeadline, isRush, revisionsIncluded, revisionsUsed, id } = commission;
  const overdue = isOverdue(deliveryDeadline, stage);
  const daysOver = overdue ? daysOverdue(deliveryDeadline) : 0;

  const currentIdx = STAGE_ORDER.indexOf(stage);
  const canMoveBack = currentIdx > 0;
  const canMoveForward = currentIdx < STAGE_ORDER.length - 1;

  const handleMoveBack = (e) => {
    e.stopPropagation();
    if (canMoveBack) onMoveStage(commission.internalId, STAGE_ORDER[currentIdx - 1]);
  };
  const handleMoveForward = (e) => {
    e.stopPropagation();
    if (canMoveForward) onMoveStage(commission.internalId, STAGE_ORDER[currentIdx + 1]);
  };

  const genreLabel = GENRE_CODES[commission.songs?.[0]?.genreCode] || commission.genre || '—';
  const vocalLabel = VOCAL_CODES[commission.songs?.[0]?.vocalCode] || commission.vocalType || '—';
  const typeLabel = COMMISSION_TYPES[commission.commissionType] || commission.commissionType;

  return (
    <div
      onClick={onClick}
      className="rounded-lg p-3 cursor-pointer transition-all duration-150 select-none"
      style={{
        background: '#0F172A',
        border: overdue
          ? '1px solid #C0392B'
          : isRush
          ? '1px solid #D4A843'
          : '1px solid #1E293B',
        borderLeft: overdue
          ? '3px solid #C0392B'
          : isRush
          ? '3px solid #D4A843'
          : '3px solid #1E293B',
      }}
    >
      {/* Badges row */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {isRush && (
          <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ color: '#D4A843', background: '#D4A84322', border: '1px solid #D4A84444' }}>
            <Zap size={10} /> Rush
          </span>
        )}
        <span className="text-xs px-1.5 py-0.5 rounded-full"
          style={{ color: '#0D9488', background: '#0D948822', border: '1px solid #0D948844' }}>
          {typeLabel}
        </span>
        {overdue && (
          <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ color: '#C0392B', background: '#C0392B22', border: '1px solid #C0392B44' }}>
            <AlertCircle size={10} /> {daysOver}d overdue
          </span>
        )}
      </div>

      {/* Client name */}
      <p className="font-semibold text-sm mb-0.5" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
        {commission.clientName}
      </p>
      <p className="text-xs mb-2" style={{ color: '#8A9BB0' }}>
        {commission.package} · {commission.songCount} {commission.songCount === 1 ? 'song' : 'songs'}
      </p>

      {/* Genre/Vocal tags */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: '#0D9488', background: '#0D948818' }}>
          {genreLabel}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: '#0D9488', background: '#0D948818' }}>
          {vocalLabel}
        </span>
      </div>

      {/* Revision dots */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <RevisionDots included={revisionsIncluded} used={revisionsUsed} />
          <span className="text-xs" style={{ color: revisionsUsed >= revisionsIncluded ? '#C0392B' : '#8A9BB0' }}>
            {revisionsUsed}/{revisionsIncluded} rev
          </span>
        </div>
      </div>

      {/* Deadline + ID */}
      <div className="flex items-center justify-between text-xs" style={{ color: '#8A9BB0' }}>
        <span>Due: {formatDate(deliveryDeadline)}</span>
        <span className="font-mono text-xs" style={{ color: '#4A5568', fontSize: 10 }}>{id}</span>
      </div>

      {/* Stage move buttons */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: '#1E293B' }}
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleMoveBack}
          disabled={!canMoveBack}
          className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded transition-colors disabled:opacity-30"
          style={{ color: '#8A9BB0', background: '#1E293B' }}
        >
          <ChevronLeft size={12} />
          {canMoveBack ? STAGE_LABELS[STAGE_ORDER[currentIdx - 1]] : ''}
        </button>
        <button
          onClick={handleMoveForward}
          disabled={!canMoveForward}
          className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded transition-colors disabled:opacity-30"
          style={{ color: '#0D9488', background: '#0D948818', border: '1px solid #0D948833' }}
        >
          {canMoveForward ? STAGE_LABELS[STAGE_ORDER[currentIdx + 1]] : ''}
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
