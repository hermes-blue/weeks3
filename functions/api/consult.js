export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { height, weight, photo } = await request.json();

    if (!env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenAI API Key is not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const messages = [
      {
        role: "system",
        content: "You are a professional personal stylist and fashion consultant. Your goal is to provide a detailed, encouraging, and highly personalized style consulting report based on the user's physical information (height, weight) and their photo.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze my style. My height is ${height}cm and my weight is ${weight}kg. Based on my photo and this information, provide a style report including:
            1. Body type analysis.
            2. Recommended clothing styles (tops, bottoms, outer).
            3. Color recommendations.
            4. Specific tips to enhance my look.
            
            Please respond in Korean and use a professional yet friendly tone.`,
          },
          ...(photo ? [{
            type: "image_url",
            image_url: {
              url: photo,
            },
          }] : []),
        ],
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ report: data.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
