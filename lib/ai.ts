import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Summarize a document using OpenAI via Vercel AI SDK.
 * 
 * @param documentText The extracted text from the PDF/Word document
 * @param length "short", "medium", or "detailed"
 * @returns The summarized text
 */
export async function summarizeDocument(
  documentText: string,
  length: "short" | "medium" | "detailed" = "medium"
): Promise<string> {
  let promptLength = "a concise summary (1-2 paragraphs)";
  if (length === "short") promptLength = "a very brief bullet-point summary";
  if (length === "detailed") promptLength = "a detailed and comprehensive summary";

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are an expert document summarizer. Your task is to extract the most important information and provide ${promptLength}.`,
      prompt: `Please summarize the following document content:\n\n${documentText.substring(0, 30000)} // truncate to prevent context limit errors`,
    });

    return text;
  } catch (error) {
    console.error("AI Summarization failed:", error);
    throw new Error("Failed to summarize document due to AI error");
  }
}
