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

    // 최신 Responses API 규격에 맞춘 바디 구성
    const body = {
      model: "gpt-4.1", // 사용자가 요청한 최신 모델
      input: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "You are a professional personal stylist and fashion consultant. Your goal is to provide a detailed, encouraging, and highly personalized style consulting report based on the user's physical information (height, weight) and their photo.",
            }
          ]
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
      ],
      text: {
        format: {
          type: "text"
        }
      },
      reasoning: {},
      tools: [],
      temperature: 1,
      max_output_tokens: 2048,
      top_p: 1,
      store: true,
      include: ["web_search_call.action.sources"] // 웹 검색 출처 포함 옵션
    };

    // 최신 Responses API 엔드포인트 호출
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Responses API는 결과를 output[0].text 형태로 반환함
    const reportContent = data.output && data.output[0] && data.output[0].text 
      ? data.output[0].text 
      : "분석 결과를 가져오지 못했습니다.";

    return new Response(JSON.stringify({ report: reportContent }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
