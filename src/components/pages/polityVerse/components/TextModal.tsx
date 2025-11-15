import { POLITY_VERSE_COLORS } from '../constants';
import textData from '../mocks/text.json';

interface TextModalProps {
  onClose: () => void;
}

export function TextModal({ onClose }: TextModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="max-w-4xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-8 space-y-8"
        style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            <span style={{ color: POLITY_VERSE_COLORS.white }}>Polity</span>
            <span style={{ color: POLITY_VERSE_COLORS.green }}>Verse</span>
          </h2>
          <p className="text-white/70 text-lg italic">Un lendemain avec une culture politique</p>
          <div className="h-px bg-white/20 mt-6" />
        </div>

        {/* Problématique */}
        <div 
          className="p-6 rounded-xl"
          style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack }}
        >
          <h3 className="text-xl font-semibold mb-3" style={{ color: POLITY_VERSE_COLORS.green }}>
            Problématique
          </h3>
          <p className="text-white text-lg leading-relaxed">
            {textData.problematique}
          </p>
        </div>

        {/* Points */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white">Points à adresser</h3>
          
          {textData.points.map((point, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl space-y-4"
              style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack }}
            >
              {/* Titre */}
              <div className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  style={{ 
                    backgroundColor: POLITY_VERSE_COLORS.green + '30',
                    color: POLITY_VERSE_COLORS.green 
                  }}
                >
                  {index + 1}
                </div>
                <h4 className="text-lg font-semibold text-white flex-1 pt-1">
                  {point.titre}
                </h4>
              </div>

              {/* Description */}
              <p className="text-white/70 leading-relaxed pl-11">
                {point.description}
              </p>

              {/* Exemples */}
              <div className="pl-11 space-y-2">
                <p className="text-sm font-semibold text-white/80 mb-3">Exemples et illustrations :</p>
                <ul className="space-y-2">
                  {point.exemples.map((exemple, eIndex) => (
                    <li 
                      key={eIndex}
                      className="flex items-start gap-2 text-white/80"
                    >
                      <span 
                        className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: POLITY_VERSE_COLORS.green }}
                      />
                      <span className="flex-1">{exemple}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-80"
          style={{ 
            backgroundColor: POLITY_VERSE_COLORS.green,
            color: POLITY_VERSE_COLORS.white 
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
