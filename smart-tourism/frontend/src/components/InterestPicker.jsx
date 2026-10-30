import { INTERESTS } from "../data/destinations";
// Colourful multi-select cards. value = array of interest ids.
export default function InterestPicker({ value = [], onChange, big }) {
  const toggle = (id) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  return (
    <div className="row g-2 g-md-3">
      {INTERESTS.map((i) => {
        const on = value.includes(i.id);
        return (
          <div className={big ? "col-6 col-md-4 col-lg-3" : "col-6 col-sm-4"} key={i.id}>
            <button type="button" className={"pick" + (big ? " big" : "") + (on ? " on" : "")} style={on ? { background: i.color } : {}} onClick={() => toggle(i.id)} aria-pressed={on}>
              <span className="e">{i.emoji}</span>{i.id}
            </button>
          </div>
        );
      })}
    </div>
  );
}
