type EmptyStateProps = {
  title: string;
  text: string;
};

export function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">☄️</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
