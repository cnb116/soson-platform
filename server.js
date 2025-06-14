require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// OpenAI 설정
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API 엔드포인트
app.post('/api/generate-proposal', async (req, res) => {
  try {
    const { product, target, goal } = req.body;

    if (!product || !target || !goal) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    const prompt = `다음 정보를 바탕으로 공동구매 제안서를 작성해주세요:

제품명: ${product}
대상 고객: ${target}
판매 목표 수량: ${goal}

제안서는 다음 5개 섹션으로 구성해주세요:
1. 제품 소개
2. 타겟 고객 분석
3. 기대 효과 및 매출
4. 마케팅 계획
5. 브랜드 협업 요청

각 섹션은 명확하고 전문적으로 작성해주세요.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 전문적인 공동구매 제안서 작성자입니다. 명확하고 전문적인 제안서를 작성해주세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const proposal = completion.data.choices[0].message.content;
    res.json({ proposal });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: '제안서 생성 중 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 