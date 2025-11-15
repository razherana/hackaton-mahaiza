import { POLITY_VERSE_COLORS } from '../constants';

interface LummyConstatModalProps {
  onClose: () => void;
}

export function LummyConstatModal({ onClose }: LummyConstatModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
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
          className="sticky top-0 px-6 py-4 border-b flex items-center justify-between backdrop-blur-sm z-10"
          style={{
            backgroundColor: POLITY_VERSE_COLORS.dark + 'f0',
            borderColor: POLITY_VERSE_COLORS.green
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <h2 className="text-2xl font-bold" style={{ color: POLITY_VERSE_COLORS.green }}>
              Constat de Lummy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.dark,
              border: `2px solid ${POLITY_VERSE_COLORS.green}`
            }}
          >
            <span className="text-white text-xl leading-none font-bold">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* État Actuel */}
          <section
            className="p-5 rounded-lg border"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.dark + '80',
              borderColor: '#3b82f6' + '40',
              boxShadow: `0 0 15px #3b82f640`,
              animation: 'slideInFromLeft 0.5s ease-out 0.1s both'
            }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#3b82f6' }}>
              <span className="text-xl">📊</span>
              État Actuel du Système
            </h3>
            <div className="space-y-2 text-white/90 text-sm">
              <p>• <strong>4 catégories institutionnelles</strong> : Exécutif, Législatif, Judiciaire, et Armée</p>
              <p>• <strong>15 institutions principales</strong> réparties sur 3 niveaux hiérarchiques</p>
              <p>• <strong>2 catégories de lois</strong> : Lois Ordinaires (3) et Lois de Finances (2)</p>
              <p>• Système présidentiel avec séparation des pouvoirs</p>
              <p>• Structure gouvernementale complète incluant le Premier Ministre et les ministères</p>
            </div>
          </section>

          {/* Bons Points */}
          <section
            className="p-5 rounded-lg border"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.dark + '80',
              borderColor: '#10b981' + '40',
              boxShadow: `0 0 15px #10b98140`,
              animation: 'slideInFromLeft 0.5s ease-out 0.2s both'
            }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#10b981' }}>
              <span className="text-xl">✅</span>
              Points Positifs
            </h3>
            <div className="space-y-3">
              <div className="pl-4 border-l-2" style={{ borderColor: '#10b981' }}>
                <h4 className="font-semibold text-white mb-1">Structure institutionnelle claire</h4>
                <p className="text-white/80 text-sm">Hiérarchie bien définie avec 3 niveaux permettant une organisation efficace et une chaîne de commandement limpide.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#10b981' }}>
                <h4 className="font-semibold text-white mb-1">Séparation des pouvoirs respectée</h4>
                <p className="text-white/80 text-sm">Les 4 catégories (Exécutif, Législatif, Judiciaire, Armée) maintiennent une séparation équilibrée évitant la concentration du pouvoir.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#10b981' }}>
                <h4 className="font-semibold text-white mb-1">Cadre législatif diversifié</h4>
                <p className="text-white/80 text-sm">Distinction entre lois ordinaires et lois de finances permettant une gestion adaptée selon les domaines.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#10b981' }}>
                <h4 className="font-semibold text-white mb-1">Interactions inter-institutionnelles définies</h4>
                <p className="text-white/80 text-sm">Chaque institution a des rôles et interactions clairement établis avec les autres entités gouvernementales.</p>
              </div>
            </div>
          </section>

          {/* Problèmes */}
          <section
            className="p-5 rounded-lg border"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.dark + '80',
              borderColor: '#ef4444' + '40',
              boxShadow: `0 0 15px #ef444440`,
              animation: 'slideInFromLeft 0.5s ease-out 0.3s both'
            }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
              <span className="text-xl">⚠️</span>
              Problèmes Identifiés
            </h3>
            <div className="space-y-3">
              <div className="pl-4 border-l-2" style={{ borderColor: '#ef4444' }}>
                <h4 className="font-semibold text-white mb-1">Manque de contre-pouvoirs au niveau 1</h4>
                <p className="text-white/80 text-sm">Le Président de la République (Exécutif niveau 1) pourrait avoir trop de pouvoir sans mécanismes de contrôle suffisants au même niveau hiérarchique.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#ef4444' }}>
                <h4 className="font-semibold text-white mb-1">Nombre limité de lois de finances</h4>
                <p className="text-white/80 text-sm">Seulement 2 lois de finances pour gérer l'économie nationale, ce qui pourrait être insuffisant pour une gestion budgétaire complète.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#ef4444' }}>
                <h4 className="font-semibold text-white mb-1">Absence de mécanismes de participation citoyenne</h4>
                <p className="text-white/80 text-sm">Aucune institution dédiée à la consultation populaire ou aux référendums directs dans la structure actuelle.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#ef4444' }}>
                <h4 className="font-semibold text-white mb-1">Potentiel de conflits inter-institutionnels</h4>
                <p className="text-white/80 text-sm">Les interactions multiples entre institutions pourraient créer des zones de friction sans médiateur neutre clairement défini.</p>
              </div>
            </div>
          </section>

          {/* Solutions Proposées */}
          <section
            className="p-5 rounded-lg border"
            style={{
              backgroundColor: POLITY_VERSE_COLORS.dark + '80',
              borderColor: '#8b5cf6' + '40',
              boxShadow: `0 0 15px #8b5cf640`,
              animation: 'slideInFromLeft 0.5s ease-out 0.4s both'
            }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#8b5cf6' }}>
              <span className="text-xl">💡</span>
              Solutions Proposées
            </h3>
            <div className="space-y-3">
              <div className="pl-4 border-l-2" style={{ borderColor: '#8b5cf6' }}>
                <h4 className="font-semibold text-white mb-1">1. Créer un Conseil Constitutionnel indépendant</h4>
                <p className="text-white/80 text-sm">Institution de niveau 1 dans la catégorie Judiciaire, chargée de contrôler la constitutionnalité des lois et des actes du Président.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#8b5cf6' }}>
                <h4 className="font-semibold text-white mb-1">2. Enrichir le cadre législatif financier</h4>
                <p className="text-white/80 text-sm">Ajouter des lois sur : la dette publique, les investissements étrangers, la politique monétaire, et les fonds souverains.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#8b5cf6' }}>
                <h4 className="font-semibold text-white mb-1">3. Instituer un mécanisme de démocratie participative</h4>
                <p className="text-white/80 text-sm">Créer une "Commission de Consultation Citoyenne" permettant des référendums d'initiative populaire et des consultations publiques.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#8b5cf6' }}>
                <h4 className="font-semibold text-white mb-1">4. Établir un Médiateur de la République</h4>
                <p className="text-white/80 text-sm">Autorité indépendante pour résoudre les conflits entre institutions et protéger les droits des citoyens face à l'administration.</p>
              </div>
              <div className="pl-4 border-l-2" style={{ borderColor: '#8b5cf6' }}>
                <h4 className="font-semibold text-white mb-1">5. Renforcer la transparence institutionnelle</h4>
                <p className="text-white/80 text-sm">Créer une loi sur l'accès à l'information publique et établir des mécanismes de publication obligatoire des décisions gouvernementales.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
    </div>
  );
}
