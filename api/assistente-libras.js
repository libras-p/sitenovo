import { GoogleGenAI } from '@google/genai';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = request.body || {};
  if (!message || typeof message !== 'string') {
    return response.status(400).json({ error: 'Mensagem é obrigatória' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({
      error: 'Chave GEMINI_API_KEY não configurada no ambiente.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: 'Você é o Assistente Virtual Oficial da ASSGA. Responda em português brasileiro de forma acolhedora, objetiva e estruturada.',
        temperature: 0.7,
      },
    });

    return response.status(200).json({
      reply: result.text || 'Não foi possível gerar uma resposta no momento.',
    });
  } catch (error) {
    return response.status(500).json({
      error: 'Erro no assistente',
      message: error.message || 'Falha ao processar solicitação.',
    });
  }
}
