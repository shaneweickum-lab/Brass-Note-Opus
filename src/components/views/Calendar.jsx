import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Modal from '../shared/Modal';
import { getMonthDays, sameDay, formatDateFull } from '../../utils/dateUtils';
import { generateUUID } from '../../utils/idGenerator';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EVENT_TYPES = [
  { key: 'delivery', color: '#D4A843', label: 'Delivery' },
  { key: 'revision', color: '#E67E22', label: 'Revision Window' },
  { key: 'followup', color: '#0D9488', label: 'Follow-Up' },
  { key: 'labs', color: '#4A148C', label: 'Labs' },
  { key: 'renewal', color: '#C0392B', label: 'Renewal' },
  { key: 'custom', color: '#8A9BB0', label: 'Custom' },
];

function buildEvents(commissions, labs, subscriptions, reminders) {
  const events = [];
  const now = new Date();

  commissions.forEach((c) => {
    if (c.deliveryDeadline) events.push({ date: new Date(c.deliveryDeadline), type: 'delivery', label: c.clientName, sub: `${c.songCount} song${c.songCount > 1 ? 's' : ''}`, id: c.internalId });
    if (c.revisionWindowEnd) events.push({ date: new Date(c.revisionWindowEnd), type: 'revision', label: c.clientName, sub: 'Revision window closes', id: c.internalId + 'r' });
    if (c.followUpDate && !c.followUpDismissed) events.push({ date: new Date(c.followUpDate), type: 'followup', label: c.clientName, sub: 'Follow-up reminder', id: c.internalId + 'f' });
  });

  labs.forEach((l) => {
    if (l.date) events.push({ date: new Date(l.date), type: 'labs', label: l.experimentCode, sub: l.experimentName || '', id: l.internalId });
  });

  subscriptions.filter((s) => s.status === 'active').forEach((s) => {
    const d = new Date(now.getFullYear(), now.getMonth(), s.dueDate);
    events.push({ date: d, type: 'renewal', label: s.name, sub: `$${s.monthlyCost}/mo`, id: s.id });
    const next = new Date(now.getFullYear(), now.getMonth() + 1, s.dueDate);
    events.push({ date: next, type: 'renewal', label: s.name, sub: `$${s.monthlyCost}/mo`, id: s.id + 'n' });
  });

  reminders.filter((r) => !r.dismissed).forEach((r) => {
    events.push({ date: new Date(r.date), type: 'custom', label: r.label, sub: r.type, id: r.id });
  });

  return events;
}

export default function Calendar({ commissions, labs, subscriptions, reminders, onAddReminder }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [newReminder, setNewReminder] = useState(null);
  const [reminderForm, setReminderForm] = useState({ label: '', type: 'custom' });

  const events = buildEvents(commissions, labs, subscriptions, reminders);
  const days = getMonthDays(year, month);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  const eventsForDay = (day) => events.filter((e) => sameDay(e.date, day));

  const typeColor = (type) => EVENT_TYPES.find((t) => t.key === type)?.color || '#8A9BB0';

  const handleDayClick = (day) => {
    if (!day) return;
    const iso = day.toISOString().slice(0, 10);
    setNewReminder(iso);
    setReminderForm({ label: '', type: 'custom' });
  };

  const handleAddReminder = () => {
    if (!reminderForm.label) return;
    onAddReminder({ date: newReminder, ...reminderForm });
    setNewReminder(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded hover:bg-white/10" style={{ color: '#8A9BB0' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
            className="px-3 py-1 rounded text-sm" style={{ color: '#0D9488', background: '#0D948822' }}>
            Today
          </button>
          <button onClick={nextMonth} className="p-2 rounded hover:bg-white/10" style={{ color: '#8A9BB0' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {EVENT_TYPES.map((t) => (
          <div key={t.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
            <span className="text-xs" style={{ color: '#8A9BB0' }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center py-2 text-xs font-medium" style={{ color: '#8A9BB0' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px" style={{ background: '#1E293B' }}>
        {days.map((day, i) => {
          const dayEvents = day ? eventsForDay(day) : [];
          const isToday = day && sameDay(day, today);

          return (
            <div
              key={i}
              onClick={() => handleDayClick(day)}
              className="min-h-[100px] p-2 cursor-pointer transition-colors"
              style={{
                background: day ? '#0A0E1A' : '#080B15',
                opacity: day ? 1 : 0.3,
              }}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full"
                      style={{
                        color: isToday ? '#0A0E1A' : '#8A9BB0',
                        background: isToday ? '#D4A843' : 'transparent',
                      }}
                    >
                      {day.getDate()}
                    </span>
                    {dayEvents.length === 0 && (
                      <Plus size={10} style={{ color: '#2E3A4A' }} />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 4).map((e) => (
                      <div key={e.id}
                        className="text-xs px-1 py-0.5 rounded truncate"
                        style={{ background: `${typeColor(e.type)}22`, color: typeColor(e.type), fontSize: 10 }}
                        title={`${e.label}${e.sub ? ` — ${e.sub}` : ''}`}
                      >
                        {e.label}
                      </div>
                    ))}
                    {dayEvents.length > 4 && (
                      <p className="text-xs" style={{ color: '#4A5568', fontSize: 10 }}>+{dayEvents.length - 4} more</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add reminder modal */}
      {newReminder && (
        <Modal title={`Add Reminder — ${formatDateFull(newReminder)}`} onClose={() => setNewReminder(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Reminder Label</label>
              <input
                className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{ background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' }}
                value={reminderForm.label}
                onChange={(e) => setReminderForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="What to remember..."
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8A9BB0' }}>Type</label>
              <select
                className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{ background: '#0A0E1A', border: '1px solid #1E293B', color: '#FAF3E0' }}
                value={reminderForm.type}
                onChange={(e) => setReminderForm((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="custom">Custom</option>
                <option value="follow_up">Follow-Up</option>
                <option value="revision_due">Revision Due</option>
                <option value="renewal">Renewal</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setNewReminder(null)} className="flex-1 py-2 rounded text-sm"
                style={{ background: '#1E293B', color: '#8A9BB0' }}>Cancel</button>
              <button onClick={handleAddReminder} className="flex-1 py-2 rounded text-sm font-medium"
                style={{ background: '#D4A843', color: '#0A0E1A' }}>Add Reminder</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
