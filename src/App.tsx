import React, { useState, useEffect } from 'react';
import type { Page } from './types';
import BottomNav from './components/BottomNav';
import Logo from './components/Logo';
import ConsejoDelDia from './sections/ConsejoDelDia';
import CrearTrazo from './sections/CrearTrazo';
import ProbarTatuaje from './sections/ProbarTatuaje';
import GenerarDiseno from './sections/GenerarDiseno';
import Galeria from './sections/Galeria';
import Agenda from './sections/Agenda';
import Clientes from './sections/Clientes';
import AsesorIA from './sections/AsesorIA';
import MisVentas from './sections/MisVentas';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('consejo');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'consejo':
        return <ConsejoDelDia setCurrentPage={setCurrentPage} />;
      case 'trazo':
        return <CrearTrazo />;
      case 'probar':
        return <ProbarTatuaje />;
      case 'generar':
        return <GenerarDiseno />;
      case 'galeria':
        return <Galeria />;
      case 'agenda':
        return <Agenda />;
      case 'clientes':
        return <Clientes />;
      case 'ventas':
        return <MisVentas />;
      case 'asesor':
        return <AsesorIA />;
      default:
        return <ConsejoDelDia setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans flex flex-col md:flex-row">
      {!isMobile && (
        <aside className="w-64 bg-gray-900/50 p-4 border-r border-gray-800">
           <div className="flex flex-col items-center space-y-4 mb-8">
            <Logo />
            <h1 className="text-xl font-bold text-white tracking-wider">Johana Bribiesca</h1>
          </div>
          <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        {isMobile && (
          <header className="p-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-10 flex items-center space-x-4">
            <Logo />
            <h1 className="text-xl font-bold text-white tracking-wider">Johana Bribiesca</h1>
          </header>
        )}
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          {renderPage()}
        </main>
        
        {isMobile && <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
};

export default App;