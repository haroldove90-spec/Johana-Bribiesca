
import type { Client } from '../types';

export const generateVCF = (client: Client): string => {
  const vcfContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${client.name};;;`,
    `FN:${client.name}`,
    `TEL;TYPE=CELL:${client.phone}`,
    `EMAIL:${client.email}`,
    `NOTE:${client.notes.replace(/\n/g, '\\n')}`,
    'END:VCARD'
  ].join('\r\n');

  return vcfContent;
};