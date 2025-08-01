import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generatePharmacyResponse } from "./services/gemini";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  sessionId: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get chat history for a session
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getRecentMessages(sessionId);
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ 
        message: "Không thể tải lịch sử chat" 
      });
    }
  });

  // Send a message and get AI response
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = chatRequestSchema.parse(req.body);

      // Save user message
      const userMessage = await storage.createMessage({
        content: message,
        role: "user",
        sessionId,
      });

      // Generate AI response
      const aiResponse = await generatePharmacyResponse(message);

      // Save AI response
      const assistantMessage = await storage.createMessage({
        content: aiResponse,
        role: "assistant", 
        sessionId,
      });

      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: error.errors,
        });
      }

      res.status(500).json({
        message: error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý tin nhắn",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
