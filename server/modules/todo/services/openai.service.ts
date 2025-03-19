import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class OpenAIService {
    private openai: OpenAI;

    constructor() {
        // Get API key from .env file
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Generates a description based on a title and optional context
     * @param input - Object containing title and optional context information
     * @returns The generated description
     */
    async generateDescription(input: DescriptionInput): Promise<string> {
        try {
            if (!input.title) {
                throw new Error("Title is required to generate a description");
            }

            // Build context from available information
            const contextItems: string[] = [];

            // Add keywords if provided (and has at least 3 words)
            if (input.keywords && input.keywords.trim().length > 0) {
                const words = input.keywords.trim().split(/\s+/);
                if (words.length >= 3) {
                    contextItems.push(`Keywords: ${input.keywords.trim()}`);
                }
            }

            if (input.priority) {
                contextItems.push(`Priority: ${input.priority}`);
            }

            if (input.startDate) {
                const startDate = new Date(input.startDate);
                contextItems.push(`Start Date: ${startDate.toISOString().split('T')[0]}`);
            }

            if (input.dueDate) {
                const dueDate = new Date(input.dueDate);
                contextItems.push(`Due Date: ${dueDate.toISOString().split('T')[0]}`);
            }

            if (input.labels && input.labels.length > 0) {
                const labelNames = input.labels
                    .map(label => typeof label === 'string' ? label : label.name)
                    .join(', ');
                contextItems.push(`Labels: ${labelNames}`);
            }

            if (input.state) {
                contextItems.push(`Status: ${input.state}`);
            }

            // Enhanced system message for better descriptions
            const systemMessage = `You are a professional productivity assistant specialized in creating meaningful task descriptions.

Guidelines:
- Keep descriptions under 2-3 sentences
- Focus on clarifying specific actions needed to complete the task
- Be concise but include necessary details
- Always write in English with a professional tone
- Make descriptions actionable and clear
- Avoid generic descriptions or clichés
- Use active voice and precise verbs`;

            let userPrompt = "";

            // Format context as a string if we have any
            if (contextItems.length > 0) {
                const contextString = contextItems.join('\n');

                // If keywords were provided, make that clear in the prompt
                if (input.keywords && input.keywords.trim().split(/\s+/).length >= 3) {
                    userPrompt = `Create a detailed task description based on this title and the keywords provided:

Title: ${input.title}
${contextString}

Expand these keywords into a proper task description that explains what needs to be done, incorporating the context information like dates, priority, and labels where relevant.`;
                } else {
                    userPrompt = `Write a clear, concise description for the following task:

Title: ${input.title}
${contextString}

Create a description that would help someone understand what exactly needs to be done for this task.`;
                }
            } else {
                // If no context, just use the title
                userPrompt = `Write a clear, concise description for a task titled "${input.title}".

Focus on the most likely specific actions required to complete this task successfully. Avoid generic descriptions.`;
            }

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "system", content: systemMessage},
                    {role: "user", content: userPrompt}
                ],
                max_tokens: 200,
                temperature: 0.7,
            });

            return response.choices[0].message.content?.trim() || "Failed to generate description.";
        } catch (error) {
            console.error("OpenAI API error:", error);
            throw new Error("An error occurred while generating the description.");
        }
    }
}

export default new OpenAIService();
