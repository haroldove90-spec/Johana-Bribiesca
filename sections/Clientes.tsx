
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Client } from '../types';
import { generateVCF } from '../utils/contactUtils';
import { downloadFile } from '../utils/fileUtils';

const Clientes: React.FC = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('tattoo-clients', []);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({ name: '', phone: '', email: '', notes: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveClient = () => {
    if (!newClient.name) return;
    const client: Client = { id: new Date().toISOString(), ...newClient };
    setClients([...clients, client].sort((a,b) => a.name.localeCompare(b.name)));
    setShowModal(false);
    setNewClient({ name: '', phone: '', email: '', notes: '' });
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Registro de Clientes</h1>
          <p className="text-gray-400">Administra la información de tus clientes.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition">
          Nuevo Cliente
        </button>
      </div>
      
      <input 
        type="text"
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-gray-800 p-3 rounded-lg mb-6 border border-gray-700"
      />

      <div className="space-y-3">
        {filteredClients.length > 0 ? filteredClients.map(client => (
          <div key={client.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <p className="text-sm text-gray-400">{client.phone}</p>
              <p className="text-sm text-gray-400">{client.email}</p>
              {client.notes && <p className="text-sm text-gray-500 mt-2 italic">"{client.notes}"</p>}
            </div>
            <button 
              onClick={() => downloadFile(generateVCF(client), `${client.name}.vcf`, 'text/vcard')}
              className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-3 rounded-full"
            >
              Guardar Contacto
            </button>
          </div>
        )) : (
            <div className="text-center py-10">
                <p className="text-gray-500">{clients.length === 0 ? "No tienes clientes registrados." : "No se encontraron clientes."}</p>
            </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Registrar Nuevo Cliente</h2>
            <input type="text" placeholder="Nombre Completo" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <input type="tel" placeholder="Teléfono" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <input type="email" placeholder="Email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <textarea placeholder="Notas (diseño, alergias, etc.)" value={newClient.notes} onChange={e => setNewClient({ ...newClient, notes: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-4" rows={3}></textarea>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded">Cancelar</button>
              <button onClick={handleSaveClient} className="bg-indigo-600 hover:bg-indigo-500 py-2 px-4 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
