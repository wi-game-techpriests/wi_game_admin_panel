import type { GameSession } from '../types';
import { formatDateTime, formatNumber, getSessionStatus, getSessionTotalPoints } from '../utils/scoring';

type SessionsListProps = {
  sessions: GameSession[];
  selectedSessionId: number | null;
  deletingSessionId: number | null;
  onSelectRanking: (sessionId: number) => void;
  onDelete: (sessionId: number) => void;
};

export function SessionsList({
  sessions,
  selectedSessionId,
  deletingSessionId,
  onSelectRanking,
  onDelete
}: SessionsListProps) {
  return (
    <div className="sessions-grid">
      {sessions.map((session) => {
        const status = getSessionStatus(session);
        const playersCount = session.players?.length ?? 0;
        const isSelected = selectedSessionId === session.id;

        return (
          <article className={`session-card ${isSelected ? 'selected' : ''}`} key={session.id}>
            <div className="session-card-header">
              <div>
                <span className={`status status-${status.toLowerCase()}`}>{status}</span>
                <h3>{session.name || `Sesja #${session.id}`}</h3>
              </div>
              <span className="join-code">{session.joinCode || 'Brak kodu'}</span>
            </div>

            <dl className="session-meta">
              <div>
                <dt>Start</dt>
                <dd>{formatDateTime(session.startTime)}</dd>
              </div>
              <div>
                <dt>Koniec</dt>
                <dd>{formatDateTime(session.endTime)}</dd>
              </div>
              <div>
                <dt>Gracze</dt>
                <dd>{playersCount}</dd>
              </div>
              <div>
                <dt>Punkty</dt>
                <dd>{formatNumber(getSessionTotalPoints(session))}</dd>
              </div>
            </dl>

            <div className="session-actions">
              <button className="secondary-button" type="button" onClick={() => onSelectRanking(session.id)}>
                Ranking
              </button>
              <button
                className="danger-button"
                type="button"
                onClick={() => onDelete(session.id)}
                disabled={deletingSessionId === session.id}
              >
                {deletingSessionId === session.id ? 'Usuwanie...' : 'Usuń'}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
