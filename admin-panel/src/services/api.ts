import type { GameSession } from '../types';

const API_URL = 'https://wi-game-backend-f608ef6ee0db.herokuapp.com';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Backend zwrócił błąd ${response.status}. ${body}`.trim());
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getSessions(): Promise<GameSession[]> {
  return request<GameSession[]>('/sessions');
}

export async function createSession(name: string, endTimeIso: string): Promise<GameSession | unknown> {
  const params = new URLSearchParams({ name, endTime: endTimeIso });
  return request(`/sessions?${params.toString()}`, {
    method: 'POST'
  });
}

export async function deleteSession(id: number): Promise<void> {
  const params = new URLSearchParams({ id: String(id) });
  await request<void>(`/sessions?${params.toString()}`, {
    method: 'DELETE'
  });
}
