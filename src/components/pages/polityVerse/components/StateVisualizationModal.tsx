import { useEffect, useRef, useState } from 'react';
import { SystemModal } from './SystemModal';
import { AjoutConstitution } from './AjoutConstitution';
import { AjoutLoi2 as AjoutLoi } from './AjoutLoi2';
import { LoiDropdown } from './LoiDropdown';
import { LoiDetailModal } from './LoiDetailModal';
import { InstitutionTree } from './InstitutionTree';
import { InstitutionDetailModal } from './InstitutionDetailModal';
import { POLITY_VERSE_COLORS } from '../constants';
import etatData from '../mocks/etat.json';
import loiDataImport from '../mocks/loi.json';
import institutionDataImport from '../mocks/institution.json';

interface StateVisualizationModalProps {
  onClose: () => void;
  hymneFile: File | null;
  drapeauFile: File | null;
  devise: string;
}

export function StateVisualizationModal({ onClose, hymneFile, drapeauFile, devise }: StateVisualizationModalProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showAjoutConstitution, setShowAjoutConstitution] = useState(false);
  const [showAjoutLoi, setShowAjoutLoi] = useState(false);
  const [selectedLoi, setSelectedLoi] = useState<any>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [lois, setLois] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    setLois([...loiDataImport]);
    setInstitutions([...institutionDataImport]);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.log('Audio play failed:', err));
    }
  }, []);

  const handleSelectLoi = (loi: any) => {
    setSelectedLoi(loi);
  };

  const handleDeleteLoi = (index: number) => {
    setLois(prevLois => prevLois.filter((_, i) => i !== index));
  };

  const handleSelectInstitution = (institution: any) => {
    setSelectedInstitution(institution);
  };

  const hymneUrl = hymneFile ? URL.createObjectURL(hymneFile) : etatData.changer.hymne ? `/${etatData.changer.hymne}` : '';
  const drapeauUrl = drapeauFile ? URL.createObjectURL(drapeauFile) : etatData.changer.drapeau ? `/${etatData.changer.drapeau}` : '';

  const finalDevise = devise || (Array.isArray(etatData.changer.devise) ? etatData.changer.devise.join(', ') : etatData.changer.devise);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}>
      <nav
        className="w-full px-8 py-4 flex items-center justify-between border-b"
        style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack, borderColor: POLITY_VERSE_COLORS.green }}
      >
        <div className="flex items-center gap-4">
          {drapeauUrl && <img src={drapeauUrl} alt="Drapeau" className="h-12 w-auto rounded shadow-lg" />}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: POLITY_VERSE_COLORS.green }}>{etatData.inchanger.pays}</h1>
            <p className="text-white/60 text-sm italic">{finalDevise}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InfoPill icon="🏛️" label="Capitale" value={etatData.inchanger.capitale} />
          <InfoPill icon="🗣️" label="Langues" value={etatData.inchanger.langues.join(', ')} />
          <InfoPill icon="💰" label="Monnaie" value={etatData.inchanger.monnaie} />
          <InfoPill icon="⚖️" label="Système" value={etatData.inchanger.systeme} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSystemModal(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: POLITY_VERSE_COLORS.dark, border: `2px solid ${POLITY_VERSE_COLORS.green}` }}
            title="Voir les principes du système politique"
          >
            <span className="text-white text-xl">≡</span>
          </button>

          <button
            onClick={() => setShowAjoutConstitution(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: POLITY_VERSE_COLORS.dark, border: `2px solid ${POLITY_VERSE_COLORS.green}` }}
            title="Ajouter / éditer la Constitution"
          >
            <span className="text-white text-xl">🏛️</span>
          </button>

          <button
            onClick={() => setShowAjoutLoi(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: POLITY_VERSE_COLORS.dark, border: `2px solid ${POLITY_VERSE_COLORS.green}` }}
            title="Ajouter / éditer une loi"
          >
            <span className="text-white text-xl">⚖️</span>
          </button>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            style={{ backgroundColor: POLITY_VERSE_COLORS.dark, border: `2px solid ${POLITY_VERSE_COLORS.green}` }}
          >
            <span className="text-white text-xl leading-none">×</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}>
        {/* Arbre des institutions - Centre de la page */}
        <div className="absolute inset-0">
          <InstitutionTree institutions={institutions} onSelectInstitution={handleSelectInstitution} />
        </div>

        {/* Dropdown de lois en haut à droite */}
        <div className="absolute top-8 right-8 z-10">
          <LoiDropdown lois={lois} onSelectLoi={handleSelectLoi} onDeleteLoi={handleDeleteLoi} />
        </div>

        <SystemModal visible={showSystemModal} onClose={() => setShowSystemModal(false)} />
        <AjoutConstitution visible={showAjoutConstitution} onClose={() => setShowAjoutConstitution(false)} />
        <AjoutLoi visible={showAjoutLoi} onClose={() => setShowAjoutLoi(false)} />
        <LoiDetailModal loi={selectedLoi} onClose={() => setSelectedLoi(null)} />
        <InstitutionDetailModal institution={selectedInstitution} onClose={() => setSelectedInstitution(null)} />
      </div>

      {hymneUrl && <audio ref={audioRef} src={hymneUrl} loop autoPlay className="hidden" />}
    </div>
  );
}

function InfoPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="px-4 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: POLITY_VERSE_COLORS.dark, border: `1px solid ${POLITY_VERSE_COLORS.green}` }}>
      <span className="text-lg">{icon}</span>
      <div className="text-left">
        <p className="text-white/50 text-xs leading-none">{label}</p>
        <p className="text-white text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
