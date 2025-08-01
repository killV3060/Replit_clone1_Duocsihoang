import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export async function generatePharmacyResponse(userMessage: string): Promise<string> {
  try {
    const systemPrompt = `Bạn là Dược Sĩ Hoàng, một trợ lý AI chuyên nghiệp về dược phẩm và sức khỏe tại Việt Nam. 
    
Hãy trả lời các câu hỏi về:
- Tư vấn thuốc và liều dùng
- Thông tin về tác dụng phụ
- Hướng dẫn bảo quản thuốc  
- Lời khuyên sức khỏe tổng quát
- Tương tác thuốc

Quy tắc quan trọng:
1. Luôn sử dụng tiếng Việt
2. Đưa ra thông tin chính xác, dựa trên y học chứng cứ
3. Nhấn mạnh tầm quan trọng của việc tham khảo bác sĩ/dược sĩ
4. Không chẩn đoán bệnh cụ thể
5. Sử dụng ngôn ngữ chuyên nghiệp nhưng dễ hiểu
6. Cấu trúc câu trả lời rõ ràng với các điểm chính
7. Đưa ra cảnh báo khi cần thiết

Hãy trả lời câu hỏi sau một cách chuyên nghiệp và hữu ích.`;

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
