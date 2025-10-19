import type { Appointment } from '../types';

// Helper to format date for ICS file (YYYYMMDDTHHMMSSZ)
const toICSDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const generateICS = (appointment: Appointment): string => {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
  const [endHour, endMinute] = appointment.endTime.split(':').map(Number);

  const startDate = new Date(Date.UTC(year, month - 1, day, startHour, startMinute));
  const endDate = new Date(Date.UTC(year, month - 1, day, endHour, endMinute));

  // Add client phone to description if available
  const description = [
    appointment.notes,
    appointment.clientPhone ? `Teléfono: ${appointment.clientPhone}` : ''
  ].filter(Boolean).join('\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JohanaBribiescaTattoo//EN',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@johanabribiesca.tattoo`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(startDate)}`,
    `DTEND:${toICSDate(endDate)}`,
    `SUMMARY:Tatuaje - ${appointment.clientName}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
};
