import React, { useState, useRef } from 'react';
import { createLineArt } from '../services/geminiService';
import { fileToBase64, downloadImage } from '../utils/fileUtils';
import Spinner from '../components/Spinner';

const CrearTrazo: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceFile(file);
      setSourcePreview(URL.createObjectURL(file));
      setResultImage(null);
      setError(null);
    }
  };

  const handleGenerateTrace = async () => {
    if (!sourceFile) return;
    setLoading(true);
    setError(null);
    try {
      const base64Image = await fileToBase64(sourceFile);
      const generatedImage = await createLineArt(base64Image, sourceFile.type);
      setResultImage(generatedImage);
    } catch (err) {
      setError('Ocurrió un error al crear el trazo. Por favor, intenta con otra imagen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Crear Trazo a partir de Foto</h1>
      <p className="text-gray-400 mb-6">Sube una foto y la convertiremos en un diseño de tatuaje de tipo "line art".</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="flex flex-col p-6 bg-gray-900 border border-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">1. Sube tu Foto</h2>
          <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg mb-4 transition">
            Seleccionar Foto
          </button>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
          {sourcePreview && (
            <div className="mt-4">
              <img src={sourcePreview} alt="Source Preview" className="rounded-lg max-h-64 w-auto mx-auto" />
            </div>
          )}
          
          {sourceFile && (
            <button onClick={handleGenerateTrace} disabled={loading} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-indigo-800 disabled:cursor-not-allowed">
              {loading ? 'Convirtiendo...' : 'Crear Trazo'}
            </button>
          )}
        </div>

        {/* Output Column */}
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded-lg min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">2. Resultado</h2>
          {loading && <Spinner />}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {resultImage && (
            <>
              <img src={`data:image/png;base64,${resultImage}`} alt="Resultado del trazo" className="rounded-lg max-h-96 w-auto bg-white p-2" />
              <button onClick={() => downloadImage(resultImage, 'trazo-tatuaje.png')} className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition">
                Descargar Trazo
              </button>
            </>
          )}
          {!loading && !resultImage && !error && <p className="text-gray-500">Aquí aparecerá el diseño final.</p>}
        </div>
      </div>
    </div>
  );
};

export default CrearTrazo;
