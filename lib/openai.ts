import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateParentingScript(
  childName: string,
  situation: string,
  childAge: number
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert parenting coach specializing in positive discipline and neurodiversity-affirming strategies. 
Provide practical, evidence-based parenting scripts that are:
- Empathetic and respectful
- Age-appropriate
- Concrete and actionable
- Based on attachment theory and neuroscience
Format your response as a clear script with speaker labels (Parent/Caregiver).`,
      },
      {
        role: 'user',
        content: `My ${childAge}-year-old child named ${childName} is experiencing this situation: "${situation}"

Please provide a parenting script I can use in this moment. Include:
1. What to do in the moment
2. Exact words to use
3. What to avoid
4. Follow-up strategies`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0].message.content || ''
}
