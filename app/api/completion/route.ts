import { experimental_createMCPClient, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  try {
    // Basic AI completion without MCP (you can add MCP servers later)
    const response = await streamText({
      model: openai('gpt-4o'),
      prompt: `You are an expert financial analyst and trading advisor. Analyze the following request and provide comprehensive, actionable insights.

      **Guidelines:**
      - Provide specific, data-driven recommendations
      - Include risk analysis and warnings
      - Mention key technical indicators when relevant
      - Always remind users this is not financial advice
      - Be concise but thorough
      - Include both bullish and bearish scenarios

      **Market Context:**
      Consider current market conditions, volatility, and economic factors.

      **User Request:** ${prompt}

      **Response Format:**
      - Start with a brief summary
      - Provide detailed analysis
      - Include actionable recommendations
      - End with risk warnings`,
      maxTokens: 1500,
      temperature: 0.7,
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error('Error in completion API:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/*
// Enhanced version with MCP tools (uncomment when you have MCP servers)
export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  try {
    // Initialize MCP clients for different tools
    const stdioClient = await experimental_createMCPClient({
      transport: new StdioClientTransport({
        command: 'node',
        args: ['mcp-server.js'], // Your MCP server
      }),
    });

    const httpClient = await experimental_createMCPClient({
      transport: new StreamableHTTPClientTransport(
        new URL('http://localhost:3001/mcp')
      ),
    });

    // Combine tools from different MCP servers
    const stdioTools = await stdioClient.tools();
    const httpTools = await httpClient.tools();
    
    const tools = {
      ...stdioTools,
      ...httpTools,
    };

    const response = await streamText({
      model: openai('gpt-4o'),
      tools,
      prompt: prompt,
      onFinish: async () => {
        await stdioClient.close();
        await httpClient.close();
      },
      onError: async (error) => {
        await stdioClient.close();
        await httpClient.close();
      },
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error('Error in completion API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
*/
