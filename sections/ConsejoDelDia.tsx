import React, { useState, useEffect } from 'react';
import { getArtistTips } from '../services/geminiService';
import Spinner from '../components/Spinner';
import type { Page } from '../types';
import { SparklesIcon, PencilIcon, EyeIcon, ImageIcon } from '../components/icons';

interface ConsejoDelDiaProps {
  setCurrentPage: (page: Page) => void;
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-900 hover:bg-gray-800 border border-gray-800 p-6 rounded-lg text-left transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500 w-full"
  >
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-10 h-10 text-indigo-400">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  </button>
);

const ConsejoDelDia: React.FC<ConsejoDelDiaProps> = ({ setCurrentPage }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const artistTips = await getArtistTips();
        setTips(artistTips);
      } catch (error) {
        console.error(error);
        setTips(['No se pudo cargar el consejo de hoy. Inténtalo de nuevo más tarde.']);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  const actions = [
    { page: 'generar', icon: <SparklesIcon />, title: 'Crea un Tatuaje', description: 'Genera diseños únicos con IA a partir de tus ideas.' },
    { page: 'trazo', icon: <PencilIcon />, title: 'Trazar un Tatuaje', description: 'Convierte cualquier foto en un diseño de line art.' },
    { page: 'probar', icon: <EyeIcon />, title: 'Probar Tatuaje', description: 'Visualiza cómo se vería un tatuaje en el cuerpo.' },
    { page: 'galeria', icon: <ImageIcon />, title: 'Portafolio', description: 'Explora tu colección de trabajos e inspiración.' },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {/* Tips Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Consejos del Día</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <ul className="space-y-3 text-left w-full">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-400 font-bold mr-3 text-sm">{`◆`}</span>
                  <p className="text-sm text-gray-300">{tip}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Actions Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Herramientas Creativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map(action => (
            <ActionButton
              key={action.page}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={() => setCurrentPage(action.page as Page)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsejoDelDia;