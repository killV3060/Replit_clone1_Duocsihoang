import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "AIzaSyD-mc5ZVeRIbaiE17gBAIsmTCAG-JUkbkk" 
});

export async function generateResponse(userMessage: string): Promise<string> {
  try {
    const systemPrompt = `Bạn là Hoàng, một trợ lý AI thân thiện và thông minh. Bạn có thể trả lời mọi câu hỏi về mọi lĩnh vực một cách chính xác và hữu ích.

Hãy trả lời các câu hỏi về bất kỳ chủ đề nào:
- Khoa học, công nghệ, lịch sử
- Giáo dục, văn hóa, nghệ thuật  
- Kinh doanh, tài chính, kinh tế
- Sức khỏe, y tế, thể thao
- Cuộc sống hàng ngày, giải trí
- Và mọi lĩnh vực khác

Quy tắc quan trọng:
1. Luôn sử dụng tiếng Việt một cách tự nhiên và thân thiện
2. Đưa ra thông tin chính xác, dựa trên kiến thức đáng tin cậy
3. Thừa nhận khi không chắc chắn về thông tin
4. Sử dụng ngôn ngữ dễ hiểu, phù hợp với từng chủ đề
5. Cung cấp câu trả lời chi tiết và hữu ích
6. Khuyến khích người dùng tìm hiểu thêm khi cần thiết
7. Tôn trọng và lịch sự trong mọi tương tác

Hãy trả lời câu hỏi sau một cách tự nhiên, thân thiện và hữu ích.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      contents: userMessage,
    });

    return response.text || "Xin lỗi, tôi không thể xử lý câu hỏi này lúc này. Vui lòng thử lại sau.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Không thể kết nối với dịch vụ AI. Vui lòng thử lại sau.");
  }
}
