import { EXPERIMENT_CODES } from '../../../utils/constants';
import { formatDate } from '../../../utils/dateUtils';

const STATUS_COLORS = { scheduled: '#8A9BB0', in_progress: '#D4A843', analysis: '#0D9488', complete: '#1A5C38', archived: '#333' };
const RESULT_COLORS = { PASS: '#1A5C38', FAIL: '#C0392B', PARTIAL: '#D4A843', ANOMALY: '#4A148C' };

export default function LabsCard({ experiment, onClick }) {
  const e = experiment;
  const statusColor = STATUS_COLORS[e.status] || '#8A9BB0';
  const resultColor = e.resultCode ? RESULT_COLORS[e.resultCode] : null;

  return (
    <div onClick={onClick} className="rounded-lg p-3 cursor-pointer transition-all"
      style={{ background: '#0F172A', border: resultColor ? `1px solid ${resultColor}44` : '1px solid #1E293B', borderLeft: `3px solid #4A148C` }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: '#4A148C', background: '#4A148C22' }}>
          {e.experimentCode}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded capitalize"
          style={{ color: statusColor, background: `${statusColor}22` }}>
          {e.status?.replace('_', ' ')}
        </span>
        {e.resultCode && (
          <span className="text-xs px-1.5 py-0.5 rounded font-bold ml-auto"
            style={{ color: resultColor, background: `${resultColor}22` }}>
            {e.resultCode}
          </span>
        )}
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
        {EXPERIMENT_CODES[e.experimentCode]}
      </p>
      <p className="text-xs mb-2 line-clamp-2" style={{ color: '#8A9BB0' }}>{e.hypothesis}</p>
      <div className="flex items-center justify-between text-xs" style={{ color: '#4A5568' }}>
        <span>{formatDate(e.date)}</span>
        <span className="font-mono" style={{ fontSize: 10 }}>{e.id?.split('-').slice(-1)[0]}</span>
      </div>
    </div>
  );
}
