import { POLITY_VERSE_COLORS } from '../constants';

export function PolityVerseLogo() {
  return (
    <div className="text-5xl font-bold tracking-tighter">
      <span 
        className="text-transparent"
        style={{
          WebkitTextStroke: `1px ${POLITY_VERSE_COLORS.white}`
        }}
      >
        Polity
      </span>
      <span 
        className="text-transparent"
        style={{
          WebkitTextStroke: `1px ${POLITY_VERSE_COLORS.green}`
        }}
      >
        Verse
      </span>
    </div>
  );
}
