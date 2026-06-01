import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { text, type } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave de API Gemini não configurada nos Segredos do AI Studio." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let prompt = "";
    if (type === "risk_assessment") {
      prompt = `Aja como o robô moderador do Deitt, um aplicativo de namoro inovador. Analise o seguinte texto de perfil ou bio de usuário para encontrar riscos (golpes, spam, ódio, discurso violento ou inadequado).
Retorne estritamente um formato JSON com os campos: "verdict" (que pode ser "Safe", "Suspect" ou "Critical"), "trustScore" (um número de 0 a 100 indicando a confiabilidade), "flaggedReasons" (uma array de strings com razões caso suspeito/crítico, ou vazia se seguro), "explanation" (uma curta frase em português de justificativa).
Texto a analisar:
"${text}"`;
    } else {
      prompt = `Aja como o moderador estratégico de engajamento do aplicativo Deitt. Analise o seguinte texto de legenda de vídeo ou bio para sugerir se respeita as regras de segurança e engajamento da comunidade:
Texto: "${text}"
Retorne em português uma avaliação construtiva e concisa (máximo 2 linhas).`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config:
        type === "risk_assessment"
          ? {
              responseMimeType: "application/json",
            }
          : undefined,
    });

    const resultText = response.text || "";

    if (type === "risk_assessment") {
      try {
        const parsed = JSON.parse(resultText.trim());
        return NextResponse.json({ success: true, analysis: parsed });
      } catch {
        return NextResponse.json({ success: true, raw: resultText });
      }
    }

    return NextResponse.json({ success: true, text: resultText });
  } catch (error: any) {
    console.error("Gemini Moderation Error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno na moderação com IA." },
      { status: 500 }
    );
  }
}
