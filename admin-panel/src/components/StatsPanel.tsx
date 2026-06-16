import type { GameSession } from '../types';
import { formatNumber, getStats } from '../utils/scoring';
import { StatCard } from './StatCard';

type StatsPanelProps = {
  sessions: GameSession[];
};

export function StatsPanel({ sessions }: StatsPanelProps) {
  const stats = getStats(sessions);

  return (
    <section className="stats-grid" aria-label="Statystyki">
      <StatCard label="Sesje" value={stats.totalSessions} hint={`${stats.activeSessions} aktywne, ${stats.endedSessions} zakończone`} />
      <StatCard label="Gracze" value={stats.totalPlayers} hint="łącznie we wszystkich sesjach" />
      <StatCard label="Śr. graczy / sesję" value={formatNumber(stats.averagePlayersPerSession, 1)} />
      <StatCard label="Śr. pkt / gracza" value={formatNumber(stats.averagePointsPerPlayer, 1)} />
      <StatCard label="Najlepszy gracz" value={stats.bestPlayerName} hint={`${formatNumber(stats.bestPlayerPoints)} pkt`} />
      <StatCard label="Najlepsza sesja" value={stats.bestSessionName} hint={`${formatNumber(stats.bestSessionAverage, 1)} pkt / gracza`} />
      <StatCard label="Najmocniejsza kategoria" value={stats.mostPlayedCategory} />
      <StatCard label="Najwięcej graczy" value={stats.mostPopulatedSessionName} hint={`${stats.mostPopulatedSessionPlayers} graczy`} />
    </section>
  );
}
