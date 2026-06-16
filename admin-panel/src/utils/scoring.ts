import type { FinalRankingRow, GameSession, Player, PlayerScore, SessionStats } from '../types';

export const categories = [
  { key: 'connectionsPoints', label: 'connections' },
  { key: 'fillInPoints', label: 'wypełnianka' },
  { key: 'wordSearchPoints', label: 'wykreślanka' },
  { key: 'kahootPoints', label: 'kahoot' }
] as const;

export function getPlayerTotal(player: Player): number {
  return (
    safeNumber(player.connectionsPoints) +
    safeNumber(player.fillInPoints) +
    safeNumber(player.wordSearchPoints) +
    safeNumber(player.kahootPoints)
  );
}

export function getSessionLeaderboard(session: GameSession): PlayerScore[] {
  const sorted = [...(session.players ?? [])].sort((a, b) => getPlayerTotal(b) - getPlayerTotal(a));
  return sorted.map((player, index) => ({
    player,
    totalPoints: getPlayerTotal(player),
    position: index + 1
  }));
}

export function getFinalRanking(sessions: GameSession[]): FinalRankingRow[] {
  return sessions
    .flatMap((session) =>
      (session.players ?? []).map((player) => {
        const total = getPlayerTotal(player);

        return {
          key: `${session.id}:${player.id}:${player.token || player.name || 'player'}`,
          name: player.name || 'Bez nazwy',
          sessionId: session.id,
          sessionName: session.name || `Sesja #${session.id}`,
          totalPoints: total,
          connectionsPoints: safeNumber(player.connectionsPoints),
          fillInPoints: safeNumber(player.fillInPoints),
          wordSearchPoints: safeNumber(player.wordSearchPoints),
          kahootPoints: safeNumber(player.kahootPoints)
        };
      })
    )
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

export function getStats(sessions: GameSession[]): SessionStats {
  const now = Date.now();
  const players = sessions.flatMap((session) => session.players ?? []);
  const finalRanking = getFinalRanking(sessions);
  const bestPlayer = finalRanking[0];
  const totalPoints = players.reduce((sum, player) => sum + getPlayerTotal(player), 0);

  const sessionAverages = sessions.map((session) => {
    const sessionPlayers = session.players ?? [];
    const sessionTotal = sessionPlayers.reduce((sum, player) => sum + getPlayerTotal(player), 0);
    return {
      session,
      average: sessionPlayers.length ? sessionTotal / sessionPlayers.length : 0
    };
  });
  const bestSession = sessionAverages.sort((a, b) => b.average - a.average)[0];

  const mostPopulatedSession = [...sessions].sort((a, b) => (b.players?.length ?? 0) - (a.players?.length ?? 0))[0];

  const categoryTotals = categories.map((category) => ({
    label: category.label,
    value: players.reduce((sum, player) => sum + safeNumber(player[category.key]), 0)
  }));
  const topCategory = categoryTotals.sort((a, b) => b.value - a.value)[0];

  return {
    totalSessions: sessions.length,
    activeSessions: sessions.filter((session) => isActive(session, now)).length,
    endedSessions: sessions.filter((session) => Date.parse(session.endTime) < now).length,
    totalPlayers: players.length,
    averagePlayersPerSession: sessions.length ? players.length / sessions.length : 0,
    averagePointsPerPlayer: players.length ? totalPoints / players.length : 0,
    bestPlayerName: bestPlayer?.name ?? 'Brak danych',
    bestPlayerPoints: bestPlayer?.totalPoints ?? 0,
    bestSessionName: bestSession?.session.name ?? 'Brak danych',
    bestSessionAverage: bestSession?.average ?? 0,
    mostPlayedCategory: topCategory?.value ? topCategory.label : 'Brak danych',
    mostPopulatedSessionName: mostPopulatedSession?.name ?? 'Brak danych',
    mostPopulatedSessionPlayers: mostPopulatedSession?.players?.length ?? 0,
    totalPoints
  };
}

export function getSessionStatus(session: GameSession): 'Aktywna' | 'Zakończona' {
  const now = Date.now();
  const end = Date.parse(session.endTime);

  if (Number.isFinite(end) && end < now) return 'Zakończona';
  return 'Aktywna';
}

export function getSessionTotalPoints(session: GameSession): number {
  return (session.players ?? []).reduce((sum, player) => sum + getPlayerTotal(player), 0);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Nieznana data';
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('pl-PL', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function isActive(session: GameSession, now: number): boolean {
  const end = Date.parse(session.endTime);
  return !Number.isFinite(end) || end >= now;
}

function safeNumber(value: number | null | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}
