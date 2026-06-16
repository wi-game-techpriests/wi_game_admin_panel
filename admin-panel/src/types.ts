export type Player = {
  id: number;
  sessionId: number;
  name: string;
  token: string;
  connectionsPoints: number;
  fillInPoints: number;
  wordSearchPoints: number;
  kahootPoints: number;
};

export type GameSession = {
  id: number;
  name: string;
  joinCode: string;
  startTime: string;
  endTime: string;
  players: Player[];
};

export type PlayerScore = {
  player: Player;
  totalPoints: number;
  position: number;
};

export type FinalRankingRow = {
  key: string;
  name: string;
  sessionId: number;
  sessionName: string;
  totalPoints: number;
  connectionsPoints: number;
  fillInPoints: number;
  wordSearchPoints: number;
  kahootPoints: number;
};

export type SessionStats = {
  totalSessions: number;
  activeSessions: number;
  endedSessions: number;
  totalPlayers: number;
  averagePlayersPerSession: number;
  averagePointsPerPlayer: number;
  bestPlayerName: string;
  bestPlayerPoints: number;
  bestSessionName: string;
  bestSessionAverage: number;
  mostPlayedCategory: string;
  mostPopulatedSessionName: string;
  mostPopulatedSessionPlayers: number;
  totalPoints: number;
};
