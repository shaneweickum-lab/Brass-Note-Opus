import { useState } from 'react';
import { X, Copy, Plus, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import RevisionDots from '../../shared/RevisionDots';
import { STAGE_LABELS, GENRE_CODES, VOCAL_CODES, COMMISSION_TYPES } from '../../../utils/constants';
import { formatDateFull, isRevisionWindowOpen, daysUntil } from '../../../utils/dateUtils';

const STAGE_ORDER = ['brief', 'architecture', 'generation', 'quality_review', 'delivery', 'archive'];

const COMM_TYPES = ['email_sent', 'call', 'revision_received', 'other'];

export default function CommissionDetail({ commission, onClose, onMoveStage, onAddRevision, onUpdateCommission, onAddCommLog }) {
  const [tab, setTab] = useState('overview');
  const [revSession, setRevSession] = useState(null);
  const [revForm, setRevForm] = useState({ lyricalChanges: false, productionChanges: false, notes: '' });
  const [commForm, setCommForm] = useState({ type: 'email_sent', notes: '' });
  const [copied, setCopied] = useState(false);

  const c = commission;
  const currentIdx = STAGE_ORDER.indexOf(c.stage);
  const canMoveBack = currentIdx > 0;
  const canMoveForward = currentIdx < STAGE_ORDER.length - 1;

  const totalRevisions = c.revisionsIncluded + (c.revisionPackSessions || 0);
  const revRemaining = totalRevisions - c.revisionsUsed;
  const windowOpen = isRevisionWindowOpen(c.revisionWindowEnd);

  const handleCopyLink = () => {
    if (c.deliveryLink) {
      navigator.clipboard.writeText(c.deliveryLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleAddRevision = () => {
    if (revRemaining <= 0) {
      alert('Revision pack required. All included sessions used.');
      return;
    }
    onAddRevision(c.internalId, revForm);
    setRevSession(null);
    setRevForm({ lyricalChanges: false, productionChanges: false, notes: '' });
  };

  const handleAddComm = () => {
    if (!commForm.notes) return;
    onAddCommLog(c.internalId, commForm);
    setCommForm({ type: 'email_sent', notes: '' });
  };

  const inputStyle = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
  const Lbl = ({ t }) => <p className="text-xs mb-1" style={{ color: '#8A9BB0' }}>{t}</p>;
  const Val = ({ v }) => <p className="text-sm mb-3" style={{ color: '#FAF3E0' }}>{v || '—'}</p>;

  return (
    <div
      className="fixed right-0 top-12 bottom-0 z-30 flex flex-col overflow-hidden"
      style={{ width: 480, background: '#0F172A', borderLeft: '1px solid #1E293B' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4 border-b" style={{ borderColor: '#1E293B' }}>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
            {c.clientName}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8A9BB0' }}>
            {c.id} · {COMMISSION_TYPES[c.commissionType]}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10" style={{ color: '#8A9BB0' }}>
          <X size={18} />
        </button>
      </div>

      {/* Stage bar */}
      <div className="flex items-center gap-1 px-5 py-3 border-b overflow-x-auto" style={{ borderColor: '#1E293B' }}>
        {STAGE_ORDER.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                color: s === c.stage ? '#FAF3E0' : '#4A5568',
                background: s === c.stage ? '#0D948844' : 'transparent',
                fontWeight: s === c.stage ? 600 : 400,
              }}
            >
              {STAGE_LABELS[s]}
            </span>
            {i < STAGE_ORDER.length - 1 && <ChevronRight size={12} style={{ color: '#2E3A4A' }} />}
          </div>
        ))}
      </div>

      {/* Move stage buttons */}
      <div className="flex gap-2 px-5 py-2 border-b" style={{ borderColor: '#1E293B' }}>
        <button
          onClick={() => onMoveStage(c.internalId, STAGE_ORDER[currentIdx - 1])}
          disabled={!canMoveBack}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded disabled:opacity-30 transition-colors"
          style={{ background: '#1E293B', color: '#8A9BB0' }}
        >
          <ChevronLeft size={12} />
          {canMoveBack ? STAGE_LABELS[STAGE_ORDER[currentIdx - 1]] : 'Back'}
        </button>
        <button
          onClick={() => onMoveStage(c.internalId, STAGE_ORDER[currentIdx + 1])}
          disabled={!canMoveForward}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded disabled:opacity-30 transition-colors"
          style={{ background: '#0D948822', color: '#0D9488', border: '1px solid #0D948833' }}
        >
          Move to {canMoveForward ? STAGE_LABELS[STAGE_ORDER[currentIdx + 1]] : '—'}
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: '#1E293B' }}>
        {['overview', 'songs', 'revisions', 'comms'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 text-xs font-medium capitalize transition-colors"
            style={{
              color: tab === t ? '#0D9488' : '#8A9BB0',
              borderBottom: tab === t ? '2px solid #0D9488' : '2px solid transparent',
            }}
          >
            {t === 'comms' ? 'Communications' : t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 gap-x-4">
              <div><Lbl t="Package" /><Val v={c.package} /></div>
              <div><Lbl t="Songs" /><Val v={c.songCount} /></div>
              <div><Lbl t="Email" /><Val v={c.clientEmail} /></div>
              <div><Lbl t="Phone" /><Val v={c.clientPhone} /></div>
              <div><Lbl t="Total Payment" /><Val v={c.totalPayment ? `$${c.totalPayment}` : '—'} /></div>
              <div><Lbl t="Songwriter Buyout" /><Val v={c.songwriterBuyout ? 'Yes' : 'No'} /></div>
              <div><Lbl t="Delivery Deadline" /><Val v={formatDateFull(c.deliveryDeadline)} /></div>
              <div><Lbl t="Delivered" /><Val v={formatDateFull(c.deliveredAt)} /></div>
              <div><Lbl t="Revision Window" />
                <p className="text-sm mb-3" style={{ color: windowOpen ? '#D4A843' : '#8A9BB0' }}>
                  {c.revisionWindowEnd
                    ? windowOpen
                      ? `${daysUntil(c.revisionWindowEnd)}d remaining`
                      : 'Closed'
                    : '—'}
                </p>
              </div>
              <div><Lbl t="Follow-Up Date" /><Val v={formatDateFull(c.followUpDate)} /></div>
            </div>

            {/* Delivery link */}
            <Lbl t="Delivery Link" />
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 rounded px-3 py-1.5 text-sm outline-none"
                style={inputStyle}
                value={c.deliveryLink || ''}
                onChange={(e) => onUpdateCommission(c.internalId, { deliveryLink: e.target.value })}
                placeholder="Paste download link..."
              />
              <button onClick={handleCopyLink} disabled={!c.deliveryLink}
                className="px-3 py-1.5 rounded text-sm disabled:opacity-40 transition-colors"
                style={{ background: '#1E293B', color: '#8A9BB0' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <Lbl t="Brief Summary" />
            <p className="text-sm mb-4" style={{ color: '#FAF3E0' }}>{c.briefSummary || '—'}</p>

            <Lbl t="Notes" />
            <textarea
              className="w-full rounded px-3 py-2 text-sm outline-none resize-none"
              style={inputStyle}
              rows={3}
              value={c.notes || ''}
              onChange={(e) => onUpdateCommission(c.internalId, { notes: e.target.value })}
              placeholder="Internal notes..."
            />

            <p className="text-xs mt-3" style={{ color: '#4A5568' }}>Created {formatDateFull(c.createdAt)}</p>
          </div>
        )}

        {tab === 'songs' && (
          <div className="space-y-4">
            {c.songs?.map((song, i) => {
              const upd = (field, value) => {
                const songs = [...(c.songs || [])];
                songs[i] = { ...songs[i], [field]: value };
                onUpdateCommission(c.internalId, { songs });
              };
              const sf = { background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' };
              const SInput = ({ field, placeholder, type = 'text', ...rest }) => (
                <input type={type} className="w-full rounded px-2 py-1.5 text-xs outline-none"
                  style={sf} value={song[field] ?? ''} placeholder={placeholder}
                  onChange={(e) => upd(field, type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)}
                  {...rest} />
              );
              const SArea = ({ field, placeholder, rows = 2 }) => (
                <textarea className="w-full rounded px-2 py-1.5 text-xs outline-none resize-none"
                  style={sf} rows={rows} value={song[field] || ''} placeholder={placeholder}
                  onChange={(e) => upd(field, e.target.value)} />
              );
              const FLbl = ({ t }) => <p className="text-xs mb-1" style={{ color: '#8A9BB0' }}>{t}</p>;

              return (
                <div key={song.songId} className="rounded-lg p-4 space-y-3" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono" style={{ color: '#0D9488' }}>{song.songId}</p>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#1E293B', color: '#8A9BB0' }}>
                      {song.deliveryStatus || 'pending'}
                    </span>
                  </div>

                  {/* Song Title */}
                  <div>
                    <FLbl t="Song Title" />
                    <SInput field="songTitle" placeholder="Song title..." />
                  </div>

                  {/* Genre + Sub-Genre */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FLbl t="Genre" />
                      <p className="text-xs px-2 py-1.5 rounded" style={{ background: '#1E293B', color: '#FAF3E0' }}>
                        {GENRE_CODES[song.genreCode] || '—'}
                      </p>
                    </div>
                    <div>
                      <FLbl t="Sub-Genre" />
                      <SInput field="subGenre" placeholder="e.g. Intimate Slow-Burn" />
                    </div>
                  </div>

                  {/* Vocal + Vocal Type */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FLbl t="Vocal" />
                      <p className="text-xs px-2 py-1.5 rounded" style={{ background: '#1E293B', color: '#FAF3E0' }}>
                        {VOCAL_CODES[song.vocalCode] || '—'}
                      </p>
                    </div>
                    <div>
                      <FLbl t="Vocal Type" />
                      <SInput field="vocalTypeDescription" placeholder="e.g. Male Tenor" />
                    </div>
                  </div>

                  {/* BPM + Time Sig + Mood */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <FLbl t="BPM" />
                      <SInput field="bpm" placeholder="72" type="number" min={40} max={300} />
                    </div>
                    <div>
                      <FLbl t="Time Sig" />
                      <SInput field="timeSig" placeholder="4/4" />
                    </div>
                    <div>
                      <FLbl t="Mood" />
                      <SInput field="mood" placeholder="Bittersweet Nostalgia" />
                    </div>
                  </div>

                  {/* Tension Arc */}
                  <div>
                    <FLbl t="Tension Arc" />
                    <SInput field="tensionArc" placeholder="e.g. Gradual Build, Explosive Chorus" />
                  </div>

                  {/* About the Song */}
                  <div>
                    <FLbl t="About the Song" />
                    <SArea field="aboutSong" placeholder="Occasion, story, emotional intent..." rows={3} />
                  </div>

                  {/* Instruments / Vocal Elements */}
                  <div>
                    <FLbl t="Instruments / Vocal Elements" />
                    <SArea field="instrumentsVocalElements" placeholder="e.g. Violin Obbligato, Tenor Sax, 808 Sub-Bass..." rows={2} />
                  </div>

                  {/* Production row */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: '#1E293B' }}>
                    <div>
                      <FLbl t="Suno Version" />
                      <SInput field="sunoVersion" placeholder="v5.5" />
                    </div>
                    <div>
                      <FLbl t="Generation #" />
                      <SInput field="generationNumber" placeholder="3" type="number" min={1} />
                    </div>
                  </div>

                  {/* Production Notes */}
                  <div>
                    <FLbl t="Production Notes" />
                    <SArea field="productionNotes" placeholder="Internal production notes..." rows={2} />
                  </div>
                </div>
              );
            })}
            {!c.songs?.length && (
              <p className="text-sm text-center py-6" style={{ color: '#4A5568' }}>No songs on this commission</p>
            )}
          </div>
        )}

        {tab === 'revisions' && (
          <div>
            {/* Counter */}
            <div className="rounded p-4 mb-4 text-center" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <RevisionDots included={totalRevisions} used={c.revisionsUsed} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: revRemaining <= 0 ? '#C0392B' : '#FAF3E0' }}>
                {revRemaining}
              </p>
              <p className="text-sm" style={{ color: '#8A9BB0' }}>
                {c.revisionsUsed} used · {totalRevisions} total
              </p>
              {revRemaining <= 0 && (
                <p className="text-xs mt-2 font-medium" style={{ color: '#C0392B' }}>
                  Revision pack required
                </p>
              )}
            </div>

            {/* Revision window */}
            <div className="rounded p-3 mb-4" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
              <p className="text-xs mb-1" style={{ color: '#8A9BB0' }}>Revision Window</p>
              <p className="text-sm" style={{ color: windowOpen ? '#D4A843' : '#8A9BB0' }}>
                {c.revisionWindowEnd
                  ? windowOpen
                    ? `Closes ${formatDateFull(c.revisionWindowEnd)} · ${daysUntil(c.revisionWindowEnd)}d remaining`
                    : `Closed ${formatDateFull(c.revisionWindowEnd)}`
                  : 'Not yet delivered'}
              </p>
            </div>

            {/* Add revision */}
            {revSession ? (
              <div className="rounded p-4 mb-4" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
                <p className="text-sm font-medium mb-3" style={{ color: '#FAF3E0' }}>Log Revision Session</p>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" checked={revForm.lyricalChanges}
                    onChange={(e) => setRevForm((f) => ({ ...f, lyricalChanges: e.target.checked }))} />
                  <span className="text-sm" style={{ color: '#FAF3E0' }}>Lyrical Changes</span>
                </label>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input type="checkbox" checked={revForm.productionChanges}
                    onChange={(e) => setRevForm((f) => ({ ...f, productionChanges: e.target.checked }))} />
                  <span className="text-sm" style={{ color: '#FAF3E0' }}>Production Changes</span>
                </label>
                <textarea
                  className="w-full rounded px-3 py-2 text-sm outline-none resize-none mb-3"
                  style={inputStyle} rows={2}
                  value={revForm.notes}
                  onChange={(e) => setRevForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Session notes..."
                />
                <div className="flex gap-2">
                  <button onClick={() => setRevSession(null)} className="flex-1 py-2 rounded text-sm"
                    style={{ background: '#1E293B', color: '#8A9BB0' }}>Cancel</button>
                  <button onClick={handleAddRevision} className="flex-1 py-2 rounded text-sm font-medium"
                    style={{ background: '#0D9488', color: '#FAF3E0' }}>Log Session</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setRevSession(true)}
                className="w-full py-2 rounded text-sm font-medium mb-4 transition-colors"
                style={{ background: '#0D948822', color: '#0D9488', border: '1px solid #0D948844' }}>
                + Log Revision Session
              </button>
            )}

            {/* Revision log */}
            {c.revisionLog?.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: '#8A9BB0' }}>Session History</p>
                <div className="space-y-2">
                  {c.revisionLog.map((r, i) => (
                    <div key={i} className="rounded p-2.5 text-xs" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
                      <p style={{ color: '#8A9BB0' }}>{new Date(r.date).toLocaleDateString()}</p>
                      <p style={{ color: '#FAF3E0' }}>
                        {r.lyricalChanges ? '📝 Lyrical ' : ''}{r.productionChanges ? '🎛️ Production' : ''}
                      </p>
                      {r.notes && <p className="mt-1" style={{ color: '#8A9BB0' }}>{r.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'comms' && (
          <div>
            <div className="rounded p-3 mb-4" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
              <select
                className="w-full rounded px-2 py-1.5 text-sm outline-none mb-2"
                style={inputStyle}
                value={commForm.type}
                onChange={(e) => setCommForm((f) => ({ ...f, type: e.target.value }))}
              >
                {COMM_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
              <textarea
                className="w-full rounded px-3 py-2 text-sm outline-none resize-none mb-2"
                style={inputStyle} rows={2}
                value={commForm.notes}
                onChange={(e) => setCommForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Add communication note..."
              />
              <button onClick={handleAddComm} className="w-full py-1.5 rounded text-sm font-medium transition-colors"
                style={{ background: '#0D948822', color: '#0D9488', border: '1px solid #0D948844' }}>
                + Log Communication
              </button>
            </div>

            <div className="space-y-2">
              {(c.communicationLog || []).slice().reverse().map((entry, i) => (
                <div key={i} className="rounded p-2.5 text-xs" style={{ background: '#0A0E1A', border: '1px solid #1E293B' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="capitalize" style={{ color: '#0D9488' }}>{entry.type?.replace('_', ' ')}</span>
                    <span style={{ color: '#4A5568' }}>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: '#FAF3E0' }}>{entry.notes}</p>
                </div>
              ))}
              {!c.communicationLog?.length && (
                <p className="text-xs text-center py-6" style={{ color: '#4A5568' }}>No communications logged</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
