import React from 'react';
import type { Page } from '../types';
import { HomeIcon, CalendarIcon, UsersIcon, ChartBarIcon } from './icons';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'consejo', label: 'Home', icon: <HomeIcon /> },
  { page: 'agenda', label: 'Agenda', icon: <CalendarIcon /> },
  { page: 'clientes', label: 'Clientes', icon: <UsersIcon /> },
  { page: 'ventas', label: 'Ventas', icon: <ChartBarIcon /> },
];

const NavButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isMobile: boolean;
}> = ({ isActive, onClick, icon, label, isMobile }) => {
  const baseClasses = 'flex items-center justify-start p-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500';
  const activeClasses = 'bg-gray-700 text-white shadow-lg';
  const inactiveClasses = 'text-gray-400 hover:bg-gray-800 hover:text-white';
  const mobileClasses = 'flex-col flex-1';
  const desktopClasses = 'space-x-4 w-full';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isMobile ? mobileClasses : desktopClasses}`}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className={`${isMobile ? 'text-xs mt-1' : 'font-medium'}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 flex justify-around p-1 z-50">
        {navItems.map((item) => (
          <NavButton
            key={item.page}
            isActive={currentPage === item.page}
            onClick={() => setCurrentPage(item.page)}
            icon={item.icon}
            label={item.label}
            isMobile={true}
          />
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <NavButton
          key={item.page}
          isActive={currentPage === item.page}
          onClick={() => setCurrentPage(item.page)}
          icon={item.icon}
          label={item.label}
          isMobile={false}
        />
      ))}
    </nav>
  );
};

export default BottomNav;