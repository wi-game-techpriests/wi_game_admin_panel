import type { GameSession } from '../types';
import { categories, formatNumber, getFinalRanking } from '../utils/scoring';
import { EmptyState } from './EmptyState';

type FinalRankingProps = {
  sessions: GameSession[];
};

export function FinalRanking({ sessions }: FinalRankingProps) {
  const ranking = getFinalRanking(sessions);

  return (
    <section className="panel">
      <div className="panel-header compact">
        <div>
          <span className="eyebrow">Ranking finalny</span>
          <h2>Klasyfikacja ogólna</h2>
        </div>
      </div>

      {ranking.length === 0 ? (
        <EmptyState title="Brak danych rankingowych" text="Dodaj sesje lub poczekaj, aż backend zwróci graczy z punktami." />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Gracz</th>
                <th>Sesja</th>
                {categories.map((category) => (
                  <th key={category.key}>{category.label}</th>
                ))}
                <th>Suma</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((row, index) => (
                <tr key={row.key}>
                  <td className="rank-cell">{index + 1}</td>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>{row.sessionName}</td>
                  <td>{formatNumber(row.connectionsPoints)}</td>
                  <td>{formatNumber(row.fillInPoints)}</td>
                  <td>{formatNumber(row.wordSearchPoints)}</td>
                  <td>{formatNumber(row.kahootPoints)}</td>
                  <td>
                    <strong>{formatNumber(row.totalPoints)}</strong>
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
