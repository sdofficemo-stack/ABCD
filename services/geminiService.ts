import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HealthPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    weeklyPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          breakfast: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              healthBenefit: { type: Type.STRING },
            },
            required: ['name', 'description', 'ingredients', 'healthBenefit']
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              healthBenefit: { type: Type.STRING },
            },
            required: ['name', 'description', 'ingredients', 'healthBenefit']
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              healthBenefit: { type: Type.STRING },
            },
            required: ['name', 'description', 'ingredients', 'healthBenefit']
          },
          snack: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              healthBenefit: { type: Type.STRING },
            },
            required: ['name', 'description', 'ingredients', 'healthBenefit']
          },
        },
        required: ['day', 'breakfast', 'lunch', 'dinner', 'snack']
      }
    },
    shoppingList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          quantity: { type: Type.STRING },
          category: { 
            type: Type.STRING, 
            enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Condiments'] 
          },
        },
        required: ['item', 'quantity', 'category']
      }
    },
    advice: { type: Type.STRING }
  },
  required: ['weeklyPlan', 'shoppingList', 'advice']
};

export const generateHealthPlan = async (weekString: string): Promise<HealthPlanResponse> => {
  try {
    const prompt = `
      請為一位講繁體中文的使用者設計一週的「降膽固醇食譜」與「購物清單」。
      
      情境設定：
      1. 目標日期週次：${weekString}。
      2. 請根據此日期判斷「當季盛產」的蔬菜水果與漁獲。使用當季食材不僅新鮮，通常也更便宜。
      
      核心限制（重要）：
      1. **食材濃縮重複使用**：為了減少浪費並簡化採買，請先選定約 20 種核心食材（例如：3種葉菜、3種根莖瓜果、3種水果、3種蛋白質來源、少許堅果穀物等）。
      2. 這一週的所有食譜（早午晚）都應主要由這 20 種核心食材進行排列組合與變化烹飪方式。
      
      使用者健康狀況：
      1. 總膽固醇值近理想值上限。
      2. 低密度膽固醇 (LDL) 稍高。
      3. LDL/HDL 比值偏高。

      要求：
      1. 食譜：提供7天的早、午、晚、點心計畫。
      2. 購物清單分類：請務必依照「餐別用途」將購物清單分類（例如：早餐食材、午餐食材、晚餐食材）。
      
      飲食原則：
      - 增加可溶性纖維（燕麥、豆類、水果）。
      - 使用健康油脂（橄欖油、堅果、酪梨），嚴格限制飽和脂肪。
      - 攝取富含 Omega-3 的食物（深海魚類）。
      - 口味清淡，適合家庭烹飪。
      
      請確保：
      - 每一餐都要簡單說明為什麼對心血管有好處 (healthBenefit)。
      - 回傳繁體中文內容。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as HealthPlanResponse;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};