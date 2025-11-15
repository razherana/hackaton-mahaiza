import { useState } from 'react';
import { POLITY_VERSE_COLORS } from '../constants';

type LoiDraft = {
  title: string;
  categorie: string;
  motifs?: string;
  articles: string[];
};

export function AjoutLoi2({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const initial = (() => {
    try {
      const raw = sessionStorage.getItem('loiDraft');
      if (raw) return JSON.parse(raw) as LoiDraft;
    } catch {}
    return { title: '', categorie: '', articles: [''] } as LoiDraft;
  })();

  const [title, setTitle] = useState<string>(initial.title);
  const [categorie, setCategorie] = useState<string>(initial.categorie);
  const [motifs, setMotifs] = useState<string>((initial as any).motifs || '');
  const [articles, setArticles] = useState<string[]>(initial.articles.length ? initial.articles : ['']);
  const [saved, setSaved] = useState(false);

  if (!visible) return null;

  const save = () => {
    const payload: LoiDraft = { title, categorie, motifs, articles: articles.filter((a) => a.trim() !== '') };
    try {
      sessionStorage.setItem('loiDraft', JSON.stringify(payload));
    } catch {}
    // playful saved feedback before closing
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const addArticle = () => setArticles((prev) => [...prev, '']);
  const updateArticle = (idx: number, value: string) => setArticles((prev) => prev.map((a, i) => (i === idx ? value : a)));
  const removeArticle = (idx: number) => setArticles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 overflow-x-hidden" onClick={onClose}>
      <div
        className="ajout-loi-modal bg-[#1b1b1b] rounded-2xl p-6 max-w-2xl w-full mx-4 relative overflow-x-hidden"
        style={{ color: POLITY_VERSE_COLORS.white }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`.ajout-loi-modal .custom-scrollbar::-webkit-scrollbar{width:10px}.ajout-loi-modal .custom-scrollbar::-webkit-scrollbar-track{background:transparent}.ajout-loi-modal .custom-scrollbar::-webkit-scrollbar-thumb{background:#1b1b1b;border-radius:10px}`}</style>
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-[#0a0a0a] border border-green-700 text-white text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-3 flex items-center gap-3" style={{ color: POLITY_VERSE_COLORS.green }}>
          <span className="text-2xl animate-bounce">⚖️</span>
          <span style={{ color: POLITY_VERSE_COLORS.green }}>Ajouter / Éditer une Loi</span>
        </h2>
        {saved && (
          <div className="absolute left-6 top-6 bg-green-700 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <span>✅</span>
            <span className="text-sm">Brouillon sauvegardé</span>
          </div>
        )}

        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="w-full p-2 rounded mb-3 bg-[#0f0f0f] text-white"
        >
          <option value="Ordinaire">Ordinaire</option>
          <option value="Finance">Finance</option>
        </select>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la loi"
          className="w-full p-2 rounded mb-3 bg-[#0f0f0f] text-white"
        />

        <input
          value={motifs}
          onChange={(e) => setMotifs(e.target.value)}
          placeholder="Preambule (motifs)"
          className="w-full p-2 rounded mb-3 bg-[#0f0f0f] text-white"
        />

        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-white font-semibold">Articles</h3>
          <button
              className="text-sm px-3 py-1 rounded-full shadow-lg transform transition hover:scale-105"
            onClick={addArticle}
            aria-label="Ajouter un article"
          >
            ➕ Ajouter
          </button>
        </div>
  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {articles.map((art, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-gradient-to-r from-[#0b0b0b] to-[#111111] p-3 rounded-lg shadow-md hover:shadow-xl transform transition hover:scale-[1.01]">
              <div className="w-10 text-white/80 flex items-start pt-2">Art. {idx + 1}</div>
              <textarea
                value={art}
                onChange={(e) => updateArticle(idx, e.target.value)}
                className="flex-1 p-3 rounded bg-[#0b0b0b] text-white h-28 placeholder:text-white/50 resize-y"
                placeholder={`Texte de l'article ${idx + 1}`}
              />
              <button
                className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 shadow"
                onClick={() => removeArticle(idx)}
                title="Supprimer cet article"
              >
                −
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end items-center gap-3">
          <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded" onClick={save} style={{ backgroundColor: POLITY_VERSE_COLORS.green, color: POLITY_VERSE_COLORS.white }}>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AjoutLoi2;
