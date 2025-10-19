
import React, { useState, useRef } from 'react';
import { tryOnTattoo } from '../services/geminiService';
import { fileToBase64, downloadImage } from '../utils/fileUtils';
import Spinner from '../components/Spinner';

const bodyParts = ['Brazo', 'Espalda', 'Pecho', 'Pierna', 'Hombro', 'Antebrazo'];

const ProbarTatuaje: React.FC = () => {
  const [tattooFile, setTattooFile] = useState<File | null>(null);
  const [tattooPreview, setTattooPreview] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>(bodyParts[0]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTattooFile(file);
      setTattooPreview(URL.createObjectURL(file));
      setResultImage(null);
      setError(null);
    }
  };

  const handleTryOn = async () => {
    if (!tattooFile) return;
    setLoading(true);
    setError(null);
    try {
      const base64Tattoo = await fileToBase64(tattooFile);
      const generatedImage = await tryOnTattoo(base64Tattoo, tattooFile.type, selectedBodyPart);
      setResultImage(generatedImage);
    } catch (err) {
      setError('Ocurrió un error al generar la imagen. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Probar Tatuaje Virtualmente</h1>
      <p className="text-gray-400 mb-6">Sube el diseño de un tatuaje, elige una parte del cuerpo y mira cómo se vería.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col p-6 bg-gray-900 border border-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">1. Configuración</h2>
          <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg mb-4 transition">
            Subir Diseño del Tatuaje
          </button>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
          {tattooPreview && <img src={tattooPreview} alt="Tattoo Preview" className="my-4 rounded-lg max-h-40 w-auto mx-auto" />}
          
          <label htmlFor="bodyPart" className="mt-4 mb-2 font-semibold">Parte del Cuerpo:</label>
          <select
            id="bodyPart"
            value={selectedBodyPart}
            onChange={(e) => setSelectedBodyPart(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {bodyParts.map(part => <option key={part} value={part}>{part}</option>)}
          </select>
          
          {tattooFile && (
            <button onClick={handleTryOn} disabled={loading} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-indigo-800 disabled:cursor-not-allowed">
              {loading ? 'Generando...' : 'Probar Tatuaje'}
            </button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded-lg min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">2. Resultado</h2>
          {loading && <Spinner />}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {resultImage && (
            <>
              <img src={`data:image/png;base64,${resultImage}`} alt="Resultado del tatuaje" className="rounded-lg max-h-96 w-auto" />
              <button onClick={() => downloadImage(resultImage, 'tatuaje-virtual.png')} className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition">
                Descargar Imagen
              </button>
            </>
          )}
          {!loading && !resultImage && !error && <p className="text-gray-500">Aquí aparecerá la vista previa.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProbarTatuaje;
