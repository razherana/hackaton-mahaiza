import { POLITY_VERSE_COLORS } from '../constants';

interface Role {
  role: string;
  description: string;
}

interface Interaction {
  institution: string;
  interaction: string;
}

interface Institution {
  categorie: string;
  nom_institution: string;
  hierarchie: number;
  election: string;
  fonctionnement: string;
  interactions: Interaction[];
  roles: Role[];
}

interface InstitutionDetailModalProps {
  institution: Institution | null;
  onClose: () => void;
}

const getCategorieInfo = (categorie: string) => {
  switch (categorie) {
    case 'executif':
      return { icon: '⚙️', label: 'Exécutif', color: '#3b82f6' };
    case 'legislatif':
      return { icon: '⚖️', label: 'Législatif', color: '#8b5cf6' };
    case 'judiciaire':
      return { icon: '⚖️', label: 'Judiciaire', color: '#ef4444' };
    case 'armee':
      return { icon: '🛡️', label: 'Armée', color: '#10b981' };
    default:
      return { icon: '🏛️', label: categorie, color: POLITY_VERSE_COLORS.green };
  }
};

export function InstitutionDetailModal({ institution, onClose }: InstitutionDetailModalProps) {
  if (!institution) return null;

  const categorieInfo = getCategorieInfo(institution.categorie);

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
        className="max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{ 
          backgroundColor: POLITY_VERSE_COLORS.darkerBlack, 
          border: `2px solid ${categorieInfo.color}`,
          boxShadow: `0 0 30px ${categorieInfo.color}40`,
          animation: 'slideInUp 0.4s ease-out',
          scrollbarWidth: 'thin',
          scrollbarColor: `${categorieInfo.color}60 ${POLITY_VERSE_COLORS.darkerBlack}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 px-6 py-4 border-b flex items-center justify-between backdrop-blur-sm z-10"
          style={{ 
            backgroundColor: POLITY_VERSE_COLORS.dark + 'f0', 
            borderColor: categorieInfo.color,
            boxShadow: `0 2px 10px ${categorieInfo.color}15`
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{categorieInfo.icon}</span>
            <div>
              <h2 className="text-xl font-bold" style={{ color: categorieInfo.color }}>
                {institution.nom_institution}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: categorieInfo.color + '20',
                    color: categorieInfo.color,
                    border: `1px solid ${categorieInfo.color}`
                  }}
                >
                  {categorieInfo.label}
                </span>
                <span 
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: POLITY_VERSE_COLORS.dark,
                    color: POLITY_VERSE_COLORS.green,
                    border: `1px solid ${POLITY_VERSE_COLORS.green}`
                  }}
                >
                  Niveau {institution.hierarchie}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90"
            style={{ 
              backgroundColor: POLITY_VERSE_COLORS.dark, 
              border: `2px solid ${categorieInfo.color}`
            }}
          >
            <span className="text-white text-xl leading-none font-bold">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Élection */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: POLITY_VERSE_COLORS.dark + '80',
              borderColor: categorieInfo.color + '40',
              boxShadow: `0 0 15px ${categorieInfo.color}10`,
              animation: 'slideInFromLeft 0.5s ease-out 0.1s both'
            }}
          >
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: categorieInfo.color }}>
              <span className="text-lg">🗳️</span>
              Mode d'élection / Nomination
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {institution.election}
            </p>
          </div>

          {/* Fonctionnement */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: POLITY_VERSE_COLORS.dark + '80',
              borderColor: categorieInfo.color + '40',
              boxShadow: `0 0 15px ${categorieInfo.color}10`,
              animation: 'slideInFromLeft 0.5s ease-out 0.2s both'
            }}
          >
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: categorieInfo.color }}>
              <span className="text-lg">⚙️</span>
              Fonctionnement
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {institution.fonctionnement}
            </p>
          </div>

          {/* Rôles */}
          <div style={{ animation: 'slideInFromLeft 0.5s ease-out 0.3s both' }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: categorieInfo.color }}>
              <span className="text-lg">📋</span>
              Rôles et Responsabilités
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: categorieInfo.color + '20',
                  color: categorieInfo.color,
                  border: `1px solid ${categorieInfo.color}`
                }}
              >
                {institution.roles.length}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {institution.roles.map((role, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg border transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: POLITY_VERSE_COLORS.dark, 
                    borderColor: categorieInfo.color + '30',
                    boxShadow: `0 2px 8px ${categorieInfo.color}08`,
                    animation: `slideInFromLeft 0.4s ease-out ${0.4 + index * 0.1}s both`
                  }}
                >
                  <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: categorieInfo.color }}
                    />
                    {role.role}
                  </h4>
                  <p className="text-white/70 text-xs leading-relaxed">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactions */}
          <div style={{ animation: 'slideInFromLeft 0.5s ease-out 0.5s both' }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: categorieInfo.color }}>
              <span className="text-lg">🔗</span>
              Interactions avec d'autres institutions
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: categorieInfo.color + '20',
                  color: categorieInfo.color,
                  border: `1px solid ${categorieInfo.color}`
                }}
              >
                {institution.interactions.length}
              </span>
            </h3>
            <div className="space-y-3">
              {institution.interactions.map((interaction, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg border transition-all hover:scale-[1.01]"
                  style={{ 
                    backgroundColor: POLITY_VERSE_COLORS.dark, 
                    borderColor: categorieInfo.color + '30',
                    boxShadow: `0 2px 8px ${categorieInfo.color}08`,
                    animation: `slideInFromLeft 0.4s ease-out ${0.6 + index * 0.1}s both`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span 
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ 
                        backgroundColor: categorieInfo.color, 
                        color: POLITY_VERSE_COLORS.darkerBlack,
                        boxShadow: `0 0 10px ${categorieInfo.color}40`
                      }}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm mb-1" style={{ color: POLITY_VERSE_COLORS.green }}>
                        → {interaction.institution}
                      </h4>
                      <p className="text-white/75 text-xs leading-relaxed">
                        {interaction.interaction}
                      </p>
                    </div>
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
