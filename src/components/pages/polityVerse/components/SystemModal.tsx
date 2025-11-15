import React from 'react';
import systemData from '../mocks/system.json';
import { POLITY_VERSE_COLORS } from '../constants';

export function SystemModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-[#1b1b1b] rounded-2xl p-6 max-w-3xl w-full mx-4 relative"
        style={{ color: POLITY_VERSE_COLORS.white }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-[#0a0a0a] border border-green-700 text-white text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-3" style={{ color: POLITY_VERSE_COLORS.green }}>
          Principes du Système Politique
        </h2>

        <p className="text-white/80 mb-4">{(systemData as any).description || 'Définissez les principes et cliquez pour éditer.'}</p>

        <div className="space-y-6">
          {(systemData as any).principes.map((p: any) => (
            <div key={p.categorie}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: POLITY_VERSE_COLORS.green }}>
                {p.categorie}
              </h3>

              <div className="grid gap-4">
                {Array.isArray(p.elements) && p.elements.map((el: any, i: number) => (
                  typeof el === 'string' ? (
                    <div key={i} className="text-white/90 pl-4">
                      • {el}
                    </div>
                  ) : (
                    <div key={el.nom || i} className="bg-[#0f0f0f] p-4 rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold" style={{ color: POLITY_VERSE_COLORS.green }}>{el.nom}</h4>
                          <p className="text-white/80 text-sm mt-1">{el.description}</p>
                          {Array.isArray(el.exemples) && (
                            <ul className="text-white/70 mt-2 list-disc ml-5 text-sm">
                              {el.exemples.map((ex: string, idx: number) => <li key={idx}>{ex}</li>)}
                            </ul>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-white/60">Statut</p>
                          <p className="text-sm font-semibold">{el.statut || 'à définir'}</p>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SystemModal;
