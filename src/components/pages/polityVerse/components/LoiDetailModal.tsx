import { POLITY_VERSE_COLORS } from '../constants';

interface Loi {
  categorie: string;
  titre: string;
  motifs: string;
  articles: string[];
}

interface LoiDetailModalProps {
  loi: Loi | null;
  onClose: () => void;
}

export function LoiDetailModal({ loi, onClose }: LoiDetailModalProps) {
  if (!loi) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <div 
        className="max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ 
          backgroundColor: POLITY_VERSE_COLORS.darkerBlack, 
          border: `2px solid ${POLITY_VERSE_COLORS.green}`,
          boxShadow: `0 0 30px ${POLITY_VERSE_COLORS.green}40`,
          animation: 'slideInUp 0.4s ease-out',
          scrollbarWidth: 'thin',
          scrollbarColor: `${POLITY_VERSE_COLORS.green}60 ${POLITY_VERSE_COLORS.darkerBlack}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 px-8 py-6 border-b flex items-center justify-between backdrop-blur-sm z-10"
          style={{ 
            backgroundColor: POLITY_VERSE_COLORS.dark + 'f0', 
            borderColor: POLITY_VERSE_COLORS.green,
            boxShadow: `0 2px 10px ${POLITY_VERSE_COLORS.green}15`
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚖️</span>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: POLITY_VERSE_COLORS.green }}>
                {loi.titre}
              </h2>
              <span 
                className="text-sm px-3 py-1 rounded-full inline-block mt-2 font-semibold"
                style={{ 
                  backgroundColor: loi.categorie === 'Finance' ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.dark,
                  color: loi.categorie === 'Finance' ? POLITY_VERSE_COLORS.darkerBlack : POLITY_VERSE_COLORS.green,
                  border: `1px solid ${POLITY_VERSE_COLORS.green}`
                }}
              >
                {loi.categorie === 'Finance' ? '💰 ' : '📜 '}{loi.categorie}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:rotate-90"
            style={{ 
              backgroundColor: POLITY_VERSE_COLORS.dark, 
              border: `2px solid ${POLITY_VERSE_COLORS.green}`
            }}
          >
            <span className="text-white text-2xl leading-none font-bold">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Motifs */}
          <div 
            className="p-6 rounded-xl border"
            style={{ 
              backgroundColor: POLITY_VERSE_COLORS.dark + '80',
              borderColor: POLITY_VERSE_COLORS.green + '40',
              boxShadow: `0 0 15px ${POLITY_VERSE_COLORS.green}10`,
              animation: 'slideInFromLeft 0.5s ease-out 0.1s both'
            }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-3" style={{ color: POLITY_VERSE_COLORS.green }}>
              <span className="text-2xl">📋</span>
              Motifs de la loi
            </h3>
            <p className="text-white/90 text-base leading-relaxed font-light italic">
              "{loi.motifs}"
            </p>
          </div>

          {/* Articles */}
          <div style={{ animation: 'slideInFromLeft 0.5s ease-out 0.2s both' }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: POLITY_VERSE_COLORS.green }}>
              <span className="text-2xl">📜</span>
              Articles de loi
              <span 
                className="text-sm px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: POLITY_VERSE_COLORS.green + '20',
                  color: POLITY_VERSE_COLORS.green,
                  border: `1px solid ${POLITY_VERSE_COLORS.green}`
                }}
              >
                {loi.articles.length} article{loi.articles.length > 1 ? 's' : ''}
              </span>
            </h3>
            <div className="space-y-4">
              {loi.articles.map((article, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-xl border transition-all hover:scale-[1.01]"
                  style={{ 
                    backgroundColor: POLITY_VERSE_COLORS.dark, 
                    borderColor: POLITY_VERSE_COLORS.green + '30',
                    boxShadow: `0 2px 8px ${POLITY_VERSE_COLORS.green}08`,
                    animation: `slideInFromLeft 0.4s ease-out ${0.3 + index * 0.1}s both`
                  }}
                >
                  <div className="flex gap-4">
                    <span 
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
                      style={{ 
                        backgroundColor: POLITY_VERSE_COLORS.green, 
                        color: POLITY_VERSE_COLORS.darkerBlack,
                        boxShadow: `0 0 10px ${POLITY_VERSE_COLORS.green}40`
                      }}
                    >
                      {index + 1}
                    </span>
                    <p className="text-white/85 text-base leading-relaxed flex-1 pt-1">
                      {article}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
