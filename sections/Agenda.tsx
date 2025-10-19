import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Appointment } from '../types';
import { generateICS } from '../utils/calendarUtils';
import { downloadFile } from '../utils/fileUtils';

const Agenda: React.FC = () => {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('tattoo-appointments', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id' | 'date'>>({
    clientName: '', clientPhone: '', startTime: '12:00', endTime: '13:00', notes: ''
  });

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();

  const daysInMonth = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const openModal = (day: Date) => {
    setSelectedDate(day.toISOString().split('T')[0]);
    setShowModal(true);
  };

  const handleSaveAppointment = () => {
    if (!newAppointment.clientName) return;
    const appointment: Appointment = {
      id: new Date().toISOString(),
      date: selectedDate,
      ...newAppointment,
    };
    setAppointments([...appointments, appointment]);
    setShowModal(false);
    setNewAppointment({ clientName: '', clientPhone: '', startTime: '12:00', endTime: '13:00', notes: '' });
  };
  
  const getAppointmentsForDay = (date: string) => {
      return appointments.filter(app => app.date === date);
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  const upcomingAppointments = appointments
    .filter(app => new Date(app.date.replace(/-/g, '/')) >= today)
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Agenda de Citas</h1>
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-700">&lt;</button>
          <h2 className="text-xl font-semibold">{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-700">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {daysInMonth.map(day => {
            const dateStr = day.toISOString().split('T')[0];
            const isToday = day.getTime() === today.getTime();
            const dayAppointments = getAppointmentsForDay(dateStr);
            return (
              <div key={day.toString()} onClick={() => openModal(day)} className={`p-2 rounded-md cursor-pointer aspect-square flex flex-col items-center justify-center transition ${isToday ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}>
                <span>{day.getDate()}</span>
                {dayAppointments.length > 0 && <div className="w-2 h-2 bg-pink-500 rounded-full mt-1"></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Próximas Citas</h3>
            {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay citas programadas.</p>
            ) : (
                <div className="space-y-3">
                    {upcomingAppointments.map(app => (
                        <div key={app.id} className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg text-white">{app.clientName}</p>
                                <p className="text-sm text-gray-300">{app.clientPhone}</p>
                                <p className="text-sm text-gray-400 mt-1">{new Date(app.date.replace(/-/g, '/')).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="text-md text-indigo-400 font-medium">{app.startTime} - {app.endTime}</p>
                            </div>
                            <button onClick={() => downloadFile(generateICS(app), `${app.clientName}.ics`, 'text/calendar')} className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-3 rounded-full">Añadir al Calendario</button>
                        </div>
                    ))}
                </div>
            )}
        </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Añadir Cita para {selectedDate}</h2>
            <input type="text" placeholder="Nombre del Cliente" value={newAppointment.clientName} onChange={e => setNewAppointment({ ...newAppointment, clientName: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <input type="tel" placeholder="Teléfono del Cliente" value={newAppointment.clientPhone} onChange={e => setNewAppointment({ ...newAppointment, clientPhone: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-2" />
            <div className="flex gap-2 mb-2">
              <input type="time" value={newAppointment.startTime} onChange={e => setNewAppointment({ ...newAppointment, startTime: e.target.value })} className="w-1/2 bg-gray-800 p-2 rounded" />
              <input type="time" value={newAppointment.endTime} onChange={e => setNewAppointment({ ...newAppointment, endTime: e.target.value })} className="w-1/2 bg-gray-800 p-2 rounded" />
            </div>
            <textarea placeholder="Notas" value={newAppointment.notes} onChange={e => setNewAppointment({ ...newAppointment, notes: e.target.value })} className="w-full bg-gray-800 p-2 rounded mb-4" rows={3}></textarea>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded">Cancelar</button>
              <button onClick={handleSaveAppointment} className="bg-indigo-600 hover:bg-indigo-500 py-2 px-4 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
