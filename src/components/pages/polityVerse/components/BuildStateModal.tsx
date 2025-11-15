import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POLITY_VERSE_COLORS } from '../constants';
import etatData from '../mocks/etat.json';

interface BuildStateModalProps {
  onClose: () => void;
}

export function BuildStateModal({ onClose }: BuildStateModalProps) {
  const navigate = useNavigate();
  const [hymne, setHymne] = useState<File | null>(null);
  const [drapeau, setDrapeau] = useState<File | null>(null);
  const [devise, setDevise] = useState(
    Array.isArray(etatData.changer.devise) 
      ? etatData.changer.devise.join(', ') 
      : etatData.changer.devise || ''
  );

  const handleEnterVerse = () => {
    // Sauvegarder les données dans sessionStorage
    sessionStorage.setItem('buildStateData', JSON.stringify({
      hymne: hymne ? 'hymne-uploaded' : null,
      drapeau: drapeau ? 'drapeau-uploaded' : null,
      devise
    }));
    
    // Naviguer vers la nouvelle route
    navigate('/polity-verse/build');
  };
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div 
        className="max-w-6xl w-full rounded-2xl p-8 relative"
        style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80"
          style={{ 
            backgroundColor: POLITY_VERSE_COLORS.dark,
            border: `1px solid ${POLITY_VERSE_COLORS.green}`
          }}
        >
          <span className="text-white text-xl leading-none">×</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: POLITY_VERSE_COLORS.green }}
          >
            Build a State
          </h2>
          <p className="text-white/50 text-sm italic">
            A verse where you create a state's system
          </p>
          <div className="h-px bg-white/20 mt-4" />
        </div>

        {/* Country Info Section */}
        <div 
          className="p-8 rounded-2xl mb-5"
          style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}
        >
          {/* Country Name with Flag */}
          <div className="text-center mb-8">
            <h3 
              className="text-4xl font-bold mb-2"
              style={{ color: POLITY_VERSE_COLORS.white }}
            >
              🇲🇬 {etatData.inchanger.pays}
            </h3>
          </div>

          {/* Info Cards - Horizontal */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <InfoCard icon="🏛️" label="Capitale" value={etatData.inchanger.capitale} />
            <InfoCard icon="🗣️" label="Langues" value={etatData.inchanger.langues.join(', ')} />
            <InfoCard icon="💰" label="Monnaie" value={etatData.inchanger.monnaie} />
            <InfoCard icon="⚖️" label="Système" value={etatData.inchanger.systeme} />
          </div>

          {/* Symbols Section with Icons */}
          <div className="space-y-4 mb-8">
            <h4 
              className="text-xl font-bold text-center mb-6"
              style={{ color: POLITY_VERSE_COLORS.green }}
            >
            </h4>

            {/* Flag and Anthem side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Flag */}
              <SymbolItem
                icon="🚩"
                label="Drapeau"
                type="image"
                currentValue={etatData.changer.drapeau}
                onFileChange={setDrapeau}
              />

              {/* Anthem */}
              <SymbolItem
                icon="🎵"
                label="Hymne National"
                type="audio"
                currentValue={etatData.changer.hymne}
                onFileChange={setHymne}
              />
            </div>

            {/* Motto */}
            <SymbolItem
              icon="📜"
              label="Devise Nationale"
              type="text"
              currentValue={devise}
              onChange={setDevise}
              placeholder="Ex: Fitiavana, Tanindrazana, Fandrosoana"
            />
          </div>

          {/* Enter Button */}
          <button
            onClick={handleEnterVerse}
            className="w-full py-2.5 rounded-xl font-bold text-base transition-all hover:scale-105 hover:shadow-lg"
            style={{ 
              backgroundColor: POLITY_VERSE_COLORS.green,
              color: POLITY_VERSE_COLORS.white 
            }}
          >
            🌍 Enter the Verse 🌍
          </button>
        </div>
      </div>
    </div>
  );
}

// Info Card Component (non-editable with icon)
function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div 
      className="p-4 rounded-xl text-center transition-all hover:scale-105 cursor-pointer"
      style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-white/60 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm">{value}</p>
    </div>
  );
}

// Symbol Item Component with Icon trigger
function SymbolItem({ 
  icon,
  label, 
  type, 
  currentValue, 
  onFileChange, 
  onChange, 
  placeholder 
}: { 
  icon: string;
  label: string; 
  type: 'image' | 'audio' | 'text';
  currentValue?: string;
  onFileChange?: (file: File | null) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div 
      className="p-5 rounded-xl transition-all hover:shadow-lg"
      style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack }}
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-4xl transition-all hover:scale-125 cursor-pointer"
          title={`Cliquez pour ${isEditing ? 'masquer' : 'modifier'}`}
        >
          {icon}
        </button>
        <div className="flex-1">
          <h5 className="text-white font-bold text-lg">{label}</h5>
          {!isEditing && currentValue && type === 'text' && (
            <p className="text-white/70 text-sm mt-1">"{currentValue}"</p>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
          style={{ 
            backgroundColor: isEditing ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.dark,
            color: POLITY_VERSE_COLORS.white,
            border: `2px solid ${POLITY_VERSE_COLORS.green}`
          }}
        >
          {isEditing ? '✓ OK' : '✎ Modifier'}
        </button>
      </div>

      {/* Current Value Display (not text) */}
      {!isEditing && currentValue && type !== 'text' && (
        <div className="mt-3 ml-14">
          {type === 'image' && (
            <img 
              src={`/${currentValue}`} 
              alt={label} 
              className="h-16 rounded-lg border-2 border-white/20 shadow-lg"
            />
          )}
          {type === 'audio' && (
            <audio 
              controls 
              src={`/${currentValue}`}
              className="w-full"
              style={{ height: '40px' }}
            />
          )}
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="mt-4 ml-14">
          {type === 'image' && (
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => onFileChange?.(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer hover:scale-105"
              style={{ 
                backgroundColor: POLITY_VERSE_COLORS.dark,
                border: `2px solid ${POLITY_VERSE_COLORS.green}`
              }}
            />
          )}
          {type === 'audio' && (
            <input 
              type="file" 
              accept="audio/*"
              onChange={(e) => onFileChange?.(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer hover:scale-105"
              style={{ 
                backgroundColor: POLITY_VERSE_COLORS.dark,
                border: `2px solid ${POLITY_VERSE_COLORS.green}`
              }}
            />
          )}
          {type === 'text' && (
            <input 
              type="text" 
              value={currentValue}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-lg text-white text-base placeholder:text-white/40 outline-none transition-all"
              style={{ 
                backgroundColor: POLITY_VERSE_COLORS.dark,
                border: `2px solid ${POLITY_VERSE_COLORS.green}`
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
