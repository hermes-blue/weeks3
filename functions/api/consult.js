export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { height, weight, photo } = await request.json();
    console.log("Starting style analysis for:", { height, weight, hasPhoto: !!photo });

    if (!env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return new Response(JSON.stringify({ error: "OpenAI API Key is not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // OpenAI Chat Completions API (가장 안정적인 방식)
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

    console.log("Calling OpenAI API...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // 검증된 모델 사용
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("OpenAI API Response status:", response.status);

    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 결과 추출
    const reportContent = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content
      : "분석 결과를 생성하지 못했습니다. (응답 구조 확인 필요)";

    console.log("Analysis complete. Sending report to client.");
    return new Response(JSON.stringify({ report: reportContent }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
