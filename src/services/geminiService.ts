import { GoogleGenAI, Chat, Type, Modality } from "@google/genai";

// Fix: Initialize GoogleGenAI with API Key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches daily tips for a tattoo artist from the Gemini API.
 */
export const getArtistTips = async (): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Genera 2 consejos concisos y prácticos para un artista del tatuaje sobre cómo mejorar su técnica o negocio. Responde en español.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ['tips'],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.tips || [];
  } catch (error) {
    console.error("Error fetching artist tips:", error);
    throw new Error("Failed to fetch tips from Gemini API.");
  }
};

/**
 * Generates a tattoo design based on a text prompt.
 * @param prompt The user's description of the tattoo design.
 * @returns A base64 encoded string of the generated image.
 */
export const generateDesign = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Diseño de tatuaje de ${prompt}, estilo minimalista, solo líneas negras sobre un fondo blanco.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
          throw new Error("No image was generated.");
        }
    
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return base64ImageBytes;
    } catch (error) {
        console.error("Error generating design:", error);
        throw new Error("Failed to generate design from Gemini API.");
    }
};

/**
 * Simulates trying on a tattoo on a specified body part.
 * @param base64Tattoo The base64 encoded tattoo image.
 * @param mimeType The MIME type of the tattoo image.
 * @param bodyPart The part of the body to place the tattoo on.
 * @returns A base64 encoded string of the resulting image.
 */
export const tryOnTattoo = async (base64Tattoo: string, mimeType: string, bodyPart: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Tattoo,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: `Coloca este tatuaje de forma realista en el/la ${bodyPart} de una persona. Muestra solo la parte del cuerpo con el tatuaje sobre un fondo neutro.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("No image was returned from the API.");
    } catch (error) {
        console.error("Error trying on tattoo:", error);
        throw new Error("Failed to generate virtual tattoo from Gemini API.");
    }
};

/**
 * Creates a new chat session with the AI assistant.
 * @returns A Chat instance.
 */
export const createChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'Eres Johana, una artista experta en tatuajes. Ofreces consejos amigables y profesionales sobre diseños, cuidados posteriores, manejo del dolor y todo lo relacionado con el mundo del tatuaje. Tu tono es cercano, profesional y tranquilizador. Responde en español.',
    },
  });
};


/**
 * Converts a photo into a line art tattoo design.
 * @param base64Image The base64 encoded photo.
 * @param mimeType The MIME type of the photo.
 * @returns A base64 encoded string of the line art image.
 */
export const createLineArt = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: 'Convierte esta foto en un dibujo de líneas minimalista (line art) para un diseño de tatuaje. El resultado debe ser solo líneas negras sobre un fondo completamente blanco.',
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("No line art image was returned from the API.");
    } catch (error) {
        console.error("Error creating line art:", error);
        throw new Error("Failed to create line art from Gemini API.");
    }
};