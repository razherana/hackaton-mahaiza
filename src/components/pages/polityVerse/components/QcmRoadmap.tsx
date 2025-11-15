import { useState, useEffect, useRef } from 'react';
import { POLITY_VERSE_COLORS } from '../constants';
import userData from '../mocks/user.json';
import qcmData from '../mocks/qcm.json';
import { QcmModal } from './QcmModal';
import { KnowNationModal } from './KnowNationModal';
import { BuildStateModal } from './BuildStateModal';

interface QcmNode {
  numero: number;
  realise: boolean;
  correct?: boolean;
  disponible: boolean;
}

interface NodeStyle {
  backgroundColor: string;
  color: string;
}

const SCROLL_STEP = 80;
const NODE_SIZE = 40;
const CONNECTOR_WIDTH = 32;

export function QcmRoadmap() {
  // Charger les réponses depuis localStorage ou userData
  const loadQcmRealises = () => {
    const stored = localStorage.getItem('polityverse_qcm_realises');
    return stored ? JSON.parse(stored) : userData.qcmRealises;
  };

  const [qcmRealises, setQcmRealises] = useState(loadQcmRealises);
  const totalQcm = qcmData.length;

  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedQcmNumero, setSelectedQcmNumero] = useState<number | null>(null);
  const [showKnowNation, setShowKnowNation] = useState(false);
  const [showBuildState, setShowBuildState] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);

  // Créer tous les nodes depuis qcm.json (seulement ceux disponibles)
  const createNodes = (): QcmNode[] => {
    return qcmData
      .map((qcm: any, index: number) => {
        const numero = index + 1;
        const qcmRealise = qcmRealises.find((q: any) => q.numero === numero);
        
        return {
          numero,
          realise: !!qcmRealise,
          correct: qcmRealise?.correct,
          disponible: qcm.disponible ?? false,
        };
      })
      .filter(node => node.disponible); // Ne montrer que les QCM disponibles
  };

  const allNodes = createNodes();
  const [highlightedQcm, setHighlightedQcm] = useState<number | null>(null);

  // Gérer le clic sur un node
  const handleNodeClick = (node: QcmNode) => {
    setSelectedQcmNumero(node.numero);
  };

  // Gérer la soumission d'une réponse
  const handleSubmitAnswer = (numero: number, reponse: string, correct: boolean) => {
    const newAnswer = { numero, reponse, correct };
    const updatedAnswers = [...qcmRealises, newAnswer];
    setQcmRealises(updatedAnswers);

    // Sauvegarder dans localStorage
    localStorage.setItem('polityverse_qcm_realises', JSON.stringify(updatedAnswers));
    
    console.log('✅ Réponse sauvegardée:', newAnswer);
    console.log('📊 Total réponses:', updatedAnswers.length);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setSelectedQcmNumero(null);
  };

  // Naviguer entre les QCM
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedQcmNumero) return;

    const currentIndex = allNodes.findIndex(n => n.numero === selectedQcmNumero);
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedQcmNumero(allNodes[currentIndex - 1].numero);
    } else if (direction === 'next' && currentIndex < allNodes.length - 1) {
      setSelectedQcmNumero(allNodes[currentIndex + 1].numero);
    }
  };

  // Vérifier si on peut naviguer
  const getNavigationState = () => {
    if (!selectedQcmNumero) return { hasPrev: false, hasNext: false };
    
    const currentIndex = allNodes.findIndex(n => n.numero === selectedQcmNumero);
    return {
      hasPrev: currentIndex > 0,
      hasNext: currentIndex < allNodes.length - 1,
    };
  };

  // Gérer la recherche
  const handleSearch = (value: string) => {
    setSearchValue(value);
    const numero = parseInt(value);
    
    if (!isNaN(numero) && numero >= 1 && numero <= totalQcm) {
      // Scroll vers le numéro
      const targetPosition = (numero - 1) * SCROLL_STEP;
      const maxScroll = (allNodes.length - 7) * SCROLL_STEP;
      setScrollPosition(Math.min(targetPosition, maxScroll));
    }
  };

  // Aller au numéro
  const goToNumber = () => {
    const numero = parseInt(searchValue);
    if (!isNaN(numero) && numero >= 1 && numero <= totalQcm) {
      // Trouver l'index dans les nodes disponibles
      const nodeIndex = allNodes.findIndex(n => n.numero === numero);
      if (nodeIndex !== -1) {
        const targetPosition = (nodeIndex - 3) * SCROLL_STEP; // Centrer le numéro
        const maxScroll = Math.max(0, (allNodes.length - 7) * SCROLL_STEP);
        setScrollPosition(Math.max(0, Math.min(targetPosition, maxScroll)));
        
        // Mettre en évidence le QCM trouvé
        setHighlightedQcm(numero);
        setTimeout(() => setHighlightedQcm(null), 3000); // Enlever après 3s
      }
      setSearchValue('');
    }
  };

  // Calculer le style d'un node
  const getNodeStyle = (node: QcmNode): NodeStyle => {
    if (node.realise) {
      return {
        backgroundColor: POLITY_VERSE_COLORS.green,
        color: POLITY_VERSE_COLORS.white,
      };
    }
    
    if (node.disponible && !node.realise) {
      return {
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.3)',
      };
    }
    
    return {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.3)',
    };
  };

  // Calculer la couleur du connecteur
  const getConnectorColor = (node: QcmNode): string => {
    if (node.realise) {
      return `linear-gradient(to bottom, ${POLITY_VERSE_COLORS.green}, rgba(255,255,255,0.1))`;
    }
    return 'rgba(255,255,255,0.1)';
  };

  // Gérer le scroll avec la molette (horizontal)
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    setScrollPosition(prev => {
      const maxScroll = Math.max(0, (allNodes.length - 10) * SCROLL_STEP);
      const newPosition = prev + e.deltaY;
      return Math.max(0, Math.min(newPosition, maxScroll));
    });
  };

  // Gérer les touches clavier (horizontal)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setScrollPosition(prev => Math.max(0, prev - SCROLL_STEP));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const maxScroll = Math.max(0, (allNodes.length - 10) * SCROLL_STEP);
      setScrollPosition(prev => Math.min(maxScroll, prev + SCROLL_STEP));
    }
  };

  // Initialiser les event listeners
  useEffect(() => {
    const roadmapElement = roadmapRef.current;
    if (roadmapElement) {
      roadmapElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (roadmapElement) {
        roadmapElement.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [allNodes.length]);

  const handleScrollLeft = () => {
    setScrollPosition(prev => Math.max(0, prev - SCROLL_STEP * 3));
  };

  const handleScrollRight = () => {
    const maxScroll = (allNodes.length * (NODE_SIZE + CONNECTOR_WIDTH)) - (roadmapRef.current?.clientWidth || 0);
    setScrollPosition(prev => Math.min(maxScroll, prev + SCROLL_STEP * 3));
  };

  return (
    <div className="flex flex-col gap-3 w-full mx-auto">
      {/* Two choice cards */}
      <div className="flex gap-4 mb-4">
        {/* Know My Nation */}
        <div 
          className="flex-1 p-6 rounded-xl cursor-pointer transition-all hover:opacity-90 hover:scale-105"
          style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}
          onClick={() => setShowKnowNation(true)}
        >
          <h3 
            className="text-2xl font-bold mb-3"
            style={{ color: POLITY_VERSE_COLORS.green }}
          >
            Know My Nation
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Découvrez l'histoire fascinante de Madagascar à travers une carte temporelle interactive, 
            des origines jusqu'à nos jours.
          </p>
        </div>

        {/* Build a State */}
        <div 
          className="flex-1 p-6 rounded-xl cursor-pointer transition-all hover:opacity-90 hover:scale-105"
          style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}
          onClick={() => setShowBuildState(true)}
        >
          <h3 
            className="text-2xl font-bold mb-3"
            style={{ color: POLITY_VERSE_COLORS.green }}
          >
            Build a State
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Créez votre propre système politique depuis zéro : gérez une population, 
            un territoire et bâtissez les institutions de votre État idéal.
          </p>
        </div>
      </div>

      {/* Modals */}
      {showKnowNation && <KnowNationModal onClose={() => setShowKnowNation(false)} />}
      {showBuildState && <BuildStateModal onClose={() => setShowBuildState(false)} />}

      {/* Top row: Progress Info & Search - centered */}
      <div className="flex items-center justify-center gap-4">
        <ProgressInfo 
          realises={qcmRealises.length} 
          disponibles={allNodes.filter(n => n.disponible).length} 
        />
        
        <SearchBar 
          value={searchValue}
          onChange={handleSearch}
          onGo={goToNumber}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          isFocused={isSearchFocused}
          maxNumber={totalQcm}
        />
      </div>

      {/* Middle row: Roadmap horizontal with arrow buttons */}
      <div className="flex items-center gap-3">
        {/* Left Arrow */}
        <button
          onClick={handleScrollLeft}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80"
          style={{ backgroundColor: '#1b1b1b' }}
          disabled={scrollPosition === 0}
        >
          <span className="text-white text-xl font-bold">←</span>
        </button>

        {/* Roadmap */}
        <div 
          ref={roadmapRef}
          className="overflow-hidden flex-1"
        >
          <div
            className="flex items-center transition-transform duration-200"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {allNodes.map((node, index) => (
              <div key={node.numero} className="flex items-center">
                <QcmNode 
                  node={node} 
                  onClick={handleNodeClick}
                  style={getNodeStyle(node)}
                  isHighlighted={highlightedQcm === node.numero}
                />
                
                {index < allNodes.length - 1 && (
                  <Connector color={getConnectorColor(node)} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleScrollRight}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80"
          style={{ backgroundColor: '#1b1b1b' }}
        >
          <span className="text-white text-xl font-bold">→</span>
        </button>
      </div>

      {/* Modal QCM */}
      {selectedQcmNumero && (() => {
        const navState = getNavigationState();
        return (
          <QcmModal
            qcm={{
              numero: selectedQcmNumero,
              question: (qcmData[selectedQcmNumero - 1] as any).question,
              options: (qcmData[selectedQcmNumero - 1] as any).options,
              answer: (qcmData[selectedQcmNumero - 1] as any).answer,
              answers: (qcmData[selectedQcmNumero - 1] as any).answers,
              explanation: (qcmData[selectedQcmNumero - 1] as any).explanation,
            }}
            userAnswer={qcmRealises.find((q: any) => q.numero === selectedQcmNumero)}
            onClose={handleCloseModal}
            onSubmitAnswer={handleSubmitAnswer}
            onNavigate={handleNavigate}
            hasPrev={navState.hasPrev}
            hasNext={navState.hasNext}
          />
        );
      })()}
    </div>
  );
}

// Sous-composants
function ProgressInfo({ realises }: { realises: number; disponibles: number }) {
  return (
    <div className="text-center flex items-center gap-2">
      <h5 className="text-white/60 text-xs">Réalisés</h5>
      <p className="text-white text-2xl font-light">
        <span style={{ color: POLITY_VERSE_COLORS.green }} className="font-medium">
          {realises}
        </span>
      </p>
    </div>
  );
}

function QcmNode({ 
  node, 
  onClick, 
  style,
  isHighlighted 
}: { 
  node: QcmNode; 
  onClick: (node: QcmNode) => void;
  style: NodeStyle;
  isHighlighted?: boolean;
}) {
  return (
    <div
      onClick={() => onClick(node)}
      className="relative flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110"
      style={{ width: '48px', height: '48px' }}
    >
      {/* Cercle de surbrillance pour la recherche */}
      {isHighlighted && (
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: '60px',
            height: '60px',
            border: `3px solid ${POLITY_VERSE_COLORS.green}`,
            boxShadow: `0 0 20px ${POLITY_VERSE_COLORS.green}`,
          }}
        />
      )}
      
      <div
        className="flex items-center justify-center rounded-full font-bold transition-all duration-300"
        style={{
          width: `${NODE_SIZE}px`,
          height: `${NODE_SIZE}px`,
          backgroundColor: style.backgroundColor,
          color: style.color,
          fontSize: '16px',
          border: 'none',
        }}
      >
        {node.numero}
      </div>
    </div>
  );
}

function Connector({ color }: { color: string }) {
  return (
    <div
      className="mx-1"
      style={{
        width: `${CONNECTOR_WIDTH}px`,
        height: '2px',
        background: color,
      }}
    />
  );
}

function SearchBar({ 
  value, 
  onChange, 
  onGo,
  onFocus,
  onBlur,
  isFocused,
  maxNumber 
}: { 
  value: string; 
  onChange: (value: string) => void;
  onGo: () => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  maxNumber: number;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onGo();
    }
  };

  return (
    <div className="w-20">
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div 
        className="relative transition-all duration-300"
        style={{
          transform: isFocused ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <input
          type="number"
          min="1"
          max={maxNumber}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="#"
          className="w-full px-2 py-2 rounded-full font-bold text-center transition-all duration-300"
          style={{
            backgroundColor: POLITY_VERSE_COLORS.dark,
            color: POLITY_VERSE_COLORS.white,
            border: `2px solid ${isFocused ? POLITY_VERSE_COLORS.green : 'rgba(255,255,255,0.2)'}`,
            boxShadow: isFocused ? `0 0 20px ${POLITY_VERSE_COLORS.green}40` : 'none',
            outline: 'none',
          }}
        />
        {value && (
          <button
            onClick={onGo}
            className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.green,
              color: POLITY_VERSE_COLORS.white,
            }}
          >
            ➜
          </button>
        )}
      </div>
    </div>
  );
}


