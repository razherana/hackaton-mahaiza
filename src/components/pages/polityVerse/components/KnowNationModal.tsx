import { POLITY_VERSE_COLORS } from '../constants';

interface KnowNationModalProps {
  onClose: () => void;
}

export function KnowNationModal({ onClose }: KnowNationModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div 
        className="max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-8"
        style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-4xl font-bold mb-3"
            style={{ color: POLITY_VERSE_COLORS.green }}
          >
            Know My Nation
          </h2>
          <p className="text-white/70 text-lg">
            L'histoire de Madagascar à travers une carte temporelle interactive
          </p>
          <div className="h-px bg-white/20 mt-6" />
        </div>

        {/* Timeline placeholder */}
        <div className="space-y-8">
          <div 
            className="p-8 rounded-xl text-center"
            style={{ backgroundColor: POLITY_VERSE_COLORS.dark }}
          >
            <h3 
              className="text-2xl font-semibold mb-4"
              style={{ color: POLITY_VERSE_COLORS.green }}
            >
              Carte Temporelle de Madagascar
            </h3>
            <p className="text-white/60 text-lg mb-6">
              Explorez les grandes périodes de l'histoire malgache
            </p>
            
            {/* Timeline sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <TimelineCard 
                period="Avant 1500"
                title="Les Origines"
                description="Arrivée des premiers habitants, migrations austronésiennes et africaines"
              />
              <TimelineCard 
                period="1500-1800"
                title="Les Royaumes"
                description="Formation des royaumes Merina, Sakalava, Betsileo et autres entités politiques"
              />
              <TimelineCard 
                period="1800-1896"
                title="Le Royaume de Madagascar"
                description="Unification sous Andrianampoinimerina et Radama I, modernisation du royaume"
              />
              <TimelineCard 
                period="1896-1960"
                title="Période Coloniale"
                description="Colonisation française, résistances et mouvements nationalistes"
              />
              <TimelineCard 
                period="1960-Aujourd'hui"
                title="Madagascar Indépendante"
                description="Indépendance, Première, Deuxième et Troisième République, défis contemporains"
              />
              <TimelineCard 
                period="Futur"
                title="Perspectives"
                description="Défis démocratiques, développement économique et enjeux sociaux"
              />
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-80 mt-8"
          style={{ 
            backgroundColor: POLITY_VERSE_COLORS.green,
            color: POLITY_VERSE_COLORS.white 
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function TimelineCard({ period, title, description }: { period: string; title: string; description: string }) {
  return (
    <div 
      className="p-6 rounded-lg text-left hover:scale-105 transition-transform cursor-pointer"
      style={{ backgroundColor: POLITY_VERSE_COLORS.darkerBlack }}
    >
      <p 
        className="text-sm font-bold mb-2"
        style={{ color: POLITY_VERSE_COLORS.green }}
      >
        {period}
      </p>
      <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  );
}
