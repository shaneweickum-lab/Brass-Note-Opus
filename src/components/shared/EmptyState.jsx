export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-5xl mb-4 opacity-30">{icon}</div>}
      <p className="text-base font-medium mb-1" style={{ color: '#FAF3E0' }}>{title}</p>
      {description && <p className="text-sm mb-4" style={{ color: '#8A9BB0' }}>{description}</p>}
      {action}
    </div>
  );
}
