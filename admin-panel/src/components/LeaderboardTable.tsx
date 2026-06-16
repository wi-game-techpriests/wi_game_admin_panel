import type { GameSession } from '../types';
import { categories, formatDateTime, formatNumber, getSessionLeaderboard } from '../utils/scoring';
import { EmptyState } from './EmptyState';

type LeaderboardTableProps = {
  session: GameSession | null;
};

export function LeaderboardTable({ session }: LeaderboardTableProps) {
  if (!session) {
    return (
      <section className="panel">
        <EmptyState title="Wybierz ranking sesji" text="Kliknij przycisk Ranking przy dowolnej sesji, aby zobaczyć tabelę graczy." />
      </section>
    );
  }

  const ranking = getSessionLeaderboard(session);
  const leader = ranking[0];

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Ranking sesji</span>
          <h2>{session.name || `Sesja #${session.id}`}</h2>
          <p>
            Kod: <strong>{session.joinCode || 'brak'}</strong> • {formatDateTime(session.startTime)} — {formatDateTime(session.endTime)}
          </p>
        </div>
        {leader ? (
          <div className="winner-card">
            <span>Lider</span>
            <strong>{leader.player.name}</strong>
            <small>{formatNumber(leader.totalPoints)} pkt</small>
          </div>
        ) : null}
      </div>

      {ranking.length === 0 ? (
        <EmptyState title="Brak graczy" text="Ta sesja nie ma jeszcze żadnych graczy w payloadzie." />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Gracz</th>
                {categories.map((category) => (
                  <th key={category.key}>{category.label}</th>
                ))}
                <th>Suma</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map(({ player, totalPoints, position }) => (
                <tr key={player.id}>
                  <td className="rank-cell">{position}</td>
                  <td>
                    <strong>{player.name || 'Bez nazwy'}</strong>
                    <small>ID: {player.id}</small>
                  </td>
                  {categories.map((category) => (
                    <td key={category.key}>{formatNumber(player[category.key])}</td>
                  ))}
                  <td>
                    <strong>{formatNumber(totalPoints)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
