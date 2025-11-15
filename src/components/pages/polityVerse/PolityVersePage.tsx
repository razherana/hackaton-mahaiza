import { usePolityVerseTheme } from './hooks';
import { PolityVerseLogo, UserProfile, QcmRoadmap } from './components';

export function PolityVersePage() {
  const { theme } = usePolityVerseTheme();

  return (
    <div 
      className="h-screen overflow-hidden text-white"
      style={{ backgroundColor: theme.background }}
    >
      <div className="h-full flex">
        {/* Left side - Main content (75%) */}
        <div className="flex-1 flex flex-col justify-center" style={{ width: '75%' }}>
          {/* Logo at top - centered */}
          <div className="absolute top-4 left-0 flex justify-center" style={{ width: '75%' }}>
            <PolityVerseLogo />
          </div>

          {/* QCM Roadmap - centered */}
          <div className="px-6 flex justify-center">
            <div style={{ width: '70%' }}>
              <QcmRoadmap />
            </div>
          </div>
        </div>

        {/* Right side - User Profile (25%) */}
        <div className="p-6 pr-8" style={{ width: '25%' }}>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}