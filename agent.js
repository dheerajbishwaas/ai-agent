const { ChatGroq } = require("@langchain/groq");
const { DynamicStructuredTool } = require("@langchain/core/tools");
const { createReactAgent } = require("@langchain/langgraph/prebuilt");
const { z } = require("zod");
const db = require("./db");

// 1. Define the LLM
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY,
  temperature: 0.2, // Low temperature for more factual responses
});

// 2. Define the Tool
const checkParentDetailsTool = new DynamicStructuredTool({
  name: "check_parent_details",
  description: "Use this tool to check the database for student details based on parent name and phone number. Always confirm both name and 10-digit number from the user before using this.",
  schema: z.object({
    parentName: z.string().describe("The name of the parent."),
    phoneNumber: z.string().describe("The 10-digit phone number of the parent."),
  }),
  func: async ({ parentName, phoneNumber }) => {
    const result = db.fetchStudentDetails(parentName, phoneNumber);
    return JSON.stringify(result);
  },
});

const logUnansweredQueryTool = new DynamicStructuredTool({
  name: "log_unanswered_query",
  description: "Use this tool ONLY when the user asks a general question about the school that you do not know the answer to. This saves their question so admins can review and add the answer later.",
  schema: z.object({
    query: z.string().describe("The user's exact unanswered question."),
    parentName: z.string().optional().describe("Parent's name if known in the context."),
    phoneNumber: z.string().optional().describe("Parent's phone number if known in the context."),
  }),
  func: async ({ query, parentName, phoneNumber }) => {
    const result = db.logUnansweredQuery(query, parentName, phoneNumber);
    return JSON.stringify(result);
  },
});

const tools = [checkParentDetailsTool, logUnansweredQueryTool];

// 3. Create the LangGraph React Agent
const agent = createReactAgent({
  llm,
  tools,
  stateModifier: `You are a helpful and polite customer support agent for TutoHub School. 
Your job is to assist parents with their queries regarding their children.
To provide specific information like fees, attendance, or remarks, you MUST first verify them in the database.
To verify, you MUST ask for their Name and 10-digit Phone Number. 
If they provide only a name, ask for the phone number. Do not make up any data.
Once you have both, use the 'check_parent_details' tool to find the student record.
If the record is found, use the data to politely answer the parent's query.

CRITICAL RULES TO AVOID HALLUCINATION:
1. NEVER invent or make up teacher names, phone numbers, or any details not explicitly provided by the database tool. 
2. If the user asks for contact details (like the teacher's number) and it's not in the database response, clearly state that you do not have that information.
3. If the user asks a general question about the school (like bus fees, holidays, admissions) that you do not know the answer to, DO NOT make up an answer. Instead, use the 'log_unanswered_query' tool to save their question. After using the tool, tell the user politely that you have logged their question.

Answer concisely in a helpful tone. You can speak in English or Hinglish depending on the user.`,
});

/**
 * Main function to interact with the LangGraph agent
 */
async function chatWithAgent(message, chatHistory = []) {
  try {
    const messages = [...chatHistory, { role: "user", content: message }];
    
    // Invoke the langgraph agent state
    const result = await agent.invoke({
      messages: messages
    });
    
    // LOGGING: Taki aap console mein dekh sakein AI ne kitne steps liye
    console.log("\n--- AI REASONING STEPS ---");
    // Only log the new messages generated during this run
    result.messages.slice(messages.length).forEach((msg, checkId) => {
        let role = msg._getType() === 'ai' ? '🤖 AI' : (msg._getType() === 'tool' ? '⚙️ Tool Output' : '👤 User');
        console.log(`[Step ${checkId + 1}] ${role}: ${msg.content || JSON.stringify(msg.tool_calls)}`);
    });
    console.log("--------------------------\n");

    // The final result.messages array contains the newly generated AI response at the end
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.content;
  } catch (error) {
    console.error("Error in Agent:", error);
    return "Maaf kijiye, abhi kuch technical issue hai. Kripya thodi der baad koshish karein.";
  }
}

module.exports = {
  chatWithAgent
};
