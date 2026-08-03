// Lightweight AI helper for one-off, single-turn prompts (as opposed to
// the full chat experience in components/AIAssistant.tsx).

interface ExplainQuizAnswerParams {
    courseTitle: string;
    question: string;
    options: string[];
    selectedAnswerIndex: number;
    correctAnswerIndex: number;
}

export const aiService = {
    /**
     * Asks the AI for a concise (~2 sentence) explanation of why the
     * learner's selected quiz option was wrong and what the correct
     * concept is, given the question context.
     */
    explainQuizAnswer: async ({
        courseTitle,
        question,
        options,
        selectedAnswerIndex,
        correctAnswerIndex,
    }: ExplainQuizAnswerParams): Promise<string> => {
        const selectedOption = options[selectedAnswerIndex];
        const correctOption = options[correctAnswerIndex];

        const prompt = `You are a helpful, encouraging coding tutor for the course "${courseTitle}".

Quiz question: "${question}"
The learner selected: "${selectedOption}" (incorrect)
The correct answer is: "${correctOption}"

In exactly 2 short sentences, explain why the learner's choice was wrong and what the underlying concept behind the correct answer is. Do not use markdown, headers, or code fences. Be direct and simple.`;

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200,
            }),
        });

        if (!res.ok) {
            throw new Error(`OpenRouter API error: ${res.status}`);
        }

        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) {
            throw new Error('Empty response from AI');
        }
        return text;
    },
};