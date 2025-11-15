import { useState } from 'react';
import { POLITY_VERSE_COLORS } from '../constants';

interface Loi {
  categorie: string;
  titre: string;
  motifs: string;
  articles: string[];
}

interface LoiDropdownProps {
  lois: Loi[];
  onSelectLoi: (loi: Loi) => void;
  onDeleteLoi: (index: number) => void;
}

export function LoiDropdown({ lois, onSelectLoi, onDeleteLoi }: LoiDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Grouper les lois par catégorie
  const loisOrdinaires = lois.filter(loi => loi.categorie === 'Ordinaire') as Loi[];
  const loisFinance = lois.filter(loi => loi.categorie === 'Finance') as Loi[];

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleLoiClick = (loi: Loi, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectLoi(loi);
    setIsOpen(false);
  };

  const handleDelete = (index: number, category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Calculer l'index global basé sur la catégorie
    const globalIndex = category === 'Ordinaire' 
      ? index 
      : loisOrdinaires.length + index;
    onDeleteLoi(globalIndex);
  };

  return (
    <div className="relative">
      {/* Bouton principal - Plus grand et attractif */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 rounded-xl flex items-center gap-3 transition-all hover:scale-105 shadow-lg"
        style={{ 
          backgroundColor: POLITY_VERSE_COLORS.darkerBlack, 
          border: `2px solid ${POLITY_VERSE_COLORS.green}`,
          boxShadow: `0 0 10px ${POLITY_VERSE_COLORS.green}30`
        }}
      >
        <span className="text-3xl">⚖️</span>
        <div className="flex flex-col items-start">
          <span className="font-bold text-lg" style={{ color: POLITY_VERSE_COLORS.green }}>
            LOIS
          </span>
        </div>
        <span 
          className={`transition-transform text-2xl ml-2`} 
          style={{ 
            color: POLITY_VERSE_COLORS.green,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown menu - Plus stylé */}
      {isOpen && (
        <div 
          className="absolute top-full mt-4 right-0 w-[450px] max-h-[75vh] overflow-y-auto rounded-2xl shadow-2xl z-10"
          style={{ 
            backgroundColor: POLITY_VERSE_COLORS.darkerBlack, 
            border: `2px solid ${POLITY_VERSE_COLORS.green}`,
            boxShadow: `0 0 20px ${POLITY_VERSE_COLORS.green}30`,
            scrollbarWidth: 'thin',
            scrollbarColor: `#000000 ${POLITY_VERSE_COLORS.darkerBlack}`
          }}
        >
          {/* Header du dropdown */}
          <div 
            className="px-6 py-4 border-b sticky top-0 backdrop-blur-sm"
            style={{ 
              backgroundColor: POLITY_VERSE_COLORS.darkerBlack + 'f0',
              borderColor: POLITY_VERSE_COLORS.green 
            }}
          >
            <h3 className="text-lg font-bold" style={{ color: POLITY_VERSE_COLORS.green }}>
              📚 Recueil des Lois
            </h3>
          </div>

          {/* Catégorie Ordinaire */}
          <div className="border-b" style={{ borderColor: POLITY_VERSE_COLORS.green + '40' }}>
            <button
              onClick={() => toggleCategory('Ordinaire')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <span className="font-bold text-lg text-white">
                  Lois Ordinaires
                </span>
              </div>
              <span 
                className={`transition-all text-xl`} 
                style={{ 
                  color: POLITY_VERSE_COLORS.green,
                  transform: expandedCategory === 'Ordinaire' ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                ▼
              </span>
            </button>

            {/* Liste des lois ordinaires */}
            {expandedCategory === 'Ordinaire' && (
              <div className="max-h-80 overflow-y-auto" style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: `#000000 ${POLITY_VERSE_COLORS.darkerBlack}`
              }}>
                {loisOrdinaires.map((loi, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 hover:bg-white/5 transition-colors border-t cursor-pointer group"
                    style={{ borderColor: POLITY_VERSE_COLORS.green + '15' }}
                    onClick={(e) => handleLoiClick(loi, e)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-semibold text-white line-clamp-1">
                          {loi.titre}
                        </p>
                        <p className="text-xs text-white/50 line-clamp-1 mt-1">
                          {loi.motifs}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(index, 'Ordinaire', e)}
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ 
                          backgroundColor: '#ef4444',
                          color: 'white'
                        }}
                        title="Supprimer cette loi"
                      >
                        <span className="text-lg font-bold leading-none">×</span>
                      </button>
                    </div>
                  </div>
                ))}
                {loisOrdinaires.length === 0 && (
                  <div className="px-6 py-8 text-center text-white/40">
                    <span className="text-4xl block mb-2">📭</span>
                    Aucune loi ordinaire
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Catégorie Finance */}
          <div>
            <button
              onClick={() => toggleCategory('Finance')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-lg text-white">
                  Lois de Finance
                </span>
              </div>
              <span 
                className={`transition-all text-xl`} 
                style={{ 
                  color: POLITY_VERSE_COLORS.green,
                  transform: expandedCategory === 'Finance' ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                ▼
              </span>
            </button>

            {/* Liste des lois de finance */}
            {expandedCategory === 'Finance' && (
              <div className="max-h-80 overflow-y-auto" style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: `#000000 ${POLITY_VERSE_COLORS.darkerBlack}`
              }}>
                {loisFinance.map((loi, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 hover:bg-white/5 transition-colors border-t cursor-pointer group"
                    style={{ borderColor: POLITY_VERSE_COLORS.green + '15' }}
                    onClick={(e) => handleLoiClick(loi, e)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-semibold text-white line-clamp-1">
                          {loi.titre}
                        </p>
                        <p className="text-xs text-white/50 line-clamp-1 mt-1">
                          {loi.motifs}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(index, 'Finance', e)}
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ 
                          backgroundColor: '#ef4444',
                          color: 'white'
                        }}
                        title="Supprimer cette loi"
                      >
                        <span className="text-lg font-bold leading-none">×</span>
                      </button>
                    </div>
                  </div>
                ))}
                {loisFinance.length === 0 && (
                  <div className="px-6 py-8 text-center text-white/40">
                    <span className="text-4xl block mb-2">📭</span>
                    Aucune loi de finance
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
