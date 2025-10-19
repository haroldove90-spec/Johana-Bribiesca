import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Sale } from '../types';

const TATTOO_TYPES = [
  'Fine Line', 'Blackwork', 'Realismo', 'Tradicional', 'Neotradicional', 
  'Japonés', 'Acuarela', 'Geométrico', 'Lettering', 'Otro'
];

const MisVentas: React.FC = () => {
  const [sales, setSales] = useLocalStorage<Sale[]>('tattoo-sales', []);
  const [showModal, setShowModal] = useState(false);
  const [newSale, setNewSale] = useState<Omit<Sale, 'id'>>({
    clientName: '',
    clientPhone: '',
    date: new Date().toISOString().split('T')[0],
    tattooType: TATTOO_TYPES[0],
    cost: 0,
  });

  const handleSaveSale = () => {
    if (!newSale.clientName || newSale.cost <= 0) {
        alert("Por favor, completa el nombre del cliente y un costo válido.");
        return;
    };
    const sale: Sale = { id: new Date().toISOString(), ...newSale, cost: Number(newSale.cost) };
    setSales([...sales, sale].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setShowModal(false);
    setNewSale({
      clientName: '',
      clientPhone: '',
      date: new Date().toISOString().split('T')[0],
      tattooType: TATTOO_TYPES[0],
      cost: 0,
    });
  };

  const salesData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday as start
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todaySales = sales
      .filter(s => new Date(s.date.replace(/-/g, '/')).getTime() >= today.getTime())
      .reduce((sum, s) => sum + s.cost, 0);
      
    const weekSales = sales
      .filter(s => new Date(s.date.replace(/-/g, '/')).getTime() >= startOfWeek.getTime())
      .reduce((sum, s) => sum + s.cost, 0);
      
    const monthSales = sales
      .filter(s => new Date(s.date.replace(/-/g, '/')).getTime() >= startOfMonth.getTime())
      .reduce((sum, s) => sum + s.cost, 0);

    const maxSale = Math.max(todaySales, weekSales, monthSales, 1); // Avoid division by zero

    return {
      today: { total: todaySales, percentage: (todaySales / maxSale) * 100 },
      week: { total: weekSales, percentage: (weekSales / maxSale) * 100 },
      month: { total: monthSales, percentage: (monthSales / maxSale) * 100 },
    };
  }, [sales]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Ventas</h1>
          <p className="text-gray-400">Registra y visualiza tus ingresos.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition">
          Registrar Venta
        </button>
      </div>
      
      {/* Sales Chart */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Resumen de Ingresos</h2>
        <div className="flex justify-around items-end h-64 gap-4">
          {Object.entries(salesData).map(([period, data]) => (
            <div key={period} className="flex flex-col items-center justify-end h-full w-1/3">
              <p className="font-bold text-lg text-white">{formatCurrency(data.total)}</p>
              <div className="w-12 md:w-16 bg-gray-800 rounded-t-lg mt-2 flex-grow flex items-end">
                <div 
                  className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500 ease-out" 
                  style={{ height: `${data.percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2 capitalize">{period === 'today' ? 'Hoy' : (period === 'week' ? 'Semana' : 'Mes')}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sales List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Registros Recientes</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {sales.length > 0 ? sales.map(sale => (
                <div key={sale.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-white">{sale.clientName}</p>
                        <p className="text-sm text-gray-400">{sale.tattooType}</p>
                        <p className="text-xs text-gray-500">{new Date(sale.date.replace(/-/g, '/')).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <p className="text-lg font-bold text-green-400">{formatCurrency(sale.cost)}</p>
                </div>
            )) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No hay ventas registradas.</p>
                </div>
            )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Registrar Nueva Venta</h2>
            <input type="text" placeholder="Nombre del Cliente" value={newSale.clientName} onChange={e => setNewSale({ ...newSale, clientName: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <input type="tel" placeholder="Teléfono (Opcional)" value={newSale.clientPhone} onChange={e => setNewSale({ ...newSale, clientPhone: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <input type="date" value={newSale.date} onChange={e => setNewSale({ ...newSale, date: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <select value={newSale.tattooType} onChange={e => setNewSale({ ...newSale, tattooType: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2">
              {TATTOO_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <input type="number" placeholder="Costo" value={newSale.cost || ''} onChange={e => setNewSale({ ...newSale, cost: parseFloat(e.target.value) || 0 })} className="w-full bg-gray-800 p-2 rounded mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded">Cancelar</button>
              <button onClick={handleSaveSale} className="bg-indigo-600 hover:bg-indigo-500 py-2 px-4 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisVentas;