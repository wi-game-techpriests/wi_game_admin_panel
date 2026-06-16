import { useMemo, useState } from 'react';

type AddSessionFormProps = {
  isCreating: boolean;
  onCreate: (name: string, endTimeIso: string) => Promise<void>;
};

function getDefaultEndTime(): string {
  const date = new Date();
  date.setHours(date.getHours() + 2);
  date.setMinutes(Math.ceil(date.getMinutes() / 5) * 5, 0, 0);
  return toDatetimeLocalValue(date);
}

function toDatetimeLocalValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function toBackendDateTimeValue(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

export function AddSessionForm({ isCreating, onCreate }: AddSessionFormProps) {
  const defaultEndTime = useMemo(() => getDefaultEndTime(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [formError, setFormError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('Podaj nazwę sesji.');
      return;
    }

    const date = new Date(endTime);
    if (Number.isNaN(date.getTime())) {
      setFormError('Podaj poprawną datę zakończenia.');
      return;
    }

    await onCreate(trimmedName, toBackendDateTimeValue(endTime));
    setName('');
    setEndTime(getDefaultEndTime());
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button className="primary-button" type="button" onClick={() => setIsOpen(true)}>
        + Dodaj sesję
      </button>
    );
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="session-name">Nazwa sesji</label>
        <input
          id="session-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Np. Runda finałowa"
          disabled={isCreating}
        />
      </div>

      <div>
        <label htmlFor="session-end-time">Koniec sesji</label>
        <input
          id="session-end-time"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
          type="datetime-local"
          disabled={isCreating}
        />
      </div>

      {formError ? <p className="form-error">{formError}</p> : null}

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isCreating}>
          {isCreating ? 'Dodawanie...' : 'Zapisz'}
        </button>
        <button className="ghost-button" type="button" onClick={() => setIsOpen(false)} disabled={isCreating}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
