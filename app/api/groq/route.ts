import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// GET /api/groq -> Lists all active models available on your specific API key
export async function GET() {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not defined in .env.local' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const modelList = await groq.models.list();
    const availableModels = modelList.data.map((m) => m.id);

    return NextResponse.json({ availableModels });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to list models' },
      { status: 500 }
    );
  }
}

// POST /api/groq -> Generates the response
export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is missing from environment variables' },
        { status: 500 }
      );
    }

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: 'You are a stand-up comedian. Return only a short, punchy one-sentence joke based on the user topic.',
        },
        {
          role: 'user',
          content: `Tell a joke about ${topic}`,
        },
      ],
      temperature: 0.7,
    });

    const punchline = completion.choices[0]?.message?.content || 'No joke found!';

    return NextResponse.json({ joke: punchline });
  } catch (error: any) {
    console.error('Groq API Error Details:', error);
    return NextResponse.json(
      { error: error?.error?.message || error?.message || 'Failed to generate joke' },
      { status: error?.status || 500 }
    );
  }
}