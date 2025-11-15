import { useState, useRef, useEffect } from 'react';
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

interface InstitutionTreeProps {
  institutions: Institution[];
  onSelectInstitution: (institution: Institution) => void;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  categorie: string | null;
}

const getCategorieInfo = (categorie: string) => {
  switch (categorie) {
    case 'executif':
      return { icon: '⚙️', label: 'Exécutif', color: '#3b82f6' };
    case 'legislatif':
      return { icon: '🏛️', label: 'Législatif', color: '#8b5cf6' };
    case 'judiciaire':
      return { icon: '⚖️', label: 'Judiciaire', color: '#ef4444' };
    case 'armee':
      return { icon: '🛡️', label: 'Armée', color: '#10b981' };
    default:
      return { icon: '🏛️', label: categorie, color: POLITY_VERSE_COLORS.green };
  }
};

export function InstitutionTree({ institutions, onSelectInstitution }: InstitutionTreeProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    categorie: null
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Grouper les institutions par catégorie et trier par hiérarchie
  const groupedInstitutions = institutions.reduce((acc, institution) => {
    if (!acc[institution.categorie]) {
      acc[institution.categorie] = [];
    }
    acc[institution.categorie].push(institution);
    return acc;
  }, {} as Record<string, Institution[]>);

  // Trier par hiérarchie
  Object.keys(groupedInstitutions).forEach(categorie => {
    groupedInstitutions[categorie].sort((a, b) => a.hierarchie - b.hierarchie);
  });

  // Grouper par niveau de hiérarchie dans chaque catégorie
  const getInstitutionsByLevel = (institutionsInCategorie: Institution[]) => {
    const byLevel: Record<number, Institution[]> = {};
    institutionsInCategorie.forEach(institution => {
      if (!byLevel[institution.hierarchie]) {
        byLevel[institution.hierarchie] = [];
      }
      byLevel[institution.hierarchie].push(institution);
    });
    return byLevel;
  };

  // Démarrer le drag
  const handleDragStart = (e: React.MouseEvent, categorie: string) => {
    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: 0,
      currentY: 0,
      categorie
    });
  };

  // Pendant le drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;
        
        setDragState(prev => ({
          ...prev,
          currentX: deltaX,
          currentY: deltaY
        }));
      }
    };

    const handleMouseUp = () => {
      if (dragState.isDragging) {
        // Animation de retour avec transition curviligne
        setDragState(prev => ({
          ...prev,
          isDragging: false
        }));

        // Reset après l'animation
        setTimeout(() => {
          setDragState({
            isDragging: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            categorie: null
          });
        }, 600);
      }
    };

    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, dragState.startX, dragState.startY]);

  // Calculer la transformation curviligne
  const getCurvilinearTransform = (categorie: string) => {
    if (dragState.categorie !== categorie) return {};
    
    const { currentX, currentY, isDragging } = dragState;
    
    if (!isDragging && (currentX !== 0 || currentY !== 0)) {
      // Animation de retour avec courbe
      return {
        transform: `translate(0px, 0px)`,
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      };
    }
    
    if (isDragging) {
      // Mouvement curviligne pendant le drag
      return {
        transform: `translate(${currentX}px, ${currentY}px) rotate(${currentX * 0.02}deg)`,
        transition: 'none',
        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
      };
    }
    
    return {};
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full p-8 overflow-y-auto" 
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: `${POLITY_VERSE_COLORS.green}60 ${POLITY_VERSE_COLORS.darkerBlack}`
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Grille des catégories côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.keys(groupedInstitutions).map((categorie) => {
          const categorieInfo = getCategorieInfo(categorie);
          const institutionsInCategorie = groupedInstitutions[categorie];
          const institutionsByLevel = getInstitutionsByLevel(institutionsInCategorie);
          const levels = Object.keys(institutionsByLevel).map(Number).sort((a, b) => a - b);
          const isDraggingThis = dragState.categorie === categorie;

          return (
            <div 
              key={categorie} 
              className="space-y-4"
              style={{
                ...getCurvilinearTransform(categorie),
                cursor: isDraggingThis ? 'grabbing' : 'grab',
                zIndex: isDraggingThis ? 50 : 1,
                position: 'relative'
              }}
            >
              {/* Header de catégorie */}
              <div className="flex items-center gap-3 mb-8 justify-center">
                <h3 className="text-xl font-bold" style={{ color: categorieInfo.color }}>
                  {categorieInfo.label}
                </h3>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: categorieInfo.color + '20',
                    color: categorieInfo.color,
                    border: `1px solid ${categorieInfo.color}`
                  }}
                >
                  {institutionsInCategorie.length}
                </span>
              </div>

              {/* Structure en arbre avec lignes de connexion */}
              <div className="relative flex flex-col items-center gap-16">
                {levels.map((level, levelIndex) => {
                  const institutionsAtLevel = institutionsByLevel[level];
                  const hasNextLevel = levelIndex < levels.length - 1;
                  const nextLevelInstitutions = hasNextLevel ? institutionsByLevel[levels[levelIndex + 1]] : [];
                  
                  return (
                    <div key={level} className="relative w-full">
                      {/* Institutions du même niveau côte à côte */}
                      <div className="flex justify-center gap-4 relative z-10">
                        {institutionsAtLevel.map((institution, indexInLevel) => {
                          return (
                            <div key={institution.nom_institution} className="relative">
                              {/* Ligne verticale de cette institution vers le bas */}
                              {hasNextLevel && (
                                <div
                                  className="absolute left-1/2 -translate-x-1/2"
                                  style={{
                                    top: '100%',
                                    width: '2px',
                                    height: '32px',
                                    backgroundColor: categorieInfo.color + '50',
                                    zIndex: 0
                                  }}
                                />
                              )}

                              {/* Ligne horizontale vers le centre (si plusieurs filles) */}
                              {hasNextLevel && nextLevelInstitutions.length > 1 && institutionsAtLevel.length === 1 && (
                                <>
                                  {/* Ligne horizontale centrale */}
                                  <div
                                    className="absolute -translate-x-1/2"
                                    style={{
                                      top: 'calc(100% + 32px)',
                                      left: '50%',
                                      width: `${(nextLevelInstitutions.length - 1) * 128}px`,
                                      height: '2px',
                                      backgroundColor: categorieInfo.color + '40',
                                      zIndex: 0
                                    }}
                                  />
                                  {/* Lignes verticales vers chaque fille */}
                                  {nextLevelInstitutions.map((_, childIndex) => {
                                    const childOffset = (childIndex - (nextLevelInstitutions.length - 1) / 2) * 128;
                                    return (
                                      <div
                                        key={childIndex}
                                        className="absolute"
                                        style={{
                                          top: 'calc(100% + 32px)',
                                          left: `calc(50% + ${childOffset}px)`,
                                          width: '2px',
                                          height: '32px',
                                          backgroundColor: categorieInfo.color + '50',
                                          zIndex: 0
                                        }}
                                      />
                                    );
                                  })}
                                </>
                              )}

                              <button
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  handleDragStart(e, categorie);
                                }}
                                onClick={() => {
                                  if (!dragState.isDragging && dragState.categorie !== categorie) {
                                    onSelectInstitution(institution);
                                  }
                                }}
                                className="group flex flex-col items-center gap-3 transition-all hover:scale-110"
                                style={{
                                  animation: `slideInFromLeft 0.4s ease-out ${(levelIndex * 2 + indexInLevel) * 0.1}s both`,
                                  cursor: isDraggingThis ? 'grabbing' : 'pointer'
                                }}
                              >
                                {/* Cercle de l'institution */}
                                <div
                                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center p-3 transition-all relative"
                                  style={{
                                    backgroundColor: categorieInfo.color + '20',
                                    border: `3px solid ${categorieInfo.color}`,
                                    boxShadow: `0 4px 20px ${categorieInfo.color}40`
                                  }}
                                >
                                  {/* Nom de l'institution */}
                                  <p 
                                    className="text-xs font-bold text-center leading-tight"
                                    style={{ color: categorieInfo.color }}
                                  >
                                    {institution.nom_institution.length > 20 
                                      ? institution.nom_institution.split(' ').map(w => w[0]).join('').slice(0, 4)
                                      : institution.nom_institution.split(' ').slice(0, 3).join(' ')
                                    }
                                  </p>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <style>{`
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
    </div>
  );
}
