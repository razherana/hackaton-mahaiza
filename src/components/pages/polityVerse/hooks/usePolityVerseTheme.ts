import { useEffect } from 'react';
import { POLITY_VERSE_COLORS } from '../constants';

export function usePolityVerseTheme() {
  const darkModeColor = POLITY_VERSE_COLORS.darkerBlack;

  useEffect(() => {
    // Applique le mode sombre au body quand le composant est monté
    document.body.style.backgroundColor = darkModeColor;
    
    // Nettoie au démontage
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [darkModeColor]);

  return {
    darkModeColor,
    theme: {
      background: darkModeColor,
      text: POLITY_VERSE_COLORS.white,
    }
  };
}
