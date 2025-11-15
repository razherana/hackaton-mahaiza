# Guide d'installation et d'utilisation - Chatbot Lummy

## ✅ Fonctionnalités implémentées

### 1. Chatbot Lummy
- Interface moderne type ChatGPT avec design sombre professionnel
- Sidebar retractable pour l'historique des conversations
- Animations de la mascotte selon l'état (neutre, pensif, heureux, excité)
- Sauvegarde automatique des conversations dans localStorage
- Système de questions/réponses basé sur JSON

### 2. Intégration complète
- Bouton flottant accessible sur toutes les pages ActuFlash
- Intégré dans : ActuFlashPage, MinistereDetailPage, ArticleDetailPage
- Menu contextuel "Demander à Lummy" sur sélection de texte (clic droit)
- Design cohérent avec le thème vert (#3A8A2A) et sombre (#1B1B1B)

### 3. Historique et gestion
- Création de nouvelles conversations
- Liste des conversations avec timestamps
- Suppression individuelle des conversations
- Navigation entre conversations

## 📝 TODO - Images de lémurien

Les fichiers du chatbot sont prêts, mais il faut ajouter les vraies images de lémurien :

### Images nécessaires (à télécharger et placer dans `/public/images/lemur/`)

1. **lemur-neutral.jpg** - Lémurien en position neutre/repos
2. **lemur-happy.jpg** - Lémurien souriant/joyeux  
3. **lemur-thinking.jpg** - Lémurien pensif/curieux
4. **lemur-excited.jpg** - Lémurien excité/enthousiaste

### Sources recommandées (images gratuites) :

- **Unsplash** : https://unsplash.com/s/photos/lemur
- **Pexels** : https://www.pexels.com/search/lemur/
- **Pixabay** : https://pixabay.com/images/search/lemur/
- **Wikimedia Commons** : https://commons.wikimedia.org/wiki/Category:Lemur_catta

### Format recommandé :
- Taille : 400x400px minimum
- Format : JPG, PNG ou WebP
- Fond : Transparent (PNG) ou neutre de préférence

## 🔧 Comment activer les vraies images

Une fois les images téléchargées dans `/public/images/lemur/`, modifiez le fichier :
`src/components/chatbot/ChatBot.tsx` (ligne ~306)

Décommentez ce bloc et commentez le placeholder :
```tsx
{/* Activer quand les vraies images sont disponibles */}
<img 
  src={`/images/lemur/lemur-${mascotMood}.jpg`} 
  alt="Lummy le lémurien"
  className="mascot-image"
/>

{/* Commentez ce placeholder */}
<div className="mascot-placeholder">
  <span className="mascot-emoji">🐒</span>
  <p className="mascot-name">Lummy</p>
</div>
```

## 🎨 Personnalisation

### Modifier les réponses du chatbot
Éditez `/src/data/chatbot-qa.json` pour :
- Ajouter de nouvelles questions/réponses
- Modifier les mots-clés de recherche
- Catégoriser par ministère

### Changer les couleurs
Dans `/src/components/chatbot/ChatBot.css` :
- `#3A8A2A` : Vert principal (boutons, accents)
- `#1B1B1B` : Fond sombre
- `#0f0f0f` : Fond encore plus sombre (sidebar)

## 🧪 Test des fonctionnalités

1. **Chat normal** : Cliquez sur le bouton flottant, tapez une question
2. **Sélection de texte** : Sélectionnez du texte sur une page, clic droit, "Demander à Lummy"
3. **Historique** : Créez plusieurs conversations, naviguez entre elles
4. **Sidebar** : Utilisez le bouton menu (☰) pour cacher/afficher l'historique
5. **Responsive** : Testez sur mobile/tablette

## 📱 Responsive design

Le chatbot s'adapte automatiquement :
- **Desktop** : Sidebar visible, pleine largeur
- **Tablette** : Sidebar retractable
- **Mobile** : Plein écran, sidebar en overlay

## 🐛 Dépannage

### Le chatbot ne s'affiche pas
- Vérifiez que les imports sont corrects dans les pages
- Vérifiez la console pour les erreurs

### Les images ne s'affichent pas
- Vérifiez que les fichiers sont dans `/public/images/lemur/`
- Vérifiez les noms de fichiers (lemur-neutral.jpg, etc.)
- Activez les vraies images dans ChatBot.tsx

### L'historique ne se sauvegarde pas
- Vérifiez le localStorage du navigateur
- Clé utilisée : `lummy-conversations`

## 🚀 Prochaines améliorations possibles

1. Connecter à une vraie IA (OpenAI, Anthropic, etc.)
2. Ajouter des vidéos animées pour la mascotte
3. Synthèse vocale pour les réponses
4. Export des conversations en PDF
5. Partage de conversations
6. Mode sombre/clair

---

**Développé pour la plateforme Mahaiza - ActuFlash IA** 🇲🇬
