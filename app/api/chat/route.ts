import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, stream = false } = await req.json();

    const proxyUrl = "https://ollama-api.sidia.org.br/api/chat";
    const apiKey = "op_prefix_secret";

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-oss:20b",
        messages,
        stream
      }),
      // Nota: No ambiente Node.js/Next.js, fetch pode precisar de configuração adicional para ignorar certificados self-signed se necessário, 
      // mas em produção isso deve ser tratado corretamente pela infraestrutura.
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: `Ollama API error: ${errorData}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
