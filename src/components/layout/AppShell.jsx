export default function AppShell({ children }) {
  return (
    <main
      className="absolute inset-0 overflow-y-auto"
      style={{ top: 48, left: 240, background: '#0A0E1A' }}
    >
      {children}
    </main>
  );
}
