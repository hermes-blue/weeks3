const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");

admin.initializeApp();

// OpenAI API 클라이언트 초기화 (환경 변수 또는 시크릿 매니저를 통해 키를 주입받음)
// 실제 배포 시 firebase functions:secrets:set OPENAI_API_KEY=YOUR_KEY 명령어로 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || functions.config().openai?.key,
});

exports.getStyleAdvice = functions.https.onCall(async (data, context) => {
  const { height, weight, gender, photo } = data;

  if (!height || !weight) {
    throw new functions.https.HttpsError("invalid-argument", "Height and weight are required.");
  }

  try {
    const messages = [
      {
        role: "system",
        content: "당신은 전문 스타일 컨설턴트입니다. 사용자의 키, 몸무게, 성별에 따라 가장 어울리는 스타일 조언을 5줄 이내의 짧은 문장들로 제공하세요. 말투는 친절하고 전문적이어야 합니다.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `키: ${height}cm, 몸무게: ${weight}kg, 성별: ${gender || "비공개"}. 이 정보를 바탕으로 스타일링 조언을 해주세요.`,
          },
          ...(photo ? [{
            type: "image_url",
            image_url: { url: photo },
          }] : []),
        ],
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 300,
    });

    return { advice: response.choices[0].message.content };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
