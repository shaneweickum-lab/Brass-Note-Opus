import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,14,26,0.85)' }}>
      <div
        className="relative w-full rounded-lg overflow-y-auto max-h-[90vh]"
        style={{
          background: '#0F172A',
          border: '1px solid #1E293B',
          maxWidth: wide ? '800px' : '560px',
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1E293B' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#FAF3E0', fontFamily: 'Playfair Display, serif' }}>
            {title}
          </h2>
          <button onClick={onClose} className="p-1 rounded transition-colors hover:bg-white/10" style={{ color: '#8A9BB0' }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
