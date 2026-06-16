import { useEffect, useMemo, useState } from 'react';
import { AddSessionForm } from './components/AddSessionForm';
import { EmptyState } from './components/EmptyState';
import { FinalRanking } from './components/FinalRanking';
import { LeaderboardTable } from './components/LeaderboardTable';
import { SessionsList } from './components/SessionsList';
import { StatsPanel } from './components/StatsPanel';
import { createSession, deleteSession, getSessions } from './services/api';
import type { GameSession } from './types';
import './styles.css';

function App() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [sessions, selectedSessionId]
  );

  async function loadSessions(silent = false) {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError('');
      const data = await getSessions();
      const sorted = [...data].sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime));
      setSessions(sorted);

      if (selectedSessionId && !sorted.some((session) => session.id === selectedSessionId)) {
        setSelectedSessionId(null);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się pobrać sesji.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleCreateSession(name: string, endTimeIso: string) {
    try {
      setIsCreating(true);
      setError('');
      await createSession(name, endTimeIso);
      await loadSessions(true);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się dodać sesji.');
      throw caughtError;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteSession(sessionId: number) {
    const session = sessions.find((item) => item.id === sessionId);
    const confirmed = window.confirm(`Usunąć sesję „${session?.name ?? `#${sessionId}`}”?`);
    if (!confirmed) return;

    try {
      setDeletingSessionId(sessionId);
      setError('');
      await deleteSession(sessionId);
      await loadSessions(true);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nie udało się usunąć sesji.');
    } finally {
      setDeletingSessionId(null);
    }
  }

  useEffect(() => {
    void loadSessions();
  }, []);

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">WI Game</span>
          <h1>Panel Administracyjny</h1>
        </div>
        <div className="hero-actions">
          <button className="ghost-button" type="button" onClick={() => loadSessions(true)} disabled={isRefreshing || isLoading}>
            {isRefreshing ? 'Odświeżanie...' : 'Odśwież'}
          </button>
          <AddSessionForm isCreating={isCreating} onCreate={handleCreateSession} />
        </div>
      </header>

      {error ? (
        <div className="alert" role="alert">
          <strong>Problem z backendem:</strong> {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="loader">Ładowanie sesji...</div>
      ) : (
        <>
          <StatsPanel sessions={sessions} />

          <section className="panel">
            <div className="panel-header compact">
              <div>
                <span className="eyebrow">Sesje</span>
                <h2>Dostępne sesje</h2>
              </div>
            </div>

            {sessions.length === 0 ? (
              <EmptyState title="Brak sesji" text="Utwórz pierwszą sesję przyciskiem Dodaj sesję." />
            ) : (
              <SessionsList
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                deletingSessionId={deletingSessionId}
                onSelectRanking={setSelectedSessionId}
                onDelete={handleDeleteSession}
              />
            )}
          </section>

          <LeaderboardTable session={selectedSession} />
          <FinalRanking sessions={sessions} />
        </>
      )}
    </main>
  );
}

export default App;
