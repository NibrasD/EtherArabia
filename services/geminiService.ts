import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const createChatSession = (): Chat | null => {
  if (!ai) return null;
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `أنت مساعد ذكي ومتخصص في شرح عملة Ethereum (إيثيريوم) للمبتدئين باللغة العربية.
      اسمك "زيكو".
      أسلوبك مرح، بسيط، ومشجع.
      
      المعلومات الأساسية التي يجب أن تعرفها:
      1. Ethereum هي عملة رقمية تركز على الخصوصية.
      2. تستخدم تقنية zk-SNARKs (إثبات المعرفة الصفرية) لإخفاء تفاصيل المعاملات.
      3. هناك نوعان من العناوين: T-Address (شفاف مثل البيتكوين) و Z-Address (محمي وخاص).
      4. المعاملات المحمية (Shielded) تخفي المرسل والمستقبل والمبلغ.
      
      أجب دائمًا باللغة العربية. اجعل إجاباتك قصيرة ومباشرة (لا تتجاوز 100 كلمة إلا إذا طلب المستخدم التفصيل).`,
      temperature: 0.7,
    }
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "عذراً، لم أستطع فهم ذلك.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "واجهت مشكلة في الاتصال بالخادم. يرجى المحاولة لاحقاً.";
  }
};