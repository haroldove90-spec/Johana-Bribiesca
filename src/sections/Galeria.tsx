
import React, { useState, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { GalleryImage } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

const Galeria: React.FC = () => {
  const [images, setImages] = useLocalStorage<GalleryImage[]>('tattoo-gallery', []);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const newImage: GalleryImage = {
        id: new Date().toISOString(),
        src: `data:${file.type};base64,${base64}`,
        name: file.name,
      };
      setImages([newImage, ...images]);
    }
  };
  
  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    setSelectedImage(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Galería de Tatuajes</h1>
          <p className="text-gray-400">Tu colección personal de inspiración y trabajos.</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">
          Añadir Foto
        </button>
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">Tu galería está vacía.</p>
          <p className="text-gray-500">¡Añade tu primera foto de inspiración!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(image => (
            <div key={image.id} className="aspect-square bg-gray-900 rounded-lg overflow-hidden cursor-pointer group relative" onClick={() => setSelectedImage(image)}>
              <img src={image.src} alt={image.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-3xl max-h-[90vh] bg-gray-900 rounded-lg shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.name} className="w-full h-auto object-contain max-h-[80vh] rounded" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-gray-800/50 text-white rounded-full p-2 hover:bg-gray-700 transition">&times;</button>
            <button onClick={() => removeImage(selectedImage.id)} className="absolute bottom-4 right-4 bg-red-600/80 text-white rounded-lg p-2 px-4 hover:bg-red-500 transition text-sm">Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeria;