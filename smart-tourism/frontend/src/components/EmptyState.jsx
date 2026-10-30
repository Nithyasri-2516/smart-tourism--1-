export default function EmptyState({ icon = "🌴", title = "Nothing found", text = "Try changing your search or filters.", children }) {
  return (
    <div className="empty">
      <div className="big">{icon}</div>
      <h4 className="mt-2">{title}</h4>
      <p className="text-muted mb-3">{text}</p>
      {children}
    </div>
  );
}
