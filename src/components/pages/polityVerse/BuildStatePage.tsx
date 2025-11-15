import { useNavigate } from 'react-router-dom';
import { StateVisualizationModal } from './components/StateVisualizationModal';

export function BuildStatePage() {
  const navigate = useNavigate();

  // Récupérer les données depuis localStorage ou sessionStorage si nécessaire
  const savedData = sessionStorage.getItem('buildStateData');
  const data = savedData ? JSON.parse(savedData) : {
    hymneFile: null,
    drapeauFile: null,
    devise: ''
  };

  return (
    <StateVisualizationModal
      onClose={() => navigate('/polity-verse')}
      hymneFile={data.hymneFile}
      drapeauFile={data.drapeauFile}
      devise={data.devise}
    />
  );
}
