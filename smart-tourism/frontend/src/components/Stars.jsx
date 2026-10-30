import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
// Read-only stars (value) or clickable stars (onChange)
export default function Stars({ value = 0, onChange, size = 16 }) {
  if (onChange)
    return (
      <span className="stars" style={{ fontSize: size, cursor: "pointer" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} onClick={() => onChange(n)} role="button" aria-label={`${n} stars`}>
            {n <= value ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </span>
    );
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (value >= n ? <FaStar key={n} /> : value >= n - 0.5 ? <FaStarHalfAlt key={n} /> : <FaRegStar key={n} />))}
    </span>
  );
}
