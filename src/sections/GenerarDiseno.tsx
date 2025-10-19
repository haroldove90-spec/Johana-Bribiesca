
import React, { useState } from 'react';
import { generateDesign } from '../services/geminiService';
import { downloadImage } from '../utils/fileUtils';
import Spinner from '../components/Spinner';

const GenerarDiseno: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageB64 = await generateDesign(prompt);
      setGeneratedImage(imageB64);
    } catch (err) {
      setError('No se pudo generar el diseño. Intenta con otra idea.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-center">Generador de Diseños AI</h1>
      <p className="text-gray-400 mb-6 text-center max-w-xl">Describe tu idea para un tatuaje y deja que la inteligencia artificial cree un diseño único para ti.</p>
      
      <div className="w-full max-w-2xl">
        <div className="flex flex-col md:flex-row gap-2 mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Un lobo aullando a una luna geométrica, estilo neotradicional"
            className="flex-grow bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={2}
          />
          <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-indigo-800 disabled:cursor-not-allowed">
            {loading ? 'Generando...' : 'Generar'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl aspect-square bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mt-4">
        {loading && <Spinner />}
        {error && <p className="text-red-400 text-center p-4">{error}</p>}
        {generatedImage && (
          <div className="p-4">
            <img src={`data:image/png;base64,${generatedImage}`} alt="Diseño generado" className="rounded-md object-contain max-h-full max-w-full" />
          </div>
        )}
        {!loading && !generatedImage && !error && <p className="text-gray-500">Tu diseño aparecerá aquí.</p>}
      </div>
      
      {generatedImage && !loading && (
        <button onClick={() => downloadImage(generatedImage, 'diseno-tatuaje-ai.png')} className="mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition">
          Descargar Diseño
        </button>
      )}
    </div>
  );
};

export default GenerarDiseno;