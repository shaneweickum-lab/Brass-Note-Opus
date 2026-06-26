export default function Badge({ label, color = '#8A9BB0', bg, icon }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color, background: bg || `${color}22`, border: `1px solid ${color}44` }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
