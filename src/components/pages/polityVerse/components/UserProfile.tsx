import { useState } from 'react';
import userData from '../mocks/user.json';
import { POLITY_VERSE_COLORS } from '../constants';
import { TextModal } from './TextModal';

type NiveauType = 'Débutant' | 'Débutant avancé' | 'Intermédiaire' | 'Avancé';

interface KnowledgeSection {
  niveauGeneral: NiveauType;
  [key: string]: string;
}

export function UserProfile() {
  const [selectedCategory, setSelectedCategory] = useState<'politique' | 'economiesPolitiques' | 'economieSociale'>('politique');
  const [showTextModal, setShowTextModal] = useState(false);

  const getNiveauColor = (niveau: string): string => {
    switch (niveau) {
      case 'Avancé':
        return POLITY_VERSE_COLORS.green;
      case 'Intermédiaire':
        return '#7a9c73';
      case 'Débutant avancé':
        return '#a5a5a5';
      case 'Débutant':
        return '#757575';
      default:
        return POLITY_VERSE_COLORS.white;
    }
  };

  const categories = {
    politique: 'Politique',
    economiesPolitiques: 'Economie',
    economieSociale: 'Sociale',
  };

  const currentData = userData.connaissances[selectedCategory] as KnowledgeSection;

  return (
    <div 
      className="space-y-8 p-6 rounded-xl"
      style={{
        backgroundColor: POLITY_VERSE_COLORS.darkerBlack,
      }}
    >
      {/* Header - User Info */}
      <div>
        <h2 className="text-3xl font-light text-white mb-2">
          {userData.prenom} {userData.nom}
        </h2>
        <p className="text-white/60 text-base">{userData.age} ans</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as typeof selectedCategory)}
            className="text-base font-light transition-all"
            style={{
              color: selectedCategory === key ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.white + '80',
              borderBottom: selectedCategory === key ? `2px solid ${POLITY_VERSE_COLORS.green}` : '2px solid transparent',
              paddingBottom: '6px'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Knowledge Details */}
      <div className="space-y-5">
        <div className="pb-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-base font-light">Niveau Général</span>
            <span 
              className="text-lg font-medium"
              style={{ color: getNiveauColor(currentData.niveauGeneral) }}
            >
              {currentData.niveauGeneral}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(currentData)
            .filter(([key]) => key !== 'niveauGeneral')
            .map(([key, niveau]) => (
              <div 
                key={key}
                className="flex justify-between items-center py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors"
              >
                <span className="text-white text-base font-light capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span 
                  className="text-base font-medium"
                  style={{ color: getNiveauColor(niveau) }}
                >
                  {niveau}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Footer Text - Clickable */}
      <div 
        className="mt-6 pt-4 border-t border-white/10 cursor-pointer p-4 rounded-lg transition-all hover:opacity-90"
        style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}
        onClick={() => setShowTextModal(true)}
      >
        <p className="text-center">
          <span className="font-bold text-lg" style={{ color: POLITY_VERSE_COLORS.green }}>PolityVerse</span>
          <br />
          <span className="text-white/70 text-xs italic mt-1 block">un lendemain avec une culture politique</span>
          <br />
          <span 
            className="text-xs mt-2 inline-block font-medium hover:underline"
            style={{ color: POLITY_VERSE_COLORS.green }}
          >
            Lire plus →
          </span>
        </p>
      </div>

      {/* Text Modal */}
      {showTextModal && <TextModal onClose={() => setShowTextModal(false)} />}
    </div>
  );
}
