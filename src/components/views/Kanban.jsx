import { useState } from 'react';
import StageColumn from '../modules/pipeline/StageColumn';
import CommissionDetail from '../modules/pipeline/CommissionDetail';
import NewCommissionForm from '../modules/pipeline/NewCommissionForm';
import LabsCard from '../modules/labs/LabsCard';
import LabsDetail from '../modules/labs/LabsDetail';
import NewExperiment from '../modules/labs/NewExperiment';
import EmptyState from '../shared/EmptyState';

const STAGE_ORDER = ['brief', 'architecture', 'generation', 'quality_review', 'delivery', 'archive'];

export default function Kanban({
  commissions, onMoveStage, onAddRevision, onUpdateCommission, onAddCommLog,
  onCreateCommission,
  labs, onCreateExperiment, onUpdateExperiment,
}) {
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [mode, setMode] = useState('client'); // 'client' | 'labs'
  const [selectedLab, setSelectedLab] = useState(null);
  const [showNewLab, setShowNewLab] = useState(false);

  const LAB_STAGES = ['scheduled', 'in_progress', 'analysis', 'complete', 'archived'];
  const LAB_STAGE_LABELS = { scheduled: 'Scheduled', in_progress: 'In Progress', analysis: 'Analysis', complete: 'Complete', archived: 'Archived' };
  const LAB_STAGE_COLORS = { scheduled: '#8A9BB0', in_progress: '#D4A843', analysis: '#0D9488', complete: '#1A5C38', archived: '#333' };

  return (
    <div className="h-full flex flex-col">
      {/* Mode toggle */}
      <div className="flex items-center gap-2 px-6 py-3 border-b" style={{ borderColor: '#1E293B' }}>
        <button onClick={() => setMode('client')}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          style={{ background: mode === 'client' ? '#0D948822' : 'transparent', color: mode === 'client' ? '#0D9488' : '#8A9BB0', border: mode === 'client' ? '1px solid #0D948844' : '1px solid transparent' }}>
          Client Pipeline
        </button>
        <button onClick={() => setMode('labs')}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          style={{ background: mode === 'labs' ? '#4A148C22' : 'transparent', color: mode === 'labs' ? '#9C4DCC' : '#8A9BB0', border: mode === 'labs' ? '1px solid #4A148C44' : '1px solid transparent' }}>
          Labs Pipeline
        </button>
        <div className="ml-auto">
          {mode === 'client' ? (
            <button onClick={() => setShowNewForm(true)}
              className="px-4 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ background: '#D4A843', color: '#0A0E1A' }}>
              + New Commission
            </button>
          ) : (
            <button onClick={() => setShowNewLab(true)}
              className="px-4 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ background: '#4A148C', color: '#FAF3E0' }}>
              + New Experiment
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 min-w-max h-full">
          {mode === 'client' ? (
            STAGE_ORDER.map((stage) => (
              <StageColumn
                key={stage}
                stage={stage}
                commissions={commissions.filter((c) => c.stage === stage)}
                onCardClick={(c) => { setSelectedCommission(c); setSelectedLab(null); }}
                onMoveStage={onMoveStage}
                onAddNew={stage === 'brief' ? () => setShowNewForm(true) : null}
              />
            ))
          ) : (
            LAB_STAGES.map((s) => (
              <div key={s} className="flex-shrink-0 flex flex-col rounded-lg overflow-hidden"
                style={{ width: 260, background: '#0A0E1A', border: '1px solid #1E293B' }}>
                <div className="flex items-center justify-between px-3 py-2.5"
                  style={{ background: '#0F172A', borderBottom: `2px solid ${LAB_STAGE_COLORS[s]}` }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: LAB_STAGE_COLORS[s] }} />
                    <span className="text-sm font-semibold" style={{ color: '#FAF3E0' }}>{LAB_STAGE_LABELS[s]}</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ color: LAB_STAGE_COLORS[s], background: `${LAB_STAGE_COLORS[s]}22` }}>
                    {labs.filter((l) => l.status === s).length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  {labs.filter((l) => l.status === s).map((l) => (
                    <LabsCard key={l.internalId} experiment={l}
                      onClick={() => { setSelectedLab(l); setSelectedCommission(null); }} />
                  ))}
                  {labs.filter((l) => l.status === s).length === 0 && (
                    <p className="text-center text-xs py-8" style={{ color: '#4A5568' }}>No experiments</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail panels */}
      {selectedCommission && (
        <CommissionDetail
          commission={commissions.find((c) => c.internalId === selectedCommission.internalId) || selectedCommission}
          onClose={() => setSelectedCommission(null)}
          onMoveStage={(id, stage) => { onMoveStage(id, stage); setSelectedCommission((prev) => ({ ...prev, stage })); }}
          onAddRevision={onAddRevision}
          onUpdateCommission={onUpdateCommission}
          onAddCommLog={onAddCommLog}
        />
      )}

      {selectedLab && (
        <LabsDetail
          experiment={labs.find((l) => l.internalId === selectedLab.internalId) || selectedLab}
          onClose={() => setSelectedLab(null)}
          onUpdate={onUpdateExperiment}
        />
      )}

      {showNewForm && (
        <NewCommissionForm
          onClose={() => setShowNewForm(false)}
          onSubmit={(data) => { onCreateCommission(data); setShowNewForm(false); }}
        />
      )}

      {showNewLab && (
        <NewExperiment
          onClose={() => setShowNewLab(false)}
          onSubmit={(data) => { onCreateExperiment(data); setShowNewLab(false); }}
        />
      )}
    </div>
  );
}
