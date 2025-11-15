import { useState } from 'react';
import systemData from '../mocks/system.json';
import { POLITY_VERSE_COLORS } from '../constants';

type Interaction = { institution: string; details: string };
type InstitutionDraft = {
  hierarchie?: string;
  categorie: 'legislatif' | 'executif' | 'judiciaire' | 'armee' | string;
  nom: string;
  election: 'suffrage universel direct' | 'suffrage universel indirect' | 'nomination par une institution' | string;
  fonctionnement: string;
  interactions: Interaction[];
  roles: string[];
};

export function AjoutConstitution({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  // try to load existing structured draft, fall back to empty
  const initial = (() => {
    try {
      const raw = sessionStorage.getItem('constitutionDraft');
      if (raw) {
        try {
          return JSON.parse(raw) as InstitutionDraft;
        } catch {
          // old format (string) -> put into fonctionnement
          return {
            categorie: '',
            nom: '',
            election: '',
            fonctionnement: raw,
            interactions: [],
            roles: [],
          } as InstitutionDraft;
        }
      }
    } catch {}
    return { categorie: '', nom: '', election: '', fonctionnement: '', interactions: [], roles: [] } as InstitutionDraft;
  })();

  const [categorie, setCategorie] = useState<string>(initial.categorie);
  const [nom, setNom] = useState<string>(initial.nom);
  const [hierarchie, setHierarchie] = useState<string>((initial as any).hierarchie || '');
  const [election, setElection] = useState<string>(initial.election);
  const [fonctionnement, setFonctionnement] = useState<string>(initial.fonctionnement);
  const [interactions, setInteractions] = useState<Interaction[]>(initial.interactions.length ? initial.interactions : []);
  const [roles, setRoles] = useState<string[]>(initial.roles.length ? initial.roles : ['']);

  if (!visible) return null;

  const save = () => {
    const payload: InstitutionDraft = { categorie, nom, hierarchie, election, fonctionnement, interactions: interactions.filter((i) => i.institution || i.details), roles: roles.filter((r) => r.trim() !== '') };
    try {
      sessionStorage.setItem('constitutionDraft', JSON.stringify(payload));
    } catch {}
    onClose();
  };

  const addInteraction = () => setInteractions((prev) => [...prev, { institution: '', details: '' }]);
  const updateInteraction = (idx: number, field: 'institution' | 'details', value: string) => setInteractions((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  const removeInteraction = (idx: number) => setInteractions((prev) => prev.filter((_, i) => i !== idx));

  const addRole = () => setRoles((prev) => [...prev, '']);
  const updateRole = (idx: number, value: string) => setRoles((prev) => prev.map((r, i) => (i === idx ? value : r)));
  const removeRole = (idx: number) => setRoles((prev) => prev.filter((_, i) => i !== idx));

  const institutionOptions: string[] = (() => {
    try {
      const inst = (systemData as any).principes?.find((p: any) => p.categorie === 'Institutions');
      if (inst && Array.isArray(inst.elements)) return inst.elements;
    } catch {}
    return ['Républicaines', 'Armées', 'Collectivités territoriales'];
  })();

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60" onClick={onClose}>
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
            <span className="text-2xl animate-bounce">🏛️</span>
          Ajouter une institution
        </h2>

        <label className="text-sm text-white/70">Catégorie</label>
        <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="w-full p-2 rounded mb-3 bg-[#0f0f0f] text-white">
          <option value="">-- Choisir --</option>
          <option value="legislatif">Legislatif</option>
          <option value="executif">Exécutif</option>
          <option value="judiciaire">Judiciaire</option>
          <option value="armee">Armée</option>
        </select>

        <label className="text-sm text-white/70">Nom de l'institution</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Parlement" className="w-full p-2 rounded mb-3 bg-[#0f0f0f] text-white" />

        <label className="text-sm text-white/70">Hiérarchie</label>
        <input value={hierarchie} onChange={(e) => setHierarchie(e.target.value)} placeholder="Ex: nationale, régionale..." className="w-full p-2 rounded mb-3 bg-[#0f0f0f] text-white" />

        <label className="text-sm text-white/70">Élection / Nomination</label>
        <select value={election} onChange={(e) => setElection(e.target.value)} className="w-full p-2 rounded mb-3 bg-[#0f0f0f] text-white">
          <option value="">-- Choisir --</option>
          <option value="suffrage universel direct">Suffrage universel direct</option>
          <option value="suffrage universel indirect">Suffrage universel indirect</option>
          <option value="nomination par une institution">Nomination par une institution</option>
        </select>

        <label className="text-sm text-white/70">Fonctionnement</label>
        <textarea value={fonctionnement} onChange={(e) => setFonctionnement(e.target.value)} className="w-full h-28 p-3 rounded mb-3 bg-[#0f0f0f] text-white resize-y" />

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Interactions avec d'autres institutions</h3>
            <button
              className="text-sm px-3 py-1 rounded-full shadow-lg transform transition hover:scale-105"
              onClick={addInteraction}
              aria-label="Ajouter une interaction"
              style={{ color: POLITY_VERSE_COLORS.white }}
            >
              ➕ Ajouter
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {interactions.map((it, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <select value={it.institution} onChange={(e) => updateInteraction(idx, 'institution', e.target.value)} className="p-2 rounded bg-[#0f0f0f] text-white w-48">
                  <option value="">-- Institution --</option>
                  {institutionOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input value={it.details} onChange={(e) => updateInteraction(idx, 'details', e.target.value)} placeholder="Détails de l'interaction" className="flex-1 p-2 rounded bg-[#0f0f0f] text-white" />
                <button className="px-2 rounded bg-red-600 text-white" onClick={() => removeInteraction(idx)}>Suppr</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Rôles</h3>
            <button
              className="text-sm px-3 py-1 rounded-full shadow-lg transform transition hover:scale-105"
              onClick={addRole}
              aria-label="Ajouter un rôle"
              style={{ color: POLITY_VERSE_COLORS.white }}
            >
              ➕ Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {roles.map((r, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input value={r} onChange={(e) => updateRole(idx, e.target.value)} placeholder={`Rôle ${idx + 1}`} className="flex-1 p-2 rounded bg-[#0f0f0f] text-white" />
                <button className="px-2 rounded bg-red-600 text-white" onClick={() => removeRole(idx)}>Suppr</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button className="px-4 py-2 rounded" onClick={save} style={{ backgroundColor: POLITY_VERSE_COLORS.green, color: POLITY_VERSE_COLORS.white }}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}

export default AjoutConstitution;
