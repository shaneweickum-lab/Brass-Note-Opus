export default function RevisionDots({ included = 3, used = 0 }) {
  const totalDots = Math.max(included, used);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalDots }, (_, i) => {
        let color;
        if (i < used) {
          color = used > included ? '#C0392B' : '#D4A843';
        } else {
          color = '#1E293B';
        }
        return (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              background: color,
              border: `1px solid ${i < used ? color : '#2E3A4A'}`,
            }}
          />
        );
      })}
    </div>
  );
}
