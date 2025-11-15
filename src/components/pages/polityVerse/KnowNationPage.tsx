import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { POLITY_VERSE_COLORS } from './constants';
import histoireData from './mocks/histoire.json';
import friseData from './mocks/frise.json';

interface HistoireItem {
  date: string;
  evenement: string;
  description: string;
  type: string;
  dates_proposees: string[];
  evenements_proposes: Array<{
    evenement: string;
    description: string;
  }>;
}

interface FriseItem {
  date: string;
  evenement: string;
  description: string;
}

interface NewEventForm {
  date: string;
  evenement: string;
  description: string;
}

type InputMode = 'date' | 'event';
type QuestionType = 'date-to-events' | 'event-to-dates' | null;
type ResultType = 'correct' | 'wrong' | null;

export function KnowNationPage() {
  const navigate = useNavigate();
  const [showLummySuggestions, setShowLummySuggestions] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('date');
  const [inputValue, setInputValue] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [options, setOptions] = useState<HistoireItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(-1);
  const [showResult, setShowResult] = useState<ResultType>(null);
  
  // États pour le formulaire d'ajout d'événement
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEventForm>({
    date: '',
    evenement: '',
    description: ''
  });
  
  // État pour afficher la frise
  const [showFrise, setShowFrise] = useState(true);

  const handleValidate = () => {
    if (!inputValue.trim()) return;

    if (inputMode === 'date') {
      // Mode date: chercher l'événement pour cette date
      const matchingItem = histoireData.find(item => item.date === inputValue.trim());
      
      if (matchingItem) {
        setQuestionType('date-to-events');
        setCurrentQuestion(`Quel événement s'est passé en ${inputValue} ?`);
        
        // Mélanger les options
        const allOptions = [matchingItem, ...histoireData.filter(item => item.date !== inputValue.trim()).slice(0, 3)];
        const shuffled = allOptions.sort(() => Math.random() - 0.5);
        setOptions(shuffled);
        setCorrectAnswerIndex(shuffled.findIndex(item => item.date === inputValue.trim()));
      }
    } else {
      // Mode événement: chercher la date de cet événement
      const matchingItem = histoireData.find(item => 
        item.evenement.toLowerCase().includes(inputValue.trim().toLowerCase())
      );
      
      if (matchingItem) {
        setQuestionType('event-to-dates');
        setCurrentQuestion(`En quelle année s'est passé ${matchingItem.evenement} ?`);
        
        // Créer des options avec différentes dates
        const correctOption = matchingItem;
        const wrongOptions = histoireData
          .filter(item => item.date !== matchingItem.date)
          .slice(0, 3);
        
        const allOptions = [correctOption, ...wrongOptions];
        const shuffled = allOptions.sort(() => Math.random() - 0.5);
        setOptions(shuffled);
        setCorrectAnswerIndex(shuffled.findIndex(item => item.date === matchingItem.date));
      }
    }
    
    setInputValue('');
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    
    setTimeout(() => {
      setOptions([]);
    }, 300);

    setTimeout(() => {
      if (index === correctAnswerIndex) {
        setShowResult('correct');
      } else {
        setShowResult('wrong');
      }
    }, 200);
    
    // Après avoir affiché le résultat, on montre la frise au lieu de réinitialiser le quiz
    if (index === correctAnswerIndex) {
      setTimeout(() => {
        setShowResult(null);
        setQuestionType(null);
        setCurrentQuestion('');
        setOptions([]);
        setSelectedAnswer(null);
        setCorrectAnswerIndex(-1);
        setShowLummySuggestions(false);
        setShowFrise(true); // Afficher la frise
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(null);
        setQuestionType(null);
        setCurrentQuestion('');
        setOptions([]);
        setSelectedAnswer(null);
        setCorrectAnswerIndex(-1);
        setShowLummySuggestions(false);
        setShowFrise(true); // Afficher la frise même en cas de mauvaise réponse
      }, 1200);
    }
  };

  const handleAddEvent = () => {
    console.log('Nouvel événement:', newEvent);
    setShowAddModal(false);
    setShowSuccessAnimation(true);
    
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setNewEvent({
        date: '',
        evenement: '',
        description: ''
      });
    }, 1500);
  };

  return (
    <div 
      className="relative w-full h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}
    >
      {/* Bouton croix pour retour */}
      <button
        onClick={() => navigate('/polity-verse')}
        className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 hover:rotate-90"
        style={{
          border: `2px solid white`,
          backgroundColor: `${POLITY_VERSE_COLORS.dark}dd`
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* En-tête */}
      <div className="p-4 text-center space-y-4 pt-8">
        <h1 
          className="text-4xl font-bold"
          style={{ color: POLITY_VERSE_COLORS.green }}
        >
          Décryptons l'histoire de Madagascar
        </h1>
        
        {/* Section éducative */}
        <div className="max-w-4xl mx-auto pt-4">
          <p className="text-gray-300 text-sm mb-4 italic">
            "Un peuple sans mémoire est un peuple sans avenir"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Point 1 */}
            <div 
              className="p-4 rounded-lg border transition-all hover:scale-105"
              style={{
                backgroundColor: `${POLITY_VERSE_COLORS.dark}cc`,
                borderColor: `${POLITY_VERSE_COLORS.green}30`
              }}
            >
              <div className="flex items-start gap-3">
                <span 
                  className="text-2xl font-bold mt-1"
                  style={{ color: POLITY_VERSE_COLORS.green }}
                >
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Comprendre notre présent
                  </h3>
                  <p className="text-gray-400 text-xs">
                    L'histoire nous aide à comprendre les défis actuels et les choix qui ont façonné notre nation.
                  </p>
                </div>
              </div>
            </div>

            {/* Point 2 */}
            <div 
              className="p-4 rounded-lg border transition-all hover:scale-105"
              style={{
                backgroundColor: `${POLITY_VERSE_COLORS.dark}cc`,
                borderColor: `${POLITY_VERSE_COLORS.green}30`
              }}
            >
              <div className="flex items-start gap-3">
                <span 
                  className="text-2xl font-bold mt-1"
                  style={{ color: POLITY_VERSE_COLORS.green }}
                >
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Honorer nos ancêtres
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Le devoir de mémoire rend hommage à ceux qui ont lutté pour notre indépendance et nos libertés.
                  </p>
                </div>
              </div>
            </div>

            {/* Point 3 */}
            <div 
              className="p-4 rounded-lg border transition-all hover:scale-105"
              style={{
                backgroundColor: `${POLITY_VERSE_COLORS.dark}cc`,
                borderColor: `${POLITY_VERSE_COLORS.green}30`
              }}
            >
              <div className="flex items-start gap-3">
                <span 
                  className="text-2xl font-bold mt-1"
                  style={{ color: POLITY_VERSE_COLORS.green }}
                >
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Construire notre avenir
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Apprendre du passé nous permet de bâtir un futur meilleur pour les générations futures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center p-8">
        {!questionType && !showFrise && showLummySuggestions && (
          // Phase d'entrée - affichée seulement si Lummy cliqué
          <div 
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ 
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
              <div 
                className="relative rounded-xl p-8 w-full max-w-2xl"
                style={{
                  backgroundColor: POLITY_VERSE_COLORS.dark,
                  border: `2px solid ${POLITY_VERSE_COLORS.green}`
                }}
              >
                {/* Bouton X pour fermer */}
               <button
                onClick={() => {
                  setShowLummySuggestions(false);
                  setShowFrise(true);
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10 hover:rotate-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center" style={{ color: POLITY_VERSE_COLORS.green }}>
                    Testez vos connaissances sur l'histoire de Madagascar
                  </h2>

                  {/* Choix du mode */}
                  <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setInputMode('date')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: inputMode === 'date' ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.dark,
                      border: `2px solid ${POLITY_VERSE_COLORS.green}`
                    }}
                  >
                    Entrer une date
                  </button>
                  <button
                    onClick={() => setInputMode('event')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: inputMode === 'event' ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.dark,
                      border: `2px solid ${POLITY_VERSE_COLORS.green}`
                    }}
                  >
                    Entrer un événement
                  </button>
                </div>

                {/* Champ de saisie */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                    placeholder={inputMode === 'date' ? "Ex: 1960" : "Ex: Protectorat français"}
                    className="w-full px-6 py-4 rounded-lg text-lg transition-all focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: POLITY_VERSE_COLORS.dark,
                      border: `2px solid ${POLITY_VERSE_COLORS.green}`,
                      color: 'white'
                    }}
                  />
                  
                  <button
                    onClick={handleValidate}
                    className="w-full py-4 rounded-lg text-lg font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: POLITY_VERSE_COLORS.green,
                      color: 'white'
                    }}
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showFrise && (
          // Affichage de la frise chronologique
          <FriseChronologique events={friseData as FriseItem[]} />
        )}

        {questionType && (
          // Phase de question
          <div className="w-full space-y-8" style={{ width: '80%' }}>
            {/* Question */}
            <h2 
              className="text-3xl font-bold text-center transition-opacity duration-300"
              style={{
                color: POLITY_VERSE_COLORS.green,
                opacity: options.length > 0 ? 1 : 0
              }}
            >
              {currentQuestion}
            </h2>

            {/* Options en cartes horizontales */}
            <div 
              className="grid grid-cols-2 gap-6 transition-opacity duration-300"
              style={{
                opacity: options.length > 0 ? 1 : 0
              }}
            >
              {options.map((option, index) => (
                <HistoireCard
                  key={index}
                  option={option}
                  isSelected={selectedAnswer === index}
                  onClick={() => handleSelectAnswer(index)}
                  questionType={questionType}
                />
              ))}
            </div>
          </div>
        )}

        {/* Animation de résultat */}
        {showResult && <ResultAnimation result={showResult} />}
      </div>

      {/* Icône d'ajout en bas à gauche */}
      <div className="absolute bottom-8 left-8 z-10">
        <button
          onClick={() => setShowAddModal(true)}
          className="p-4 rounded-full transition-all hover:scale-110"
          style={{
            backgroundColor: POLITY_VERSE_COLORS.green,
            boxShadow: `0 0 10px ${POLITY_VERSE_COLORS.green}20`
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Logo Lummy en bas à droite */}
      <div className="absolute bottom-8 right-8 z-10">
        <button
          onClick={() => {
            setShowLummySuggestions(!showLummySuggestions);
            setShowFrise(!showFrise);
          }}
          className="flex flex-col items-center gap-2 group transition-all hover:scale-105"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden transition-all"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.dark,
              border: `3px solid ${POLITY_VERSE_COLORS.green}`,
              boxShadow: `0 4px 20px ${POLITY_VERSE_COLORS.green}40`
            }}
          >
            <img 
              src="/lummy_logo.png" 
              alt="Lummy Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-semibold text-white group-hover:opacity-80 transition-opacity">
            Voir les suggestions de Lummy
          </p>
        </button>
      </div>

      {/* Modal d'ajout d'événement */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          <div 
            className="relative rounded-xl p-8 w-full max-w-2xl"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.dark,
              border: `2px solid ${POLITY_VERSE_COLORS.green}`
            }}
          >
            {/* Bouton X pour fermer */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10 hover:rotate-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: POLITY_VERSE_COLORS.green }}
            >
              Ajouter un nouvel événement
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Date</label>
                <input
                  type="text"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: POLITY_VERSE_COLORS.dark,
                    border: `2px solid ${POLITY_VERSE_COLORS.green}30`,
                    color: 'white'
                  }}
                  placeholder="Ex: 1960"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Événement</label>
                <input
                  type="text"
                  value={newEvent.evenement}
                  onChange={(e) => setNewEvent({...newEvent, evenement: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: POLITY_VERSE_COLORS.dark,
                    border: `2px solid ${POLITY_VERSE_COLORS.green}30`,
                    color: 'white'
                  }}
                  placeholder="Ex: Indépendance de Madagascar"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg h-32 resize-none"
                  style={{
                    backgroundColor: POLITY_VERSE_COLORS.dark,
                    border: `2px solid ${POLITY_VERSE_COLORS.green}30`,
                    color: 'white'
                  }}
                  placeholder="Décrivez l'événement..."
                />
              </div>

              {/* Bouton Valider avec Lummy */}
              <button
                onClick={handleAddEvent}
                className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all hover:opacity-90"
                style={{
                  backgroundColor: POLITY_VERSE_COLORS.green,
                  color: 'white'
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: 'white'
                  }}
                >
                  <img 
                    src="/lummy_logo.png" 
                    alt="Lummy" 
                    className="w-full h-full object-cover"
                  />
                </div>
                Valider avec Lummy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation de succès d'ajout */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="text-center"
            style={{
              animation: 'scaleUp 1.5s ease-out'
            }}
          >
            <div
              className="text-8xl font-bold mb-4"
              style={{
                color: POLITY_VERSE_COLORS.green,
                textShadow: `0 0 30px ${POLITY_VERSE_COLORS.green}60`
              }}
            >
              ✓
            </div>
            <p className="text-4xl font-bold text-white">
              Événement ajouté !
            </p>
          </div>
        </div>
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleUp {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-10px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}

// Composant frise chronologique
function FriseChronologique({ events }: { events: FriseItem[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Gestion du scroll avec les touches fléchées
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrollContainerRef.current) {
        const scrollAmount = 300; // Pixels à défiler
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">

      {/* Container avec scroll horizontal */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden px-16 pt-2"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          scrollbarColor: `${POLITY_VERSE_COLORS.green}40 transparent`
        }}
      >
        <div className="relative h-full min-w-max">
          {/* Ligne horizontale centrale */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
            style={{ 
              background: `linear-gradient(to right, transparent, ${POLITY_VERSE_COLORS.green}30, ${POLITY_VERSE_COLORS.green}30, transparent)`
            }}
          />

          {/* Événements en ligne horizontale */}
          <div className="flex items-center h-full gap-24">
            {events.map((event, index) => {
              const isTop = index % 2 === 0;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    animation: `slideInHorizontal 0.5s ease-out ${index * 0.05}s both`,
                    minWidth: '280px'
                  }}
                >
                  {/* Contenu positionné au-dessus ou en-dessous */}
                  <div 
                    className={`flex flex-col items-center ${isTop ? 'flex-col-reverse' : 'flex-col'}`}
                    style={{ height: '100%' }}
                  >
                    {/* Espace */}
                    <div style={{ flex: 1 }} />

                    {/* Ligne verticale connectant au point */}
                    <div
                      className="w-0.5 transition-all duration-300"
                      style={{
                        height: '60px',
                        backgroundColor: isHovered ? POLITY_VERSE_COLORS.green : `${POLITY_VERSE_COLORS.green}80`
                      }}
                    />

                    {/* Point central */}
                    <div
                      className="relative transition-all duration-300 z-10"
                      style={{
                        transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                        margin: '0'
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: isHovered ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.dark,
                          border: `2px solid ${POLITY_VERSE_COLORS.green}`,
                          boxShadow: isHovered ? `0 0 15px ${POLITY_VERSE_COLORS.green}` : 'none'
                        }}
                      />
                      {isHovered && (
                        <div
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            backgroundColor: POLITY_VERSE_COLORS.green,
                            opacity: 0.3
                          }}
                        />
                      )}
                    </div>

                    {/* Ligne verticale connectant au point */}
                    <div
                      className="w-0.5 transition-all duration-300"
                      style={{
                        height: '60px',
                        backgroundColor: isHovered ? POLITY_VERSE_COLORS.green : `${POLITY_VERSE_COLORS.green}80`
                      }}
                    />

                    {/* Carte d'événement */}
                    <div style={{ flex: 1, display: 'flex', alignItems: isTop ? 'flex-end' : 'flex-start', paddingTop: isTop ? 0 : '20px', paddingBottom: isTop ? '20px' : 0 }}>
                      <div
                        className="px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer text-center"
                        style={{
                          backgroundColor: isHovered ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.dark,
                          border: `1px solid ${POLITY_VERSE_COLORS.green}${isHovered ? '' : '30'}`,
                          boxShadow: isHovered ? `0 4px 20px ${POLITY_VERSE_COLORS.green}40` : 'none',
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          width: '280px'
                        }}
                      >
                        {/* Date */}
                        <p 
                          className="text-lg font-bold mb-2"
                          style={{ 
                            color: isHovered ? '#7FFF00' : POLITY_VERSE_COLORS.green,
                            letterSpacing: '0.08em',
                            fontSize: '1.125rem',
                            textShadow: isHovered ? `0 0 12px ${POLITY_VERSE_COLORS.green}80` : `0 0 4px ${POLITY_VERSE_COLORS.green}40`,
                            fontWeight: '700'
                          }}
                        >
                          {event.date}
                        </p>
                        
                        {/* Événement */}
                        <h3 
                          className="text-base font-bold mb-2"
                          style={{ color: 'white' }}
                        >
                          {event.evenement}
                        </h3>
                        
                        {/* Description visible seulement au survol */}
                        {isHovered && (
                          <p 
                            className="text-xs text-white/80 mt-2 pt-2 border-t border-white/20"
                            style={{
                              animation: 'fadeIn 0.2s ease-out'
                            }}
                          >
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Espace */}
                    <div style={{ flex: 1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInHorizontal {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Style de la scrollbar pour webkit */
        div::-webkit-scrollbar {
          height: 8px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: ${POLITY_VERSE_COLORS.green}40;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: ${POLITY_VERSE_COLORS.green}60;
        }
      `}</style>
    </div>
  );
}

// Composant carte d'histoire
function HistoireCard({ option, isSelected, onClick, questionType }: {
  option: HistoireItem;
  isSelected: boolean;
  onClick: () => void;
  questionType: QuestionType;
}) {
  return (
    <div
      onClick={onClick}
      className="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: isSelected ? POLITY_VERSE_COLORS.green : POLITY_VERSE_COLORS.dark,
        border: `2px solid ${POLITY_VERSE_COLORS.green}`,
        boxShadow: isSelected ? `0 8px 30px ${POLITY_VERSE_COLORS.green}40` : 'none',
        opacity: isSelected ? 1 : 0.9
      }}
    >
      <h3 className="text-2xl font-bold mb-3" style={{ color: 'white' }}>
        {questionType === 'date-to-events' ? option.evenement : option.date}
      </h3>
      <p className="text-gray-400">
        {questionType === 'date-to-events' ? option.description : option.evenement}
      </p>
    </div>
  );
}

// Composant animation de résultat
function ResultAnimation({ result }: { result: ResultType }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="text-center"
        style={{
          animation: result === 'correct' ? 'scaleUp 1.5s ease-out' : 'shake 1.2s ease-out'
        }}
      >
        <p
          className="text-8xl font-bold"
          style={{
            color: result === 'correct' ? POLITY_VERSE_COLORS.green : '#ff4444',
            textShadow: result === 'correct' 
              ? `0 0 30px ${POLITY_VERSE_COLORS.green}60`
              : '0 0 30px #ff444460'
          }}
        >
          {result === 'correct' ? 'Bien joué !' : 'C\'est dommage !'}
        </p>
      </div>
    </div>
  );
}
