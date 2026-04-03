export default function StarRating({ value, onChange, max = 10 }) {
  return (
    <div className="star-rating">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= value ? 'active' : ''}`}
          onClick={() => onChange(n)}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
      {value > 0 && <span className="star-value">{value}/10</span>}
    </div>
  );
}
