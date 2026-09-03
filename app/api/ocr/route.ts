import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Create a timeout promise
const timeout = (ms: number) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Request timeout')), ms)
);

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = image.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const prompt = `You are an expert at reading product labels and extracting ingredient information. 

Analyze the provided image of a product label and extract the following information in JSON format:

1. Product name (the main name of the product)
2. List of all ingredients you can identify

Return ONLY a valid JSON object with this exact structure:
{
  "product_name": "string",
  "ingredients": ["ingredient1", "ingredient2", "ingredient3", ...]
}

Rules:
- Extract ingredients exactly as they appear on the label
- Include all ingredients, even common ones
- If you cannot identify the product name, use "Unknown Product"
- If you cannot identify ingredients, return an empty array
- Return ONLY the JSON, no additional text or explanation`;

    // Add timeout protection (10 seconds)
    const chatCompletion = await Promise.race([
      groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
                },
              },
            ],
          },
        ],
        model: 'llama-3.2-11b-vision-preview',
        temperature: 0.1,
        max_tokens: 1024,
      }),
      timeout(10000) // 10 second timeout
    ]) as any;

    const responseText = chatCompletion.choices[0]?.message?.content || '';
    
    // Try to parse JSON from the response
    let parsedResponse;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse OCR response:', parseError);
      // Return a fallback response if parsing fails
      parsedResponse = {
        product_name: 'Unknown Product',
        ingredients: []
      };
    }

    return NextResponse.json({
      success: true,
      data: parsedResponse
    });

  } catch (error: any) {
    console.error('OCR Error:', error);
    
    // Return a fallback response on error
    if (error.message === 'Request timeout') {
      return NextResponse.json(
        { 
          error: 'OCR processing timed out. Please try again or enter ingredients manually.',
          success: false,
          fallback: true
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to process image',
        success: false,
        fallback: true
      },
      { status: 500 }
    );
  }
}