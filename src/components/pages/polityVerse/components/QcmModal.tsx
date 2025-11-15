import { useState, useEffect } from 'react';
import { POLITY_VERSE_COLORS } from '../constants';

interface QcmData {
  numero: number;
  question: string;
  options: string[];
  answer?: string;
  answers?: string[];
  explanation: string;
}

interface UserAnswer {
  numero: number;
  reponse: string;
  correct: boolean;
}

interface QcmModalProps {
  qcm: QcmData;
  userAnswer?: UserAnswer;
  onClose: () => void;
  onSubmitAnswer: (numero: number, reponse: string, correct: boolean) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function QcmModal({ qcm, userAnswer, onClose, onSubmitAnswer, onNavigate, hasPrev, hasNext }: QcmModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(!!userAnswer);

  // Réinitialiser l'état quand on change de QCM
  useEffect(() => {
    setSelectedOptions([]);
    setShowExplanation(!!userAnswer);
  }, [qcm.numero, userAnswer]);

  // Déterminer les bonnes réponses (peut être une seule ou plusieurs)
  const correctAnswers = qcm.answers || (qcm.answer ? [qcm.answer] : []);

  // Gérer la sélection/désélection d'une option
  const toggleOption = (letter: string) => {
    if (showExplanation) return; // Ne pas permettre de changer après validation

    setSelectedOptions(prev => {
      if (prev.includes(letter)) {
        // Désélectionner
        return prev.filter(opt => opt !== letter);
      } else {
        // Sélectionner (max 3)
        if (prev.length >= 3) return prev;
        return [...prev, letter];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;

    // Vérifier si toutes les réponses sélectionnées sont correctes
    // ET si toutes les bonnes réponses ont été sélectionnées
    const allSelectedCorrect = selectedOptions.every(opt => correctAnswers.includes(opt));
    const allCorrectSelected = correctAnswers.every(opt => selectedOptions.includes(opt));
    const isCorrect = allSelectedCorrect && allCorrectSelected;
    
    // Sauvegarder la première sélection (pour compatibilité)
    onSubmitAnswer(qcm.numero, selectedOptions.join(','), isCorrect);
    setShowExplanation(true);
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  const isAnswered = !!userAnswer;
  const displayedAnswers = userAnswer?.reponse ? userAnswer.reponse.split(',') : selectedOptions;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl mx-4 rounded-xl shadow-2xl animate-scale-in"
        style={{
          backgroundColor: POLITY_VERSE_COLORS.dark,
          border: `2px solid ${POLITY_VERSE_COLORS.green}`,
          boxShadow: `0 0 40px ${POLITY_VERSE_COLORS.green}40`,
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 rounded-t-2xl border-b"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderBottomColor: 'rgba(255,255,255,0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Navigation gauche */}
            <button
              onClick={() => onNavigate('prev')}
              disabled={!hasPrev}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: hasPrev ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                color: POLITY_VERSE_COLORS.white,
              }}
            >
              ←
            </button>

            {/* Centre - Numéro QCM */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: POLITY_VERSE_COLORS.green,
                  color: POLITY_VERSE_COLORS.white,
                }}
              >
                {qcm.numero}
              </div>
              <h2 className="text-lg font-bold" style={{ color: POLITY_VERSE_COLORS.white }}>
                QCM #{qcm.numero}
              </h2>
            </div>

            {/* Navigation droite et fermer */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('next')}
                disabled={!hasNext}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: hasNext ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                  color: POLITY_VERSE_COLORS.white,
                }}
              >
                →
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: POLITY_VERSE_COLORS.white,
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {/* Question */}
          <div className="mb-6">
            <p className="text-lg font-medium leading-relaxed" style={{ color: POLITY_VERSE_COLORS.white }}>
              {qcm.question}
            </p>
            {!showExplanation && selectedOptions.length > 0 && (
              <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {selectedOptions.length} réponse{selectedOptions.length > 1 ? 's' : ''} sélectionnée{selectedOptions.length > 1 ? 's' : ''} (max 3)
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {qcm.options.map((option, index) => {
              const letter = getOptionLetter(index);
              const isSelected = selectedOptions.includes(letter);
              const isUserAnswer = displayedAnswers.includes(letter);
              const isCorrectAnswer = correctAnswers.includes(letter);
              
              let optionStyle = {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: POLITY_VERSE_COLORS.white,
              };

              if (showExplanation) {
                if (isCorrectAnswer) {
                  // Vert pour les bonnes réponses
                  optionStyle = {
                    backgroundColor: `${POLITY_VERSE_COLORS.green}20`,
                    borderColor: POLITY_VERSE_COLORS.green,
                    color: POLITY_VERSE_COLORS.white,
                  };
                } else if (isUserAnswer && !isCorrectAnswer) {
                  // Rouge pour les mauvaises réponses de l'utilisateur
                  optionStyle = {
                    backgroundColor: 'rgba(220,38,38,0.2)',
                    borderColor: 'rgba(220,38,38,0.8)',
                    color: POLITY_VERSE_COLORS.white,
                  };
                }
              } else if (isSelected) {
                optionStyle = {
                  backgroundColor: `${POLITY_VERSE_COLORS.green}30`,
                  borderColor: POLITY_VERSE_COLORS.green,
                  color: POLITY_VERSE_COLORS.white,
                };
              }

              return (
                <button
                  key={letter}
                  onClick={() => !isAnswered && toggleOption(letter)}
                  disabled={isAnswered}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-[1.02]"
                  style={optionStyle}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold flex-shrink-0">{letter}.</span>
                    <span className="flex-1">{option}</span>
                    {!showExplanation && isSelected && (
                      <span className="flex-shrink-0" style={{ color: POLITY_VERSE_COLORS.green }}>✓</span>
                    )}
                    {showExplanation && isCorrectAnswer && (
                      <span className="flex-shrink-0" style={{ color: POLITY_VERSE_COLORS.green }}>✓</span>
                    )}
                    {showExplanation && isUserAnswer && !isCorrectAnswer && (
                      <span className="flex-shrink-0" style={{ color: 'rgba(220,38,38,0.8)' }}>✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after answer) */}
          {showExplanation && (
            <div 
              className="px-4 py-3 rounded-lg border-l-4 animate-slide-down"
              style={{
                backgroundColor: `${POLITY_VERSE_COLORS.green}10`,
                borderLeftColor: POLITY_VERSE_COLORS.green,
              }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: POLITY_VERSE_COLORS.green }}>
                📚 Explication
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {qcm.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isAnswered && (
          <div 
            className="px-6 py-4 rounded-b-2xl border-t"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderTopColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0}
              className="w-full py-3 rounded-lg font-bold text-center transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: selectedOptions.length > 0 ? POLITY_VERSE_COLORS.green : 'rgba(255,255,255,0.1)',
                color: POLITY_VERSE_COLORS.white,
              }}
            >
              Valider {selectedOptions.length > 0 ? `(${selectedOptions.length})` : 'ma réponse'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
