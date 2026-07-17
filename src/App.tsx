import { Header } from './components/Header';
import { useDashboardStore } from './store/useDashboardStore';
import { useLiveStream } from './store/useLiveStream';

export default function App() {
  useLiveStream();
  const lastUpdated = useDashboardStore((s) => s.lastUpdated);
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Header lastUpdated={lastUpdated} />
      <main className="py-10 text-slate-400">Panels coming online…</main>
    </div>
  );
}
