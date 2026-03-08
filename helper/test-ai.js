const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testAI() {
    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log("Gemini Key:", geminiApiKey ? "Exists" : "MISSING");

    if (!geminiApiKey) return;

    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(["Hi, reply with test"]);
        const response = await result.response;
        console.log("Gemini Success:", response.text());
    } catch (e) {
        console.error("Gemini Error:", e.message);
    }
}

testAI();
