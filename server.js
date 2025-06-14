require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // 정적 파일 제공

// OpenAI 설정
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 제안서 생성 엔드포인트
app.post("/generate-proposal", async (req, res) => {
  try {
    const { product, target, goal } = req.body;

    // 입력값 검증
    if (!product || !target || !goal) {
      return res.status(400).json({ error: "모든 필드를 입력해주세요." });
    }

    const prompt = `너는 공동구매 기획 전문가야. 아래 정보를 바탕으로 제안서를 작성해줘.
    
제품명: ${product}
대상 고객: ${target}
판매 목표 수량: ${goal}

[형식]
1. 제품 소개
2. 대상 고객 분석
3. 기대 효과
4. 마케팅 계획
5. 브랜드 협력 요청사항`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const proposal = response.data.choices[0].message.content;
    res.json({ proposal });
  } catch (error) {
    console.error("GPT API 에러:", error);
    res.status(500).json({ 
      error: "제안서 생성 중 오류가 발생했습니다.",
      details: error.message 
    });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
}); 