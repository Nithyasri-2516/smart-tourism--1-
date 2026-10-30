// <img> that falls back to a colourful gradient if the URL is broken or empty
const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#0369a1'/><stop offset='.6' stop-color='#0d9488'/><stop offset='1' stop-color='#facc15'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><circle cx='620' cy='150' r='70' fill='#fde68a' opacity='.9'/><path d='M0 480 L220 290 L360 420 L520 250 L800 480 L800 600 L0 600Z' fill='#0c4a6e' opacity='.55'/></svg>`
  );
export default function SmartImg({ src, alt = "", ...rest }) {
  return <img src={src || FALLBACK} alt={alt} loading="lazy" onError={(e) => { if (e.target.src !== FALLBACK) e.target.src = FALLBACK; }} {...rest} />;
}
