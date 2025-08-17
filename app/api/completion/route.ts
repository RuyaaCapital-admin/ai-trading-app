// app/api/completion/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const body = await req.json();

  // supports either {prompt} or {messages}
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    prompt: body.prompt,
    messages: body.messages,
    system: body.system,
  });

  return result.toAIStreamResponse();
}
